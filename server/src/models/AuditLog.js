import mongoose from 'mongoose';

const auditLogSchema = new mongoose.Schema({
  action: {
    type: String,
    required: true,
    enum: [
      'USER_CREATED', 'USER_UPDATED',
      'BOOK_CREATED', 'BOOK_UPDATED', 'BOOK_DELETED',
      'MEMBER_CREATED', 'MEMBER_UPDATED', 'MEMBER_DELETED',
      'LOAN_CREATED', 'LOAN_RETURNED', 'LOAN_UPDATED',
      'STOCK_UPDATED', 'LOGIN', 'LOGOUT',
    ],
  },
  entityType: { type: String, enum: ['user', 'book', 'member', 'loan', 'stock'] },
  entityId: { type: mongoose.Schema.Types.ObjectId },
  
  // Додані нові поля для зрозумілого відображення на фронтенді
  entityName: { type: String }, 
  details: { type: String },    

  performedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  oldValue: { type: mongoose.Schema.Types.Mixed },
  newValue: { type: mongoose.Schema.Types.Mixed },
  ip: { type: String },
}, { timestamps: true });

export default mongoose.model('AuditLog', auditLogSchema);