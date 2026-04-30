import AuditLog from '../models/AuditLog.js';

export const audit = async ({ action, entityType, entityId, performedBy, oldValue, newValue, ip }) => {
  try {
    await AuditLog.create({
      action,
      entityType,
      entityId,
      performedBy,
      oldValue,
      newValue,
      ip,
    });
  } catch (err) {
    console.error('Audit log error:', err.message);
  }
};