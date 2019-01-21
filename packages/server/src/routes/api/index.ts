import { Router } from 'express';

const router = Router();
export default router;

import { router as AdminRouter } from './admin/';
router.use('/admin', AdminRouter);
