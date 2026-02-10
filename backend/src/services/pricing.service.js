import Pricing from '../models/pricing.model.js';

export const addOrUpdatePricing = async (data) => {
  // Check if current active price exists for store+SKU
  const existing = await Pricing.findOne({
    storeId: data.storeId,
    sku: data.sku,
    isActive: true
  });

  if (existing) {
    // If price changed or effectiveDate changed, deactivate old and create new version
    if (existing.price !== data.price || existing.effectiveDate.toISOString() !== new Date(data.effectiveDate).toISOString()) {
      existing.isActive = false;
      await existing.save();

      const newVersion = existing.version + 1;
      const newPricing = new Pricing({ ...data, version: newVersion });
      return await newPricing.save();
    }

    // Otherwise, no update needed
    return existing;
  }

  // First-time pricing
  const pricing = new Pricing(data);
  return await pricing.save();
};

export const listPricing = async ({
  limit = 100000,
  offset = 0,
  search = '',
  sortBy = 'createdAt',
  sortOrder = 'desc',
  storeId,
  sku
}) => {
//   const filter = { isActive: true }; // Only current active prices
  const filter = { }; // Only current active prices

  // Optional filters
  if (storeId) filter.storeId = storeId;
  if (sku) filter.sku = sku;

  // Search across fields
  if (search) {
    filter.$or = [
      { storeId: { $regex: search, $options: 'i' } },
      { sku: { $regex: search, $options: 'i' } },
      { productName: { $regex: search, $options: 'i' } }
    ];
  }

  // Sorting
  const sort = {
    [sortBy]: sortOrder === 'asc' ? 1 : -1
  };

  // Execute queries in parallel
  const [data, total] = await Promise.all([
    Pricing.find(filter)
      .sort(sort)
      .skip(Number(offset))
      .limit(Number(limit)),
    Pricing.countDocuments(filter)
  ]);

  return {
    data,
    total,
    limit: Number(limit),
    offset: Number(offset)
  };
};


export const editPricing = async (id, data) => {
    console.log('Editing pricing with ID:', id, 'Data:', data);
  const pricing = await Pricing.findById(id);
  if (!pricing) throw new Error('Pricing record not found');

  // Update fields
  Object.assign(pricing, data);
  return await pricing.save();
};
