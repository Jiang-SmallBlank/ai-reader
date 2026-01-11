-- 修复 RLS 策略，允许 INSERT 操作
-- 在 Supabase SQL Editor 中运行这个脚本

-- 1. 首先禁用 RLS 以允许开发和测试
ALTER TABLE users DISABLE ROW LEVEL SECURITY;

-- 2. 重新启用 RLS
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- 3. 删除旧的策略（如果存在）
DROP POLICY IF EXISTS "Users can insert own users" ON users;
DROP POLICY IF EXISTS "Users can view own profile" ON users;

-- 4. 创建新的宽松策略（开发环境）
-- 允许任何人查看和插入用户（开发模式）
CREATE POLICY "Allow all access to users for development" ON users
    FOR ALL
    USING (true)
    WITH CHECK (true);

-- 5. 对其他表也应用相同的宽松策略（开发环境）
ALTER TABLE books ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow all access to books for development" ON books
    FOR ALL
    USING (true)
    WITH CHECK (true);

ALTER TABLE reading_progress ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow all access to reading_progress for development" ON reading_progress
    FOR ALL
    USING (true)
    WITH CHECK (true);

ALTER TABLE reading_sessions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow all access to reading_sessions for development" ON reading_sessions
    FOR ALL
    USING (true)
    WITH CHECK (true);

ALTER TABLE bookmarks ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow all access to bookmarks for development" ON bookmarks
    FOR ALL
    USING (true)
    WITH CHECK (true);

ALTER TABLE quotes ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow all access to quotes for development" ON quotes
    FOR ALL
    USING (true)
    WITH CHECK (true);

ALTER TABLE insights ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow all access to insights for development" ON insights
    FOR ALL
    USING (true)
    WITH CHECK (true);

ALTER TABLE weekly_reports ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow all access to weekly_reports for development" ON weekly_reports
    FOR ALL
    USING (true)
    WITH CHECK (true);

ALTER TABLE user_achievements ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow all access to user_achievements for development" ON user_achievements
    FOR ALL
    USING (true)
    WITH CHECK (true);

ALTER TABLE reading_activity ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow all access to reading_activity for development" ON reading_activity
    FOR ALL
    USING (true)
    WITH CHECK (true);

ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow all access to notifications for development" ON notifications
    FOR ALL
    USING (true)
    WITH CHECK (true);

-- 完成！
SELECT 'RLS policies updated for development' AS status;
