import { supabaseAdmin } from '../config/database';

async function testConnection() {
  console.log('🔍 Testing Supabase connection...\n');

  // Test 1: Check if we can connect
  try {
    const { data, error } = await supabaseAdmin
      .from('users')
      .select('count')
      .limit(1);

    if (error) {
      console.error('❌ Supabase connection failed:', error.message);
      console.error('   Error details:', error);
      return;
    }

    console.log('✅ Supabase connection successful!');
  } catch (err: any) {
    console.error('❌ Unexpected error:', err.message);
    return;
  }

  // Test 2: Check if users table exists
  try {
    const { data: users, error } = await supabaseAdmin
      .from('users')
      .select('*')
      .limit(1);

    if (error) {
      console.error('❌ Users table error:', error.message);
      console.error('\n💡 Make sure you have run the database migration:');
      console.error('   backend/supabase/migrations/001_initial_schema.sql');
      return;
    }

    console.log('✅ Users table exists!');
    console.log(`   Found ${users?.length || 0} users`);
  } catch (err: any) {
    console.error('❌ Error checking users table:', err.message);
  }

  // Test 3: Try to create a test user
  try {
    const testEmail = `test-${Date.now()}@example.com`;
    console.log(`\n🧪 Trying to create test user: ${testEmail}`);

    const { data: newUser, error } = await supabaseAdmin
      .from('users')
      .insert({
        email: testEmail,
        username: 'Test User'
      })
      .select()
      .single();

    if (error) {
      console.error('❌ Failed to create test user:', error.message);
      console.error('   Error details:', error);
      console.error('\n💡 Possible issues:');
      console.error('   1. RLS (Row Level Security) policies may be blocking inserts');
      console.error('   2. Users table does not exist');
      console.error('   3. Supabase credentials are incorrect');
      return;
    }

    console.log('✅ Test user created successfully!');
    console.log(`   User ID: ${newUser.id}`);

    // Clean up test user
    await supabaseAdmin.from('users').delete().eq('id', newUser.id);
    console.log('✅ Test user cleaned up');

  } catch (err: any) {
    console.error('❌ Error creating test user:', err.message);
  }

  console.log('\n✅ All tests passed! Your Supabase configuration is correct.');
}

testConnection().catch(console.error);
