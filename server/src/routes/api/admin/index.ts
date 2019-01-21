import { Router, Request, Response } from 'express';

import { router as UserRouter } from './user';

export const router = Router();
router.use('/user', UserRouter);
