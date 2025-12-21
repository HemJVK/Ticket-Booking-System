import { Router } from 'express';
import { bookSeat, getBookingsForShow } from '../controllers/bookingController';

const router = Router();

router.post('/', bookSeat);
router.get('/show/:showId', getBookingsForShow);

export default router;
