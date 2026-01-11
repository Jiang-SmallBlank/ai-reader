import { Router } from 'express';
import { authenticateToken } from '../middleware/auth';
import { upload } from '../middleware/upload';
import * as authController from '../controllers/authController';
import * as wechatController from '../controllers/wechatController';
import * as bookController from '../controllers/bookController';
import * as readingController from '../controllers/readingController';
import * as reportController from '../controllers/reportController';

const router = Router();

// Auth routes
router.post('/auth/login', authController.login);
router.post('/auth/register', authController.register);
router.get('/auth/me', authenticateToken, authController.getMe);
router.put('/auth/profile', authenticateToken, authController.updateProfile);

// WeChat login routes
router.post('/auth/wechat/qrcode', wechatController.generateQRCode);
router.get('/auth/wechat/status/:sessionId', wechatController.checkQRStatus);
router.post('/auth/wechat/callback', wechatController.wechatCallback);
router.post('/auth/wechat/confirm', wechatController.confirmWeChatLogin);
router.post('/auth/wechat/demo/scan', wechatController.demoScanQR);

// Book routes
router.get('/books', authenticateToken, bookController.getBooks);
router.get('/books/recent', authenticateToken, bookController.getRecentBook);
router.get('/books/:id', authenticateToken, bookController.getBook);
router.post('/books', authenticateToken, bookController.createBook);
router.post('/books/upload', authenticateToken, upload.single('file'), bookController.uploadBook);
router.put('/books/:id', authenticateToken, bookController.updateBook);
router.delete('/books/:id', authenticateToken, bookController.deleteBook);

// Reading progress routes
router.get('/reading/progress/:bookId', authenticateToken, readingController.getReadingProgress);
router.put('/reading/progress/:bookId', authenticateToken, readingController.updateReadingProgress);

// Reading session routes
router.post('/reading/sessions/:bookId/start', authenticateToken, readingController.startReadingSession);
router.put('/reading/sessions/:sessionId/end', authenticateToken, readingController.endReadingSession);

// Bookmark routes
router.get('/bookmarks', authenticateToken, readingController.getBookmarks);
router.post('/bookmarks', authenticateToken, readingController.createBookmark);
router.delete('/bookmarks/:id', authenticateToken, readingController.deleteBookmark);

// Quote routes
router.get('/quotes', authenticateToken, readingController.getQuotes);
router.post('/quotes', authenticateToken, readingController.createQuote);

// Report routes
router.get('/reports/weekly', authenticateToken, reportController.getWeeklyReport);
router.get('/reports/weekly/stats', authenticateToken, reportController.getWeeklyStats);
router.get('/reports/insights', authenticateToken, reportController.getInsights);
router.get('/reports/heatmap', authenticateToken, reportController.getReadingHeatmap);
router.get('/reports/profile-stats', authenticateToken, reportController.getProfileStats);
router.get('/reports/achievements', authenticateToken, reportController.getAchievements);

export default router;
