import express from 'express';
import { health, register, login, refreshAccessToken, logout, profile } from '../controllers/auth.controller.js';
import { authMiddleware, validate } from '../middlewares/auth.middleware.js';
import { registerValidator, loginValidator } from '../validators/auth.validator.js';


const router = express.Router();

router.get('/health', health);
router.post('/register', validate(registerValidator), register);
router.post('/login', validate(loginValidator), login);
router.post('/refresh', refreshAccessToken);
router.post('/logout', logout);
router.get('/me', authMiddleware, profile);

export default router;