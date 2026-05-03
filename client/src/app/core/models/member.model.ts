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
  avatarUrl?: string;
  createdAt: string;
}

export interface MemberRequest {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  address?: string;
  avatarUrl?: string;
}