import { Router } from "express";
import { signIn, signUp } from '../controllers/authController.js';
import { validateNewUser, validateUser } from "../middlewares/authMiddlewares.js";

const router = Router();

router.post('/signup', validateNewUser, signUp);
router.post('/signin', validateUser, signIn);

export default router;