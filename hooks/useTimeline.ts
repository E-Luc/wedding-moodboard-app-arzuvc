import { useState, useEffect, useCallback } from 'react';
import { TimelineItem, TimelineFormData } from '../types/Timeline';
import { TimelineService } from '../services/TimelineService';

export const useTimeline = () => {
  const [timelineItems, setTimelineItems] = useState<TimelineItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadTimelineItems = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await TimelineService.getAll();
      setTimelineItems(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load timeline items');
      console.error('Error loading timeline items:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadTimelineItems();
  }, [loadTimelineItems]);

  const createTimelineItem = useCallback(async (formData: TimelineFormData): Promise<TimelineItem | null> => {
    try {
      setError(null);
      const newItem = await TimelineService.create(formData);
      setTimelineItems(prev => [newItem, ...prev]);
      return newItem;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create timeline item');
      console.error('Error creating timeline item:', err);
      return null;
    }
  }, []);

  const updateTimelineItem = useCallback(async (id: string, updates: Partial<TimelineFormData>): Promise<boolean> => {
    try {
      setError(null);
      const updatedItem = await TimelineService.update(id, updates);
      setTimelineItems(prev => prev.map(item => item.id === id ? updatedItem : item));
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update timeline item');
      console.error('Error updating timeline item:', err);
      return false;
    }
  }, []);

  const toggleComplete = useCallback(async (id: string): Promise<boolean> => {
    try {
      setError(null);
      await TimelineService.toggleComplete(id);
      setTimelineItems(prev => prev.map(item =>
        item.id === id ? { ...item, completed: !item.completed } : item
      ));
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to toggle completion');
      console.error('Error toggling completion:', err);
      return false;
    }
  }, []);

  const deleteTimelineItem = useCallback(async (id: string): Promise<boolean> => {
    try {
      setError(null);
      await TimelineService.delete(id);
      setTimelineItems(prev => prev.filter(item => item.id !== id));
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete timeline item');
      console.error('Error deleting timeline item:', err);
      return false;
    }
  }, []);

  const getStats = useCallback(async () => {
    try {
      return await TimelineService.getStats();
    } catch (err) {
      console.error('Error getting timeline stats:', err);
      return null;
    }
  }, []);

  return {
    timelineItems,
    loading,
    error,
    createTimelineItem,
    updateTimelineItem,
    toggleComplete,
    deleteTimelineItem,
    refreshTimeline: loadTimelineItems,
    getStats,
  };
};
