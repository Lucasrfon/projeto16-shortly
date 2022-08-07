import { Router } from "express";

const router = Router();

router.post('/urls/shorten');

router.get('/urls/:id');
router.delete('/urls/:id');

router.get('/urls/open/:shortUrl');

export default router;