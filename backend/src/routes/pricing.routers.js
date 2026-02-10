import express from 'express';
import { health, addPricing, getPricing, updatePricing, exportPricing, uploadPricingCSV } from '../controllers/pricing.controller.js';
import { createPricingValidator, updatePricingValidator } from '../validators/pricing.validator.js';
import { authMiddleware, validate } from '../middlewares/auth.middleware.js';
import multer from 'multer';

const upload = multer({ dest: 'uploads/' });

const router = express.Router();

router.get('/health', health);
router.post('/', authMiddleware, validate(createPricingValidator), addPricing);
router.get('/', authMiddleware, getPricing);
router.put('/:id', authMiddleware, validate(updatePricingValidator), updatePricing);
router.get('/export', authMiddleware, exportPricing);
router.post('/upload', authMiddleware, upload.single('file'), uploadPricingCSV);

export default router;
