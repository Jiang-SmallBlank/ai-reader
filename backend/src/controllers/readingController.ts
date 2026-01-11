import { Response } from 'express';
import { supabase } from '../config/database';
import { AuthRequest } from '../middleware/auth';
import { AppError } from '../middleware/error';

export const getReadingProgress = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.userId) {
      throw new AppError('Unauthorized', 401);
    }

    const { bookId } = req.params;

    const { data: progress, error } = await supabase
      .from('reading_progress')
      .select('*')
      .eq('book_id', bookId)
      .eq('user_id', req.userId)
      .single();

    if (error) {
      throw new AppError('Progress not found', 404);
    }

    res.json(progress);
  } catch (error) {
    if (error instanceof AppError) {
      res.status(error.statusCode).json({ error: error.message });
    } else {
      res.status(500).json({ error: 'Internal server error' });
    }
  }
};

export const updateReadingProgress = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.userId) {
      throw new AppError('Unauthorized', 401);
    }

    const { bookId } = req.params;
    const { current_page, current_position, progress_percentage, is_finished } = req.body;

    // Check if progress exists
    const { data: existing } = await supabase
      .from('reading_progress')
      .select('*')
      .eq('book_id', bookId)
      .eq('user_id', req.userId)
      .single();

    const updateData: any = {
      last_read_at: new Date().toISOString()
    };

    if (current_page !== undefined) updateData.current_page = current_page;
    if (current_position !== undefined) updateData.current_position = current_position;
    if (progress_percentage !== undefined) updateData.progress_percentage = progress_percentage;
    if (is_finished !== undefined) updateData.is_finished = is_finished;

    let progress;
    if (existing) {
      const { data, error } = await supabase
        .from('reading_progress')
        .update(updateData)
        .eq('book_id', bookId)
        .eq('user_id', req.userId)
        .select()
        .single();

      if (error) throw new AppError('Failed to update progress', 500);
      progress = data;
    } else {
      const { data, error } = await supabase
        .from('reading_progress')
        .insert({
          user_id: req.userId,
          book_id: bookId,
          ...updateData
        })
        .select()
        .single();

      if (error) throw new AppError('Failed to create progress', 500);
      progress = data;
    }

    res.json(progress);
  } catch (error) {
    if (error instanceof AppError) {
      res.status(error.statusCode).json({ error: error.message });
    } else {
      res.status(500).json({ error: 'Internal server error' });
    }
  }
};

export const startReadingSession = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.userId) {
      throw new AppError('Unauthorized', 401);
    }

    const { bookId } = req.params;

    const { data: session, error } = await supabase
      .from('reading_sessions')
      .insert({
        user_id: req.userId,
        book_id: bookId,
        status: 'active'
      })
      .select()
      .single();

    if (error || !session) {
      throw new AppError('Failed to start reading session', 500);
    }

    res.status(201).json(session);
  } catch (error) {
    if (error instanceof AppError) {
      res.status(error.statusCode).json({ error: error.message });
    } else {
      res.status(500).json({ error: 'Internal server error' });
    }
  }
};

export const endReadingSession = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.userId) {
      throw new AppError('Unauthorized', 401);
    }

    const { sessionId } = req.params;
    const { pages_read, focus_score } = req.body;

    // Get session to calculate duration
    const { data: session } = await supabase
      .from('reading_sessions')
      .select('*')
      .eq('id', sessionId)
      .eq('user_id', req.userId)
      .single();

    if (!session) {
      throw new AppError('Session not found', 404);
    }

    const duration_seconds = Math.floor(
      (new Date().getTime() - new Date(session.started_at).getTime()) / 1000
    );

    const { data: updatedSession, error } = await supabase
      .from('reading_sessions')
      .update({
        ended_at: new Date().toISOString(),
        duration_seconds,
        pages_read: pages_read || 0,
        focus_score,
        status: 'completed'
      })
      .eq('id', sessionId)
      .select()
      .single();

    if (error || !updatedSession) {
      throw new AppError('Failed to end reading session', 500);
    }

    // Update reading activity
    const today = new Date().toISOString().split('T')[0];
    await supabase
      .from('reading_activity')
      .upsert({
        user_id: req.userId,
        activity_date: today,
        pages_read: pages_read || 0,
        reading_time_seconds: duration_seconds
      }, {
        onConflict: 'user_id,activity_date'
      });

    res.json(updatedSession);
  } catch (error) {
    if (error instanceof AppError) {
      res.status(error.statusCode).json({ error: error.message });
    } else {
      res.status(500).json({ error: 'Internal server error' });
    }
  }
};

