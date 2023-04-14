import { Request, Response } from 'express';
import { getQuestions } from '../models/qa.model';

export const getQuestionsHandler = async (req: Request, res: Response) => {
  const questions = await getQuestions();
  res.json(questions);
};