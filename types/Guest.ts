export interface Guest {
  id: string;
  name: string;
  email: string;
  phone?: string;
  status: 'pending' | 'confirmed' | 'declined';
  plusOne: boolean;
  plusOneName?: string;
  group?: string;
  dietaryRestrictions?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface GuestFormData {
  name: string;
  email: string;
  phone?: string;
  plusOne: boolean;
  plusOneName?: string;
  group?: string;
  dietaryRestrictions?: string;
  notes?: string;
}
