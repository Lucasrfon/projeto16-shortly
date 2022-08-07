import { Router } from "express";
import { ranking } from "../controllers/usersController.js";

const router = Router();

router.get('/users/me');
router.get('/ranking', ranking);

export default router;