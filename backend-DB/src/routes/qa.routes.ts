import express from 'express';
import { getQuestionsHandler } from '../controllers/qa.controller';

const router = express.Router();

router.get('/questions', getQuestionsHandler);

export default router;