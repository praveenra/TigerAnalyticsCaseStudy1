import jwt from 'jsonwebtoken';

export const authMiddleware = (req, res, next) => {
  try {
    const token =
      req.cookies.access_token ||
      req.headers.authorization?.split(' ')[1];

    if (!token) {
      return res.status(401).json({ message: 'No token' });
    }
    const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    console.error('Auth error:', err);
    return res.status(401).json({ message: 'Invalid token' });
  }
};


export const validate = (schema) => (req, res, next) => {
  const errors = [];

  if (schema.body) {
    const { error } = schema.body.validate(req.body);
    if (error) errors.push(error.message);
  }

  if (schema.params) {
    const { error } = schema.params.validate(req.params);
    if (error) errors.push(error.message);
  }

  if (errors.length) {
    return res.status(400).json({ message: errors.join(', ') });
  }

  next();
};
