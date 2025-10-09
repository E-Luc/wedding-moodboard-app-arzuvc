import { useState, useEffect, useCallback } from 'react';
import { BudgetItem, BudgetFormData, BudgetExpense } from '../types/Budget';
import { BudgetService } from '../services/BudgetService';

export const useBudget = () => {
  const [budgetItems, setBudgetItems] = useState<BudgetItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadBudgetItems = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await BudgetService.getAll();
      setBudgetItems(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load budget items');
      console.error('Error loading budget items:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadBudgetItems();
  }, [loadBudgetItems]);

  const createBudgetItem = useCallback(async (formData: BudgetFormData): Promise<BudgetItem | null> => {
    try {
      setError(null);
      const newItem = await BudgetService.create(formData);
      setBudgetItems(prev => [newItem, ...prev]);
      return newItem;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create budget item');
      console.error('Error creating budget item:', err);
      return null;
    }
  }, []);

  const updateBudgetItem = useCallback(async (id: string, updates: Partial<BudgetFormData>): Promise<boolean> => {
    try {
      setError(null);
      const updatedItem = await BudgetService.update(id, updates);
      setBudgetItems(prev => prev.map(item => item.id === id ? updatedItem : item));
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update budget item');
      console.error('Error updating budget item:', err);
      return false;
    }
  }, []);

  const addExpense = useCallback(async (
    budgetItemId: string,
    expense: Omit<BudgetExpense, 'id' | 'createdAt'>
  ): Promise<boolean> => {
    try {
      setError(null);
      await BudgetService.addExpense(budgetItemId, expense);
      await loadBudgetItems();
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add expense');
      console.error('Error adding expense:', err);
      return false;
    }
  }, [loadBudgetItems]);

  const deleteBudgetItem = useCallback(async (id: string): Promise<boolean> => {
    try {
      setError(null);
      await BudgetService.delete(id);
      setBudgetItems(prev => prev.filter(item => item.id !== id));
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete budget item');
      console.error('Error deleting budget item:', err);
      return false;
    }
  }, []);

  const getStats = useCallback(async () => {
    try {
      return await BudgetService.getStats();
    } catch (err) {
      console.error('Error getting budget stats:', err);
      return null;
    }
  }, []);

  return {
    budgetItems,
    loading,
    error,
    createBudgetItem,
    updateBudgetItem,
    addExpense,
    deleteBudgetItem,
    refreshBudget: loadBudgetItems,
    getStats,
  };
};
