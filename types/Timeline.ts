export interface TimelineItem {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  completed: boolean;
  category: 'planning' | 'booking' | 'preparation' | 'ceremony';
  icon: string;
  priority?: 'low' | 'medium' | 'high';
  assignedTo?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface TimelineFormData {
  title: string;
  description: string;
  date: string;
  time: string;
  category: 'planning' | 'booking' | 'preparation' | 'ceremony';
  priority?: 'low' | 'medium' | 'high';
  assignedTo?: string;
  notes?: string;
}

export interface TimelineStats {
  total: number;
  completed: number;
  remaining: number;
  percentageComplete: number;
  categoryBreakdown: Record<string, number>;
}
