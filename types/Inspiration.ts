export interface InspirationItem {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  category: 'dress' | 'flowers' | 'venue' | 'decoration' | 'cake' | 'hairstyle' | 'other';
  tags: string[];
  isFavorite: boolean;
  dateAdded: string;
  source?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface InspirationFormData {
  title: string;
  description: string;
  imageUrl: string;
  category: 'dress' | 'flowers' | 'venue' | 'decoration' | 'cake' | 'hairstyle' | 'other';
  tags?: string[];
  source?: string;
  notes?: string;
}

export interface InspirationStats {
  total: number;
  favorites: number;
  categoryCounts: Record<string, number>;
}
