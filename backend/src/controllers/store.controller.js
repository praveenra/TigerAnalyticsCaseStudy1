import {
  createStore,
  updateStoreByStoreId,
  listStores 
} from '../services/store.service.js';

export const health = async (req, res) => {
    res.status(200).json({
    status: "UP",
    message: "Store Server is healthy",
    timestamp: new Date()
  });
};

export const addStore = async (req, res) => {
  try{
    const store = await createStore(req.body);
    res.status(201).json(store);
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to create store'
    });
  }
};

export const getStores = async (req, res) => {
  try {
    const {
      limit = 10,
      offset = 0,
      search = '',
      sortBy = 'createdAt',
      sortOrder = 'desc'
    } = req.query;

    const result = await listStores({
      limit: Number(limit),
      offset: Number(offset),
      search,
      sortBy,
      sortOrder
    });

    res.status(200).json({
      success: true,
      ...result
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch stores'
    });
  }
};

export const editStore = async (req, res) => {
  try {
    const { storeId } = req.params;
    const store = await updateStoreByStoreId(storeId, req.body);

    res.status(200).json({
      success: true,
      message: 'Store updated successfully',
      data: store
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to update store'
    });
  }
};

