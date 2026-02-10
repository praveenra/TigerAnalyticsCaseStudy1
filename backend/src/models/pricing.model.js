import mongoose from 'mongoose';

const PricingSchema = new mongoose.Schema({
  storeId: { type: String, required: true, index: true },
  sku: { type: String, required: true, index: true },
  productName: { type: String, required: true },
  price: { type: Number, required: true, min: 0 },
  effectiveDate: { type: Date, required: true },
  isActive: { type: Boolean, default: true },
  version: { type: Number, default: 1 } // Incremented when price changes
}, { timestamps: true });

// Prevent duplicate price for same store + SKU + effectiveDate
PricingSchema.index({ storeId: 1, sku: 1, effectiveDate: 1 }, { unique: true });

export default mongoose.model('Pricing', PricingSchema);