export const getBookmarks = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.userId) {
      throw new AppError('Unauthorized', 401);
    }

    const { bookId } = req.query;

    let query = supabase
      .from('bookmarks')
      .select('*')
      .eq('user_id', req.userId)
      .order('created_at', { ascending: false });

    if (bookId) {
      query = query.eq('book_id', bookId);
    }

    const { data: bookmarks, error } = await query;

    if (error) {
      throw new AppError('Failed to fetch bookmarks', 500);
    }

    res.json(bookmarks || []);
  } catch (error) {
    if (error instanceof AppError) {
      res.status(error.statusCode).json({ error: error.message });
    } else {
      res.status(500).json({ error: 'Internal server error' });
    }
  }
};

export const createBookmark = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.userId) {
      throw new AppError('Unauthorized', 401);
    }

    const { book_id, page_number, chapter, position_json, note } = req.body;

    const { data: bookmark, error } = await supabase
      .from('bookmarks')
      .insert({
        user_id: req.userId,
        book_id,
        page_number,
        chapter,
        position_json,
        note
      })
      .select()
      .single();

    if (error || !bookmark) {
      throw new AppError('Failed to create bookmark', 500);
    }

    res.status(201).json(bookmark);
  } catch (error) {
    if (error instanceof AppError) {
      res.status(error.statusCode).json({ error: error.message });
    } else {
      res.status(500).json({ error: 'Internal server error' });
    }
  }
};

export const deleteBookmark = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.userId) {
      throw new AppError('Unauthorized', 401);
    }

    const { id } = req.params;

    const { error } = await supabase
      .from('bookmarks')
      .delete()
      .eq('id', id)
      .eq('user_id', req.userId);

    if (error) {
      throw new AppError('Failed to delete bookmark', 500);
    }

    res.status(204).send();
  } catch (error) {
    if (error instanceof AppError) {
      res.status(error.statusCode).json({ error: error.message });
    } else {
      res.status(500).json({ error: 'Internal server error' });
    }
  }
};

export const getQuotes = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.userId) {
      throw new AppError('Unauthorized', 401);
    }

    const { bookId } = req.query;

    let query = supabase
      .from('quotes')
      .select('*')
      .eq('user_id', req.userId)
      .order('created_at', { ascending: false });

    if (bookId) {
      query = query.eq('book_id', bookId);
    }

    const { data: quotes, error } = await query;

    if (error) {
      throw new AppError('Failed to fetch quotes', 500);
    }

    res.json(quotes || []);
  } catch (error) {
    if (error instanceof AppError) {
      res.status(error.statusCode).json({ error: error.message });
    } else {
      res.status(500).json({ error: 'Internal server error' });
    }
  }
};

export const createQuote = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.userId) {
      throw new AppError('Unauthorized', 401);
    }

    const { book_id, content, page_number, chapter, tags, is_favorite } = req.body;

    const { data: quote, error } = await supabase
      .from('quotes')
      .insert({
        user_id: req.userId,
        book_id,
        content,
        page_number,
        chapter,
        tags: tags || [],
        is_favorite: is_favorite || false
      })
      .select()
      .single();

    if (error || !quote) {
      throw new AppError('Failed to create quote', 500);
    }

    res.status(201).json(quote);
  } catch (error) {
    if (error instanceof AppError) {
      res.status(error.statusCode).json({ error: error.message });
    } else {
      res.status(500).json({ error: 'Internal server error' });
    }
  }
};
