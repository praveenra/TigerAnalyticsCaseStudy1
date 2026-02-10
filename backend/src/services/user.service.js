import User from '../models/user.model.js';
import { hashPassword } from '../utils/password.js';

export const createUser = async (data) => {
    const hashedPassword = await hashPassword(data.password);
    return User.create({
        ...data,
        password: hashedPassword
    });
};

export const getUserById = async (id) => {
    return User.findById(id).select('-password');
};

export const getUserByEmail = async (email) => {
    return User.findOne({ email });
};

export const updateUserByUserId = async (userId, data) => {
  const user = await User.findOneAndUpdate(
    userId,
    data,
    { new: true }
  );

  if (!user) throw new Error('User not found');
  return user;
};

export const listUsers = async ({
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
      { name: { $regex: search, $options: 'i' } },
      { email: { $regex: search, $options: 'i' } }
    ];
  }

  // Sorting
  const sort = {
    [sortBy]: sortOrder === 'asc' ? 1 : -1
  };

  const [data, total] = await Promise.all([
    User.find(filter)
      .sort(sort)
      .skip(offset)
      .limit(limit),
    User.countDocuments(filter)
  ]);

  return {
    data,
    total,
    limit,
    offset
  };
};