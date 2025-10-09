import { useState, useEffect, useCallback } from 'react';
import { InspirationItem, InspirationFormData } from '../types/Inspiration';
import { InspirationService } from '../services/InspirationService';

export const useInspiration = () => {
  const [inspirationItems, setInspirationItems] = useState<InspirationItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadInspirationItems = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await InspirationService.getAll();
      setInspirationItems(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load inspiration items');
      console.error('Error loading inspiration items:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadInspirationItems();
  }, [loadInspirationItems]);

  const createInspirationItem = useCallback(async (formData: InspirationFormData): Promise<InspirationItem | null> => {
    try {
      setError(null);
      const newItem = await InspirationService.create(formData);
      setInspirationItems(prev => [newItem, ...prev]);
      return newItem;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create inspiration item');
      console.error('Error creating inspiration item:', err);
      return null;
    }
  }, []);

  const updateInspirationItem = useCallback(async (id: string, updates: Partial<InspirationFormData>): Promise<boolean> => {
    try {
      setError(null);
      const updatedItem = await InspirationService.update(id, updates);
      setInspirationItems(prev => prev.map(item => item.id === id ? updatedItem : item));
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update inspiration item');
      console.error('Error updating inspiration item:', err);
      return false;
    }
  }, []);

  const toggleFavorite = useCallback(async (id: string): Promise<boolean> => {
    try {
      setError(null);
      await InspirationService.toggleFavorite(id);
      setInspirationItems(prev => prev.map(item =>
        item.id === id ? { ...item, isFavorite: !item.isFavorite } : item
      ));
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to toggle favorite');
      console.error('Error toggling favorite:', err);
      return false;
    }
  }, []);

  const deleteInspirationItem = useCallback(async (id: string): Promise<boolean> => {
    try {
      setError(null);
      await InspirationService.delete(id);
      setInspirationItems(prev => prev.filter(item => item.id !== id));
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete inspiration item');
      console.error('Error deleting inspiration item:', err);
      return false;
    }
  }, []);

  const getStats = useCallback(async () => {
    try {
      return await InspirationService.getStats();
    } catch (err) {
      console.error('Error getting inspiration stats:', err);
      return null;
    }
  }, []);

  return {
    inspirationItems,
    loading,
    error,
    createInspirationItem,
    updateInspirationItem,
    toggleFavorite,
    deleteInspirationItem,
    refreshInspiration: loadInspirationItems,
    getStats,
  };
};
