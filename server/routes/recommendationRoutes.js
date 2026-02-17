import express from 'express';
import { getRecommendations, getCareerDetail } from '../controllers/recommendationController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', protect, getRecommendations);
router.post('/detail', protect, getCareerDetail);

export default router;
