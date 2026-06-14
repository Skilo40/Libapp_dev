export interface Member {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  address?: string;
  dateOfBirth?: string;
  membershipDate: string;
  isActive: boolean;
  avatar?: string; // base64 data URL
  createdAt: string;
}

export interface MemberRequest {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  address?: string;
  avatar?: string;
}