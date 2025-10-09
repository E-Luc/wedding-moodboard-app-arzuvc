import { useState, useEffect, useCallback } from 'react';
import { Vendor, VendorFormData } from '../types/Vendor';
import { VendorService } from '../services/VendorService';

export const useVendors = () => {
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadVendors = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await VendorService.getAll();
      setVendors(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load vendors');
      console.error('Error loading vendors:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadVendors();
  }, [loadVendors]);

  const createVendor = useCallback(async (formData: VendorFormData): Promise<Vendor | null> => {
    try {
      setError(null);
      const newVendor = await VendorService.create(formData);
      setVendors(prev => [newVendor, ...prev]);
      return newVendor;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create vendor');
      console.error('Error creating vendor:', err);
      return null;
    }
  }, []);

  const updateVendor = useCallback(async (id: string, updates: Partial<VendorFormData>): Promise<boolean> => {
    try {
      setError(null);
      const updatedVendor = await VendorService.update(id, updates);
      setVendors(prev => prev.map(v => v.id === id ? updatedVendor : v));
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update vendor');
      console.error('Error updating vendor:', err);
      return false;
    }
  }, []);

  const updateVendorStatus = useCallback(async (id: string, status: Vendor['status']): Promise<boolean> => {
    try {
      setError(null);
      await VendorService.updateStatus(id, status);
      setVendors(prev => prev.map(v => v.id === id ? { ...v, status } : v));
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update vendor status');
      console.error('Error updating vendor status:', err);
      return false;
    }
  }, []);

  const deleteVendor = useCallback(async (id: string): Promise<boolean> => {
    try {
      setError(null);
      await VendorService.delete(id);
      setVendors(prev => prev.filter(v => v.id !== id));
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete vendor');
      console.error('Error deleting vendor:', err);
      return false;
    }
  }, []);

  const getStats = useCallback(async () => {
    try {
      return await VendorService.getStats();
    } catch (err) {
      console.error('Error getting vendor stats:', err);
      return null;
    }
  }, []);

  return {
    vendors,
    loading,
    error,
    createVendor,
    updateVendor,
    updateVendorStatus,
    deleteVendor,
    refreshVendors: loadVendors,
    getStats,
  };
};
