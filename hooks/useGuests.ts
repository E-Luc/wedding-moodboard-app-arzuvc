import { useState, useEffect, useCallback } from 'react';
import { Guest, GuestFormData } from '../types/Guest';
import { GuestService } from '../services/GuestService';

export const useGuests = () => {
  const [guests, setGuests] = useState<Guest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadGuests = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await GuestService.getAll();
      setGuests(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load guests');
      console.error('Error loading guests:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadGuests();
  }, [loadGuests]);

  const createGuest = useCallback(async (formData: GuestFormData): Promise<Guest | null> => {
    try {
      setError(null);
      const newGuest = await GuestService.create(formData);
      setGuests(prev => [newGuest, ...prev]);
      return newGuest;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create guest');
      console.error('Error creating guest:', err);
      return null;
    }
  }, []);

  const updateGuest = useCallback(async (id: string, updates: Partial<GuestFormData>): Promise<boolean> => {
    try {
      setError(null);
      const updatedGuest = await GuestService.update(id, updates);
      setGuests(prev => prev.map(g => g.id === id ? updatedGuest : g));
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update guest');
      console.error('Error updating guest:', err);
      return false;
    }
  }, []);

  const updateGuestStatus = useCallback(async (id: string, status: Guest['status']): Promise<boolean> => {
    try {
      setError(null);
      await GuestService.updateStatus(id, status);
      setGuests(prev => prev.map(g => g.id === id ? { ...g, status } : g));
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update guest status');
      console.error('Error updating guest status:', err);
      return false;
    }
  }, []);

  const deleteGuest = useCallback(async (id: string): Promise<boolean> => {
    try {
      setError(null);
      await GuestService.delete(id);
      setGuests(prev => prev.filter(g => g.id !== id));
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete guest');
      console.error('Error deleting guest:', err);
      return false;
    }
  }, []);

  const getStats = useCallback(async () => {
    try {
      return await GuestService.getStats();
    } catch (err) {
      console.error('Error getting guest stats:', err);
      return null;
    }
  }, []);

  return {
    guests,
    loading,
    error,
    createGuest,
    updateGuest,
    updateGuestStatus,
    deleteGuest,
    refreshGuests: loadGuests,
    getStats,
  };
};
