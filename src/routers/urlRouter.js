import { Router } from "express";
import { accessUrl, creatShortUrl, deleteUrl, getUrl } from "../controllers/urlController.js";
import { validateToken, validateUrl } from "../middlewares/authMiddlewares.js";

const router = Router();

router.post('/urls/shorten', validateToken, validateUrl, creatShortUrl);

router.get('/urls/:id', getUrl);
router.delete('/urls/:id', validateToken, deleteUrl);

router.get('/urls/open/:shortUrl', accessUrl);

export default router;