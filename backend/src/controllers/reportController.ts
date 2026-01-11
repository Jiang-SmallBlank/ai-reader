import { Response } from 'express';
import { supabase } from '../config/database';
import { AuthRequest } from '../middleware/auth';
import { AppError } from '../middleware/error';

export const getWeeklyReport = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.userId) {
      throw new AppError('Unauthorized', 401);
    }

    const { startDate, endDate } = req.query;

    if (!startDate || !endDate) {
      throw new AppError('Start and end dates are required', 400);
    }

    const { data: report, error } = await supabase
      .from('weekly_reports')
      .select('*')
      .eq('user_id', req.userId)
      .eq('week_start', startDate)
      .single();

    if (error) {
      // Report doesn't exist, generate it
      await generateWeeklyReport(req.userId, startDate as string, endDate as string);

      const { data: newReport } = await supabase
        .from('weekly_reports')
        .select('*')
        .eq('user_id', req.userId)
        .eq('week_start', startDate)
        .single();

      res.json(newReport);
      return;
    }

    res.json(report);
  } catch (error) {
    if (error instanceof AppError) {
      res.status(error.statusCode).json({ error: error.message });
    } else {
      res.status(500).json({ error: 'Internal server error' });
    }
  }
};

export const getWeeklyStats = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.userId) {
      throw new AppError('Unauthorized', 401);
    }

    const { weekStart } = req.query;

    if (!weekStart) {
      throw new AppError('Week start date is required', 400);
    }

    const startDate = new Date(weekStart as string);
    const endDate = new Date(startDate);
    endDate.setDate(endDate.getDate() + 7);

    // Get reading sessions for the week
    const { data: sessions } = await supabase
      .from('reading_sessions')
      .select('*')
      .eq('user_id', req.userId)
      .gte('started_at', startDate.toISOString())
      .lt('started_at', endDate.toISOString())
      .eq('status', 'completed');

    // Calculate daily stats
    const dailyStats = [];
    const dayNames = ['周一', '周二', '周三', '周四', '周五', '周六', '周日'];

    for (let i = 0; i < 7; i++) {
      const dayDate = new Date(startDate);
      dayDate.setDate(dayDate.getDate() + i);
      const dayStart = new Date(dayDate.setHours(0, 0, 0, 0));
      const dayEnd = new Date(dayDate.setHours(23, 59, 59, 999));

      const daySessions = sessions?.filter(s => {
        const sessionDate = new Date(s.started_at);
        return sessionDate >= dayStart && sessionDate <= dayEnd;
      }) || [];

      const totalMinutes = daySessions.reduce(
        (sum, s) => sum + (s.duration_seconds || 0) / 60,
        0
      );

      dailyStats.push({
        day: dayNames[i],
        minutes: Math.round(totalMinutes)
      });
    }

    res.json(dailyStats);
  } catch (error) {
    if (error instanceof AppError) {
      res.status(error.statusCode).json({ error: error.message });
    } else {
      res.status(500).json({ error: 'Internal server error' });
    }
  }
};

export const getInsights = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.userId) {
      throw new AppError('Unauthorized', 401);
    }

    const { limit = 10 } = req.query;

    const { data: insights, error } = await supabase
      .from('insights')
      .select('*, books(title, author)')
      .eq('user_id', req.userId)
      .order('created_at', { ascending: false })
      .limit(parseInt(limit as string));

    if (error) {
      throw new AppError('Failed to fetch insights', 500);
    }

    // Transform to match frontend format
    const formattedInsights = insights?.map(insight => ({
      id: insight.id,
      type: insight.type,
      bookTitle: insight.books?.title || 'Unknown',
      content: insight.content,
      subText: insight.sub_text
    })) || [];

    res.json(formattedInsights);
  } catch (error) {
    if (error instanceof AppError) {
      res.status(error.statusCode).json({ error: error.message });
    } else {
      res.status(500).json({ error: 'Internal server error' });
    }
  }
};

export const getReadingHeatmap = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.userId) {
      throw new AppError('Unauthorized', 401);
    }

    // Get last year of activity
    const startDate = new Date();
    startDate.setFullYear(startDate.getFullYear() - 1);

    const { data: activities, error } = await supabase
      .from('reading_activity')
      .select('*')
      .eq('user_id', req.userId)
      .gte('activity_date', startDate.toISOString().split('T')[0])
      .order('activity_date', { ascending: true });

    if (error) {
      throw new AppError('Failed to fetch reading activity', 500);
    }

    // Format for heatmap (last 40 days for the UI)
    const heatmapData = activities?.slice(-40).map(a => ({
      date: a.activity_date,
      pages: a.pages_read,
      time: a.reading_time_seconds
    })) || [];

    res.json(heatmapData);
  } catch (error) {
    if (error instanceof AppError) {
      res.status(error.statusCode).json({ error: error.message });
    } else {
      res.status(500).json({ error: 'Internal server error' });
    }
  }
};

