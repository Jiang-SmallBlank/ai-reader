import { supabaseAdmin } from '../config/database';

async function seed() {
  console.log('🌱 Seeding database...');

  // Create sample user
  const { data: user, error: userError } = await supabaseAdmin
    .from('users')
    .upsert({
      email: 'demo@example.com',
      username: 'Alex Rivers',
      avatar_url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAwxlv9nfWSgGBLZ7P0CIhuMZuNRRomGzrm39lStC7rL5LBSa-XGuN7C-zXm3czmM_Cp4Pv-PJs6OGQ8i795Bm43EkJ4LqRd1K_cseoGtiG2-QzzMyyTRUYgQd3cx0tQ-k2-wGeCqU8134KA2n1Gr3ijAdIHEwU0rdP3zCaaluhh2LAaRwlL-AfVptOZT-KFcGxxLTrUtcdMucET-gjS0NkZY3spfwUdnxcV2NXl1NaNE5hwFKiUdtCphfgt2yFseo5FJbkZKn_dPnd',
      role: 'premium',
      preferences: {
        darkMode: false,
        notifications: true,
        fontSize: 'medium'
      },
      reading_goal: 24
    })
    .select()
    .single();

  if (userError) {
    console.error('Error creating user:', userError);
    return;
  }

  console.log('✅ Created user:', user.email);

  const userId = user.id;

  // Sample books
  const books = [
    {
      user_id: userId,
      title: '了不起的盖茨比',
      author: 'F. Scott Fitzgerald',
      cover_url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD5sSH8rsPi8jMT3ykaLNQALKDYbjoDSgxm57qHu9YzTMKgY10uuQB22VzfBoHPZ2tGm1UQGLZAXW9Qb9jK2iIK8i4U_Bg37TQGG2-UTm6wWaxhZGKDriGPs6TiSYblKx_GcSORuYWzxbSmPKinG3SfzYt8biCvGsDaQfde73F-5F3UtPlRW68WrL7b3bwjh0YKvcG9UTHg-nFJr_tKt_TE905BeGJMZiG2lMm-z_RxLivp1luQSPs_bjAhyVaW5g9SSfatdIc0tSQB',
      category: '小说',
      total_pages: 180,
      description: '一部关于美国梦的经典小说'
    },
    {
      user_id: userId,
      title: '原子习惯',
      author: 'James Clear',
      cover_url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDda1Q6rNWG3Lcdmcx6FT8oVcL0R6KKUX_GmdWZX3NbJdQ2vDXnvqs_kJypFoC0WzWu_FLpYBry-CenAaRb_RtrkKj2i4bMOLtuPuhKINQ44k8BAK8RZiosquCnO_St_hBucAJKn9Bq8UQWvhCBnQn5Gz4rUH55X9uDmT0sz4ku4rZquGdiPGbuUG-vN4uqx9gJ0tVgaYM0QwJnnHpQwraSTFTnbcXl2wPSJRfQQSNNs8HfNz6_VlR1nALzcQDXs68cKZC2phoeka1k',
      category: '自我提升',
      total_pages: 320,
      description: '通过微小的改变建立好习惯，戒除坏习惯'
    },
    {
      user_id: userId,
      title: '沙丘',
      author: 'Frank Herbert',
      cover_url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAerTz7HMgURL21xxvZbWEx6UyMoVBGO_4XyVRrShqbPmRfx3ApC-6OngJQOnU4mPTFZkaB5ztqxwz47pdbUo43-2aErtCSbgDX6Kk6t7nZ--GyqBvwOiTxxd5RS9_Ov5AP_yrWA1SlyONJ3LW2qPMeHPXsSNpvSx4zgW4epvw1LON62c6W7_fy-NJwvcHAEVJnvuAmAardmxMWPodeCXp6mUDuJTlV-WE8pdJ2L76GAttWw7Ni_gG3b7gl-uvK6496Cz7w9xtgpVmV',
      category: '科幻',
      total_pages: 412,
      description: '科幻史诗巨作'
    },
    {
      user_id: userId,
      title: '思考，快与慢',
      author: 'Daniel Kahneman',
      cover_url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDacpQKC5v9RHGBoKgYyF2shdmhljfTyrvHnSHLu6JIiqQsZqc1aAW6LZNNixlT_sPL8SzEZIIZTkFBET8YZl6i36fE1f9GgFCGV9RITSSv6IbxAE29IiQ0IRET147l6jYI4H_QoU94t8xcK3ya8nHPWiMW0AdotA_MQvzXcnVfDLLbo-2UywHeBFRHxo6EwliN5qKp0eg75caQgZEPsYLOqfkn1DrvgMlBrZb2DhuZ0U90WXQSl2L0kNrw-63p0keuPrZZJQTahMGa',
      category: '心理学',
      total_pages: 499,
      description: '诺贝尔奖得主关于人类思维的著作'
    },
    {
      user_id: userId,
      title: '牧羊少年奇幻之旅',
      author: 'Paulo Coelho',
      cover_url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBEykKDgN8uTRvqhANDjnfjacHSQTr7-ZhSwuTsqz9Eao1J5ibIDDT651BtueDsd-bEuub2-oFbzDU_z9YEOqKRpqF1mqi3HhjPIl272etDHVBg4dYiDfmxSQHdKeiYlKzFZC7unNAn-0bE9_gLdpL-k-uWbHMrD0ZSHJxPcfF1Agk-5hkt1hng45TuzMDdKW3olY5mzF1dktUvRIModpraVGMEpEdy3DKGzah7omsX1qmXCMbnTWMzO2jBzGlsHKYGkZIfGbF2V1ru',
      category: '小说',
      total_pages: 208,
      description: '追寻梦想的寓言故事'
    }
  ];

  const { data: createdBooks } = await supabaseAdmin
    .from('books')
    .insert(books)
    .select();

  console.log(`✅ Created ${createdBooks?.length || 0} books`);

  // Create reading progress
  if (createdBooks) {
    for (const book of createdBooks) {
      const progress = Math.random() > 0.2 ? Math.floor(Math.random() * 100) : 100;
      await supabaseAdmin
        .from('reading_progress')
        .insert({
          user_id: userId,
          book_id: book.id,
          current_page: Math.floor(book.total_pages! * (progress / 100)),
          progress_percentage: progress,
          is_finished: progress === 100,
          last_read_at: new Date().toISOString()
        });
    }
    console.log('✅ Created reading progress');
  }

  // Create sample insights
  const insights = [
    {
      user_id: userId,
      book_id: createdBooks?.[3]?.id,
      type: 'concept',
      content: '你探讨了"控制的两分法"。马可强调应严格专注于内在的意志，而非外部环境。',
      sub_text: '本周阅读 120 页'
    },
    {
      user_id: userId,
      book_id: createdBooks?.[3]?.id,
      type: 'quote',
      content: '"灵魂被其思想的色彩所染。"'
    },
    {
      user_id: userId,
      book_id: createdBooks?.[1]?.id,
      type: 'habit',
      content: '两分钟规则：你注意到这可以作为解决早晨拖延习惯的潜在方案。',
      sub_text: '本周阅读 85 页'
    }
  ];

  await supabaseAdmin
    .from('insights')
    .insert(insights);
  console.log('✅ Created insights');

  // Create sample quotes
  const quotes = [
    {
      user_id: userId,
      book_id: createdBooks?.[4]?.id,
      content: '"一个人并不是生来要给打败的，你尽可以把他消灭掉，可就是打不败他。"',
      tags: ['励志', '经典'],
      is_favorite: true
    },
    {
      user_id: userId,
      book_id: createdBooks?.[2]?.id,
      content: '"弱小和无知不是生存的障碍，傲慢才是。"',
      tags: ['哲学', '科幻'],
      is_favorite: true
    }
  ];

  await supabaseAdmin
    .from('quotes')
    .insert(quotes);
  console.log('✅ Created quotes');

  // Create reading activity for heatmap
  const activities = [];
  for (let i = 0; i < 40; i++) {
    const date = new Date();
    date.setDate(date.getDate() - i);

    if (Math.random() > 0.3) {
      activities.push({
        user_id: userId,
        activity_date: date.toISOString().split('T')[0],
        pages_read: Math.floor(Math.random() * 50) + 10,
        reading_time_seconds: Math.floor(Math.random() * 3600) + 600,
        books_count: Math.random() > 0.7 ? 1 : 0
      });
    }
  }

  await supabaseAdmin
    .from('reading_activity')
    .insert(activities);
  console.log('✅ Created reading activity');

  // Create achievements
  const achievements = [
    { name: '早起鸟', description: '连续7天在早上6点前阅读', requirement_type: 'streak', requirement_value: 7, color: 'text-primary', bg: 'bg-primary/10' },
    { name: '深度思考', description: '单次阅读超过2小时', requirement_type: 'reading_time', requirement_value: 7200, color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
    { name: '博览群书', description: '读完10本书', requirement_type: 'books_read', requirement_value: 10, color: 'text-orange-500', bg: 'bg-orange-500/10' },
    { name: '百日连胜', description: '连续100天阅读', requirement_type: 'streak', requirement_value: 100, color: 'text-purple-500', bg: 'bg-purple-500/10' },
    { name: '千页达成', description: '累计阅读1000页', requirement_type: 'pages_read', requirement_value: 1000, color: 'text-blue-500', bg: 'bg-blue-500/10' }
  ];

  const { data: createdAchievements } = await supabaseAdmin
    .from('achievements')
    .insert(achievements)
    .select();
  console.log(`✅ Created ${createdAchievements?.length || 0} achievements`);

  // Award some achievements to user
  if (createdAchievements) {
    await supabaseAdmin
      .from('user_achievements')
      .insert([
        { user_id: userId, achievement_id: createdAchievements[0].id },
        { user_id: userId, achievement_id: createdAchievements[1].id },
        { user_id: userId, achievement_id: createdAchievements[2].id }
      ]);
    console.log('✅ Awarded achievements to user');
  }

  console.log('\n🎉 Seeding completed successfully!');
  console.log('\n📝 Demo credentials:');
  console.log('   Email: demo@example.com');
  console.log('   Password: any password (mock auth)');
}

seed().catch(console.error);
