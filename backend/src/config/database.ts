import { createClient, SupabaseClient } from '@supabase/supabase-js';

// 从环境变量获取配置
const supabaseUrl = process.env.SUPABASE_URL! || 'https://agmilsykpuxqqwkurbgj.supabase.co';
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY! || 'sb_publishable_fYdVJG3IANtlqBxMs1vkeA_n8zwVLre';

if (!supabaseUrl || !supabaseAnonKey) {
  const error = new Error('Missing Supabase environment variables');
  console.error('❌ 请设置 .env 文件中的 SUPABASE_URL 和 SUPABASE_ANON_KEY');
  throw error;
}

// 创建 Supabase 客户端
export const supabase: SupabaseClient = createClient(supabaseUrl, supabaseAnonKey);

// 管理员客户端使用相同的连接（开发环境）
// 生产环境应该使用 service_role key 来绕过 RLS
export const supabaseAdmin: SupabaseClient = supabase;
