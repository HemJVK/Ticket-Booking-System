import { Router } from 'express';
import { createShow, getShows, getShowById } from '../controllers/showController';

const router = Router();

router.post('/', createShow);
router.get('/', getShows);
router.get('/:id', getShowById);

export default router;
