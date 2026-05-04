import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import Member from '../models/Member.js';

export const protect = async (req, res, next) => {
  const header = req.headers.authorization;

  if (!header || !header.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Не авторизовано' });
  }

  try {
    const token = header.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (decoded.role === 'member') {
      const member = await Member.findById(decoded.id);
      if (!member || !member.isActive) {
        return res.status(401).json({ message: 'Користувача не знайдено' });
      }
      req.user = {
        _id: member._id,
        name: `${member.firstName} ${member.lastName}`,
        email: member.email,
        role: 'member',
        memberId: member._id,
      };
    } else {
      const user = await User.findById(decoded.id).select('-password');
      if (!user || !user.isActive) {
        return res.status(401).json({ message: 'Користувача не знайдено' });
      }
      req.user = user;
    }

    next();
  } catch (err) {
    return res.status(401).json({ message: 'Невалідний токен' });
  }
};

export const requireRole = (...roles) => (req, res, next) => {
  if (!roles.includes(req.user.role)) {
    return res.status(403).json({ message: 'Недостатньо прав' });
  }
  next();
};