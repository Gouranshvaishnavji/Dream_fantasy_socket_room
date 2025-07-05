import express from 'express';
import { createRoom, getRoom } from '../controllers/roomController.js';

const router = express.Router();

// create room api
router.post('/create', createRoom);

// get room info api
router.get('/:roomId', getRoom);

export default router;
