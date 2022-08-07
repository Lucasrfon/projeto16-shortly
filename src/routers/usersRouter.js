import { Router } from "express";

const router = Router();

router.get('/users/me');
router.get('/ranking');

export default router;