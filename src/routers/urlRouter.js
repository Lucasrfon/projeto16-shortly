import { Router } from "express";
import { getUrl } from "../controllers/urlControler.js";

const router = Router();

router.post('/urls/shorten');

router.get('/urls/:id', getUrl);
router.delete('/urls/:id');

router.get('/urls/open/:shortUrl');

export default router;