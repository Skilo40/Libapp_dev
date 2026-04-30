import Member from '../models/Member.js';
import { audit } from '../services/auditService.js';

export const getMembers = async (req, res, next) => {
  try {
    const { search, isActive } = req.query;
    const filter = {};

    if (search) {
      filter.$or = [
        { firstName: { $regex: search, $options: 'i' } },
        { lastName: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
      ];
    }
    if (isActive !== undefined) filter.isActive = isActive === 'true';

    const members = await Member.find(filter).sort({ createdAt: -1 });
    res.json({ members, total: members.length });
  } catch (err) {
    next(err);
  }
};

export const getMember = async (req, res, next) => {
  try {
    const member = await Member.findById(req.params.id);
    if (!member) return res.status(404).json({ message: 'Читача не знайдено' });
    res.json({ member });
  } catch (err) {
    next(err);
  }
};

export const createMember = async (req, res, next) => {
  try {
    const member = await Member.create(req.body);

    await audit({
      action: 'MEMBER_CREATED',
      entityType: 'member',
      entityId: member._id,
      performedBy: req.user._id,
      newValue: req.body,
      ip: req.ip,
    });

    res.status(201).json({ member });
  } catch (err) {
    next(err);
  }
};

export const updateMember = async (req, res, next) => {
  try {
    const old = await Member.findById(req.params.id);
    if (!old) return res.status(404).json({ message: 'Читача не знайдено' });

    const member = await Member.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });

    await audit({
      action: 'MEMBER_UPDATED',
      entityType: 'member',
      entityId: member._id,
      performedBy: req.user._id,
      oldValue: old.toObject(),
      newValue: req.body,
      ip: req.ip,
    });

    res.json({ member });
  } catch (err) {
    next(err);
  }
};

export const deleteMember = async (req, res, next) => {
  try {
    const member = await Member.findById(req.params.id);
    if (!member) return res.status(404).json({ message: 'Читача не знайдено' });

    await Member.findByIdAndDelete(req.params.id);

    await audit({
      action: 'MEMBER_DELETED',
      entityType: 'member',
      entityId: member._id,
      performedBy: req.user._id,
      oldValue: member.toObject(),
      ip: req.ip,
    });

    res.json({ message: 'Читача видалено' });
  } catch (err) {
    next(err);
  }
};