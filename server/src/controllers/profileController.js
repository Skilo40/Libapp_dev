import Member from '../models/Member.js';
import Loan from '../models/Loan.js';

export const getProfile = async (req, res, next) => {
  try {
    const member = await Member.findById(req.params.id);
    if (!member) return res.status(404).json({ message: 'Профіль не знайдено' });
    res.json({ member });
  } catch (err) {
    next(err);
  }
};

export const updateProfile = async (req, res, next) => {
  try {
    const { firstName, lastName, phone, address, avatarUrl } = req.body;
    const member = await Member.findByIdAndUpdate(
      req.params.id,
      { firstName, lastName, phone, address, avatarUrl },
      { new: true, runValidators: true }
    );
    if (!member) return res.status(404).json({ message: 'Профіль не знайдено' });
    res.json({ member });
  } catch (err) {
    next(err);
  }
};

export const getLoanHistory = async (req, res, next) => {
  try {
    const loans = await Loan.find({ member: req.params.id })
      .populate('book', 'title author coverUrl isbn')
      .sort({ createdAt: -1 });
    res.json({ loans });
  } catch (err) {
    next(err);
  }
};