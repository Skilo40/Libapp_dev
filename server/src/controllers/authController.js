import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { audit } from '../services/auditService.js';

const signToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN });

export const register = async (req, res, next) => {
  try {
    const { name, email, password, role } = req.body;
    const user = await User.create({ name, email, password, role });

    await audit({
      action: 'USER_CREATED',
      entityType: 'user',
      entityId: user._id,
      performedBy: user._id,
      newValue: { name, email, role },
      ip: req.ip,
    });

    const token = signToken(user._id);
    res.status(201).json({ token, user });
  } catch (err) {
    next(err);
  }
};

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Введіть email та пароль' });
    }

    const user = await User.findOne({ email }).select('+password');

    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ message: 'Невірний email або пароль' });
    }

    await audit({
      action: 'LOGIN',
      entityType: 'user',
      entityId: user._id,
      performedBy: user._id,
      ip: req.ip,
    });

    const token = signToken(user._id);
    res.json({ token, user });
  } catch (err) {
    next(err);
  }
};

export const getMe = async (req, res) => {
  res.json({ user: req.user });
};