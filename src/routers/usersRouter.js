import { Router } from "express";
import { getUserUrls, ranking } from "../controllers/usersController.js";
import { validateToken } from "../middlewares/authMiddlewares.js";

const router = Router();

router.get('/users/me', validateToken, getUserUrls);
router.get('/ranking', ranking);

export default router;