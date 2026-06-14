import AuditLog from '../models/AuditLog.js';

export const audit = async ({ 
  action, 
  entityType, 
  entityId, 
  entityName, // Додано нове поле
  details,    // Додано нове поле
  performedBy, 
  oldValue, 
  newValue, 
  ip 
}) => {
  try {
    await AuditLog.create({
      action,
      entityType,
      entityId,
      entityName, // Зберігаємо в базу
      details,    // Зберігаємо в базу
      performedBy,
      oldValue,
      newValue,
      ip,
    });
  } catch (err) {
    console.error('Audit log error:', err.message);
  }
};