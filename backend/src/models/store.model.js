import mongoose from 'mongoose';
import Counter from './counter.model.js';

const StoreSchema = new mongoose.Schema(
  {
    storeId: { type: String, unique: true },
    name: { type: String, required: true, trim: true },
    city: { type: String },
    state: { type: String },
    country: { type: String },
    currency: { type: String },
    isActive: { type: Boolean, default: true }
  },
  { timestamps: true }
);

StoreSchema.pre('save', async function (next) {
  try {
    if (this.storeId) return next();

    const counter = await Counter.findOneAndUpdate(
      { name: 'storeId' },
      { $inc: { seq: 1 } },
      { new: true, upsert: true }
    );

    const prefix = 'STR';
    const paddedNumber = counter.seq.toString().padStart(4, '0');

    this.storeId = `${prefix}-${paddedNumber}`;

    next();
  } catch (error) {
    next(error);
  }
});


export default mongoose.model('Store', StoreSchema);
