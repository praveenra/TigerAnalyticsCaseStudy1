import {
  createUser,
  updateUserByUserId,
  listUsers 
} from '../services/user.service.js';
import mongoose from 'mongoose';

export const health = async (req, res) => {
    res.status(200).json({
    status: "UP",
    message: "User Server is healthy",
    timestamp: new Date()
  });
};

export const addUser = async (req, res) => {
  try{
    req.body.password = '$2b$10$Ry8QdzBlq/2Ii0UOkM2NYe.Dtwj2wAeq4p6PUAnU.ezVub7l7eUZK';
    req.body.role = 'STOREUSER';
    const user = await createUser(req.body);
    res.status(201).json(user);
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to create user'
    });
  }
};

export const getUsers = async (req, res) => {
  try {
    const {
      limit = 10,
      offset = 0,
      search = '',
      sortBy = 'createdAt',
      sortOrder = 'desc'
    } = req.query;

    const result = await listUsers({
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
      message: 'Failed to fetch users'
    });
  }
};


export const editUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await updateUserByUserId({_id:new mongoose.Types.ObjectId(userId)}, req.body);
    if (!user) {
      return res.status(404).json({
        success: false, 
        message: 'User not found'
      });
    }
    return res.status(200).json({
      success: true,
      message: 'User updated successfully',
    })
  } catch (error) {
    console.error('Error in editUser:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update user'
    });
  }
};
