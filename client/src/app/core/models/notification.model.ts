export interface Notification {
  _id: string;
  member: string;
  title: string;
  text: string;
  type: string;
  isRead: boolean;
  createdAt: string;
}