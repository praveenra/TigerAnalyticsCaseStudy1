import Store from '../models/store.model.js';

export const createStore = async (data) => {
  return await Store.create(data);
};

export const getStores = async () => {
  return await Store.find().sort({ storeId: 1 });
};

export const updateStoreByStoreId = async (storeId, data) => {
  const store = await Store.findOneAndUpdate(
    { storeId },
    data,
    { new: true }
  );

  if (!store) throw new Error('Store not found');
  return store;
};

export const listStores = async ({
  limit,
  offset,
  search,
  sortBy,
  sortOrder
}) => {
  const filter = {};

  // Search
  if (search) {
    filter.$or = [
      { storeId: { $regex: search, $options: 'i' } },
      { name: { $regex: search, $options: 'i' } },
      { city: { $regex: search, $options: 'i' } },
      { state: { $regex: search, $options: 'i' } }
    ];
  }

  // Sorting
  const sort = {
    [sortBy]: sortOrder === 'asc' ? 1 : -1
  };

  const [data, total] = await Promise.all([
    Store.find(filter)
      .sort(sort)
      .skip(offset)
      .limit(limit),
    Store.countDocuments(filter)
  ]);

  return {
    data,
    total,
    limit,
    offset
  };
};

