import express from 'express';
import {
  health,
  addStore,
  getStores,
  editStore
} from '../controllers/store.controller.js';
import {
  createStoreValidator,
  updateStoreValidator
} from '../validators/store.validator.js';
import { authMiddleware, validate } from '../middlewares/auth.middleware.js';

const router = express.Router();

router.get('/health',  health);
router.post('/',  authMiddleware,  validate(createStoreValidator), addStore);
router.get('/',  authMiddleware,  getStores);
router.put('/:storeId',  authMiddleware,  validate(updateStoreValidator),  editStore);

export default router;
