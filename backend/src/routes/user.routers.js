import express from 'express';
import {
  health,
  addUser,
  getUsers,
  editUser
} from '../controllers/user.controller.js';
import {
  createUserValidator,
  updateUserValidator
} from '../validators/user.validator.js';
import { authMiddleware, validate } from '../middlewares/auth.middleware.js';

const router = express.Router();

router.get('/health',  health);
router.post('/',  authMiddleware,  validate(createUserValidator), addUser);
router.get('/',  authMiddleware,  getUsers);
router.put('/:userId',  authMiddleware,  validate(updateUserValidator),  editUser);

export default router;