export const getProfileStats = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.userId) {
      throw new AppError('Unauthorized', 401);
    }

    // Get total reading time
    const { data: timeData } = await supabase
      .from('reading_sessions')
      .select('duration_seconds')
      .eq('user_id', req.userId)
      .eq('status', 'completed');

    const totalHours = timeData?.reduce((sum, s) => sum + (s.duration_seconds || 0), 0) || 0;

    // Get finished books
    const { count: finishedBooks } = await supabase
      .from('reading_progress')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', req.userId)
      .eq('is_finished', true);

    // Get current streak (consecutive days with activity)
    const { data: activities } = await supabase
      .from('reading_activity')
      .select('activity_date')
      .eq('user_id', req.userId)
      .order('activity_date', { ascending: false })
      .limit(100);

    let streak = 0;
    if (activities && activities.length > 0) {
      const today = new Date().toISOString().split('T')[0];
      let checkDate = new Date();

      for (const activity of activities) {
        const dateStr = checkDate.toISOString().split('T')[0];
        if (activity.activity_date === dateStr || activity.activity_date === new Date(checkDate.getTime() - 86400000).toISOString().split('T')[0]) {
          streak++;
          checkDate = new Date(checkDate.getTime() - 86400000);
        } else {
          break;
        }
      }
    }

    res.json({
      total_reading_hours: Math.round(totalHours / 3600),
      finished_books: finishedBooks || 0,
      current_streak: streak
    });
  } catch (error) {
    if (error instanceof AppError) {
      res.status(error.statusCode).json({ error: error.message });
    } else {
      res.status(500).json({ error: 'Internal server error' });
    }
  }
};

export const getAchievements = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.userId) {
      throw new AppError('Unauthorized', 401);
    }

    // Get user's achievements
    const { data: userAchievements } = await supabase
      .from('user_achievements')
      .select('*, achievements(*)')
      .eq('user_id', req.userId);

    // Get all available achievements
    const { data: allAchievements } = await supabase
      .from('achievements')
      .select('*');

    res.json({
      earned: userAchievements?.map(ua => ({
        ...ua.achievements,
        earned_at: ua.earned_at
      })) || [],
      total: allAchievements?.length || 0
    });
  } catch (error) {
    if (error instanceof AppError) {
      res.status(error.statusCode).json({ error: error.message });
    } else {
      res.status(500).json({ error: 'Internal server error' });
    }
  }
};

// Helper function to generate weekly reports
async function generateWeeklyReport(userId: string, startDate: string, endDate: string) {
  const start = new Date(startDate);
  const end = new Date(endDate);

  // Get reading sessions
  const { data: sessions } = await supabase
    .from('reading_sessions')
    .select('*')
    .eq('user_id', userId)
    .gte('started_at', start.toISOString())
    .lt('started_at', end.toISOString())
    .eq('status', 'completed');

  // Get finished books
  const { count: finishedBooks } = await supabase
    .from('reading_progress')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', userId)
    .eq('is_finished', true)
    .gte('updated_at', start.toISOString())
    .lt('updated_at', end.toISOString());

  // Calculate totals
  const totalPages = sessions?.reduce((sum, s) => sum + (s.pages_read || 0), 0) || 0;
  const totalSeconds = sessions?.reduce((sum, s) => sum + (s.duration_seconds || 0), 0) || 0;

  // Calculate streak
  const { data: activities } = await supabase
    .from('reading_activity')
    .select('activity_date')
    .eq('user_id', userId)
    .gte('activity_date', startDate)
    .lte('activity_date', endDate);

  const activeDays = new Set(activities?.map(a => a.activity_date) || []);

  // Create report
  await supabase
    .from('weekly_reports')
    .insert({
      user_id: userId,
      week_start: startDate,
      week_end: endDate,
      total_pages_read: totalPages,
      total_reading_time_seconds: totalSeconds,
      books_finished: finishedBooks || 0,
      new_vocabulary: 0, // TODO: Implement vocabulary tracking
      streak_weeks: activeDays.size >= 5 ? 1 : 0,
      stats_json: {
        total_sessions: sessions?.length || 0,
        active_days: activeDays.size
      }
    });
}
