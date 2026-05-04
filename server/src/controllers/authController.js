import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import Member from '../models/Member.js';
import { audit } from '../services/auditService.js';

const signToken = (id, role) =>
  jwt.sign({ id, role }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN });

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

    const token = signToken(user._id, user.role);
    res.status(201).json({ token, user });
  } catch (err) {
    next(err);
  }
};

export const registerMember = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    const existing = await Member.findOne({ email });
    if (existing) {
      return res.status(400).json({ message: 'Email вже використовується' });
    }

    const [firstName, ...rest] = name.trim().split(' ');
    const lastName = rest.join(' ') || '-';

    const member = await Member.create({
      firstName,
      lastName,
      email,
      password,
    });

    const token = signToken(member._id, 'member');
    res.status(201).json({
      token,
      user: {
        _id: member._id,
        name: `${member.firstName} ${member.lastName}`,
        firstName: member.firstName,
        lastName: member.lastName,
        email: member.email,
        phone: member.phone,
        role: 'member',
        memberId: member._id,
      }
    });
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

    // Спочатку шукаємо серед персоналу
    let user = await User.findOne({ email }).select('+password');
    if (user) {
      if (!(await user.comparePassword(password))) {
        return res.status(401).json({ message: 'Невірний email або пароль' });
      }

      await audit({
        action: 'LOGIN',
        entityType: 'user',
        entityId: user._id,
        performedBy: user._id,
        ip: req.ip,
      });

      const token = signToken(user._id, user.role);
      return res.json({ token, user });
    }

    // Потім серед читачів
    const member = await Member.findOne({ email }).select('+password');
    if (member && member.password) {
      if (!(await member.comparePassword(password))) {
        return res.status(401).json({ message: 'Невірний email або пароль' });
      }

      const token = signToken(member._id, 'member');
      return res.json({
        token,
        user: {
          _id: member._id,
          name: `${member.firstName} ${member.lastName}`,
          firstName: member.firstName,
          lastName: member.lastName,
          email: member.email,
          phone: member.phone,
          role: 'member',
          memberId: member._id,
        }
      });
    }

    return res.status(401).json({ message: 'Невірний email або пароль' });
  } catch (err) {
    next(err);
  }
};

export const getMe = async (req, res) => {
  res.json({ user: req.user });
};