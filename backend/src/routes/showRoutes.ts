import { Router } from 'express';
import { createShow, getShows, getShowById } from '../controllers/showController';
import { authenticateToken, isAdmin } from '../middleware/authMiddleware';

const router = Router();

// Protect create show (Admins only)
router.post('/', authenticateToken, isAdmin, createShow);
router.get('/', getShows);
router.get('/:id', getShowById);

export default router;
