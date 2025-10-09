export interface Vendor {
  id: string;
  name: string;
  category: 'photographer' | 'caterer' | 'florist' | 'musician' | 'venue' | 'decorator' | 'other';
  phone: string;
  email: string;
  website?: string;
  price: number;
  status: 'contacted' | 'booked' | 'declined' | 'pending';
  notes: string;
  rating: number;
  address?: string;
  contactPerson?: string;
  contractSigned?: boolean;
  depositPaid?: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface VendorFormData {
  name: string;
  category: 'photographer' | 'caterer' | 'florist' | 'musician' | 'venue' | 'decorator' | 'other';
  phone: string;
  email: string;
  website?: string;
  price: number;
  notes?: string;
  rating?: number;
  address?: string;
  contactPerson?: string;
}

export interface VendorStats {
  total: number;
  booked: number;
  contacted: number;
  pending: number;
  totalBudget: number;
}
