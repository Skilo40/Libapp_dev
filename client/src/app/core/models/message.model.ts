export interface Message {
  _id: string;
  name: string;
  email: string;
  subject: string;
  text: string;
  member?: string;
  status: 'new' | 'replied';
  replyText?: string;
  repliedAt?: string;
  createdAt: string;
}