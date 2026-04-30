import { User } from './user.model';

export interface AuditLog {
  _id: string;
  action: string;
  entityType: string;
  entityId: string;
  performedBy: User;
  oldValue?: any;
  newValue?: any;
  ip?: string;
  createdAt: string;
}