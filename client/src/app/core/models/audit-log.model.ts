import { User } from './user.model';

export interface AuditLog {
  _id: string;
  action: string;
  entityType: string;
  entityId: string;
  
  // Додані нові поля для відображення в інтерфейсі
  entityName?: string; 
  details?: string;    

  // Зроблено необов'язковим, бо систему (без User) передбачено в HTML
  performedBy?: User;  
  
  oldValue?: any;
  newValue?: any;
  ip?: string;
  createdAt: string;
}