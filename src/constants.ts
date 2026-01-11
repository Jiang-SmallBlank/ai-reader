import { Book, Insight, ReadingStat } from './types';

export const BOOKS: Book[] = [
  {
    id: '1',
    title: '了不起的盖茨比',
    author: 'F. Scott Fitzgerald',
    coverUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD5sSH8rsPi8jMT3ykaLNQALKDYbjoDSgxm57qHu9YzTMKgY10uuQB22VzfBoHPZ2tGm1UQGLZAXW9Qb9jK2iIK8i4U_Bg37TQGG2-UTm6wWaxhZGKDriGPs6TiSYblKx_GcSORuYWzxbSmPKinG3SfzYt8biCvGsDaQfde73F-5F3UtPlRW68WrL7b3bwjh0YKvcG9UTHg-nFJr_tKt_TE905BeGJMZiG2lMm-z_RxLivp1luQSPs_bjAhyVaW5g9SSfatdIc0tSQB',
    progress: 75,
    lastRead: '2小时前',
    category: '小说'
  },
  {
    id: '2',
    title: '原子习惯',
    author: 'James Clear',
    coverUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDda1Q6rNWG3Lcdmcx6FT8oVcL0R6KKUX_GmdWZX3NbJdQ2vDXnvqs_kJypFoC0WzWu_FLpYBry-CenAaRb_RtrkKj2i4bMOLtuPuhKINQ44k8BAK8RZiosquCnO_St_hBucAJKn9Bq8UQWvhCBnQn5Gz4rUH55X9uDmT0sz4ku4rZquGdiPGbuUG-vN4uqx9gJ0tVgaYM0QwJnnHpQwraSTFTnbcXl2wPSJRfQQSNNs8HfNz6_VlR1nALzcQDXs68cKZC2phoeka1k',
    progress: 85,
    category: '自我提升'
  },
  {
    id: '3',
    title: '沙丘',
    author: 'Frank Herbert',
    coverUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAerTz7HMgURL21xxvZbWEx6UyMoVBGO_4XyVRrShqbPmRfx3ApC-6OngJQOnU4mPTFZkaB5ztqxwz47pdbUo43-2aErtCSbgDX6Kk6t7nZ--GyqBvwOiTxxd5RS9_Ov5AP_yrWA1SlyONJ3LW2qPMeHPXsSNpvSx4zgW4epvw1LON62c6W7_fy-NJwvcHAEVJnvuAmAardmxMWPodeCXp6mUDuJTlV-WE8pdJ2L76GAttWw7Ni_gG3b7gl-uvK6496Cz7w9xtgpVmV',
    progress: 12,
    category: '科幻'
  },
  {
    id: '4',
    title: '思考，快与慢',
    author: 'Daniel Kahneman',
    coverUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDacpQKC5v9RHGBoKgYyF2shdmhljfTyrvHnSHLu6JIiqQsZqc1aAW6LZNNixlT_sPL8SzEZIIZTkFBET8YZl6i36fE1f9GgFCGV9RITSSv6IbxAE29IiQ0IRET147l6jYI4H_QoU94t8xcK3ya8nHPWiMW0AdotA_MQvzXcnVfDLLbo-2UywHeBFRHxo6EwliN5qKp0eg75caQgZEPsYLOqfkn1DrvgMlBrZb2DhuZ0U90WXQSl2L0kNrw-63p0keuPrZZJQTahMGa',
    progress: 45,
    category: '心理学'
  },
  {
    id: '5',
    title: '牧羊少年奇幻之旅',
    author: 'Paulo Coelho',
    coverUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBEykKDgN8uTRvqhANDjnfjacHSQTr7-ZhSwuTsqz9Eao1J5ibIDDT651BtueDsd-bEuub2-oFbzDU_z9YEOqKRpqF1mqi3HhjPIl272etDHVBg4dYiDfmxSQHdKeiYlKzFZC7unNAn-0bE9_gLdpL-k-uWbHMrD0ZSHJxPcfF1Agk-5hkt1hng45TuzMDdKW3olY5mzF1dktUvRIModpraVGMEpEdy3DKGzah7omsX1qmXCMbnTWMzO2jBzGlsHKYGkZIfGbF2V1ru',
    progress: 100,
    isFinished: true,
    category: '小说'
  }
];

export const WEEKLY_STATS: ReadingStat[] = [
  { day: '周一', minutes: 45 },
  { day: '周二', minutes: 62 },
  { day: '周三', minutes: 30 },
  { day: '周四', minutes: 85 },
  { day: '周五', minutes: 50 },
  { day: '周六', minutes: 70 },
  { day: '周日', minutes: 40 },
];

export const INSIGHTS: Insight[] = [
  {
    id: '1',
    type: 'concept',
    bookTitle: '沉思录',
    content: '你探讨了“控制的两分法”。马可强调应严格专注于内在的意志，而非外部环境。',
    subText: '本周阅读 120 页'
  },
  {
    id: '2',
    type: 'quote',
    bookTitle: '沉思录',
    content: '“灵魂被其思想的色彩所染。”',
  },
  {
    id: '3',
    type: 'habit',
    bookTitle: '原子习惯',
    content: '两分钟规则：你注意到这可以作为解决早晨拖延习惯的潜在方案。',
    subText: '本周阅读 85 页'
  }
];

export const USER_AVATAR = "https://lh3.googleusercontent.com/aida-public/AB6AXuAwxlv9nfWSgGBLZ7P0CIhuMZuNRRomGzrm39lStC7rL5LBSa-XGuN7C-zXm3czmM_Cp4Pv-PJs6OGQ8i795Bm43EkJ4LqRd1K_cseoGtiG2-QzzMyyTRUYgQd3cx0tQ-k2-wGeCqU8134KA2n1Gr3ijAdIHEwU0rdP3zCaaluhh2LAaRwlL-AfVptOZT-KFcGxxLTrUtcdMucET-gjS0NkZY3spfwUdnxcV2NXl1NaNE5hwFKiUdtCphfgt2yFseo5FJbkZKn_dPnd";
export const READER_CONTENT_TITLE = "人工智能的演进";
export const READER_CONTENT_BODY = `
在计算的早期阶段，思考机器的概念更多是科幻小说而非现实。然而，随着处理能力的增长，研究人员的雄心也在增加。从简单算法到复杂神经网络的旅程，重新定义了我们今天与技术的互动方式。

在消化逻辑和架构的这些历史性转变时，专注和深度理解至关重要。我们必须将 1956 年的“达特茅斯会议”视为该领域的正式诞生。这次夏季会议由约翰·麦卡锡、马文·明斯基、纳撒尼尔·罗切斯特和克劳德·香农组织，为数十年的乐观情绪奠定了基础，随后也经历了被称为“AI 寒冬”的幻灭期。

在 20 世纪 80 年代，专家系统成为主导范式。这些程序通过遵循一套庞大的“如果-那么”规则来模仿人类专家的决策能力。虽然在特定的工业应用中取得了成功，但它们缺乏处理现实世界杂乱、非结构化数据的灵活性。

直到 2010 年代，在大数据爆发和 GPU 并行处理能力的推动下，“深度学习”才占据了中心舞台。拥有数百层的神经网络突然可以在图像识别和围棋等复杂棋类游戏中超越人类。

今天，我们正处于生成式 AI 的边缘。这些模型不仅仅是分类数据，它们还在创造数据。从编写代码到创作交响乐，人类创造力与算法输出之间的界限正以史无前例的速度变得模糊。
`;
