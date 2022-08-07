import { Router } from "express";
import { accessUrl, deleteUrl, getUrl } from "../controllers/urlControler.js";

const router = Router();

router.post('/urls/shorten');

router.get('/urls/:id', getUrl);
router.delete('/urls/:id', deleteUrl);

router.get('/urls/open/:shortUrl', accessUrl);

export default router;