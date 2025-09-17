
export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  dateOfBirth?: string;
  weddingDate?: string;
  partnerName?: string;
  budget?: number;
  venue?: string;
  guestCount?: number;
  weddingStyle?: string;
  profileComplete: boolean;
  isAdmin?: boolean;
  avatar?: string;
  phone?: string;
  address?: string;
  preferences?: {
    theme: string;
    notifications: boolean;
    language: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface UserRegistration {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}

export interface UserLogin {
  email: string;
  password: string;
}

export interface ProfileSetupStep {
  id: string;
  title: string;
  description: string;
  fields: string[];
  required: boolean;
  completed: boolean;
}
