import { Router } from "express";
import { accessUrl, deleteUrl, getUrl } from "../controllers/urlControler.js";
import { validateToken } from "../middlewares/authMiddlewares.js";

const router = Router();

router.post('/urls/shorten');

router.get('/urls/:id', getUrl);
router.delete('/urls/:id', validateToken, deleteUrl);

router.get('/urls/open/:shortUrl', accessUrl);

export default router;