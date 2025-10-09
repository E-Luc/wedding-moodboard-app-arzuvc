import { supabase } from '../utils/supabase';
import { BudgetItem, BudgetFormData, BudgetStats, BudgetExpense } from '../types/Budget';

export class BudgetService {
  static async getAll(): Promise<BudgetItem[]> {
    try {
      const { data, error } = await supabase
        .from('budget_items')
        .select(`
          *,
          budget_expenses (*)
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;

      return (data || []).map(item => ({
        ...item,
        expenses: (item.budget_expenses || []).map((exp: any) => ({
          id: exp.id,
          amount: parseFloat(exp.amount),
          description: exp.description,
          date: exp.date,
          vendor: exp.vendor || undefined,
          createdAt: exp.created_at,
        })),
        budgeted: parseFloat(item.budgeted),
        spent: parseFloat(item.spent),
        createdAt: item.created_at,
        updatedAt: item.updated_at,
      }));
    } catch (error) {
      console.error('Error fetching budget items:', error);
      throw error;
    }
  }

  static async create(formData: BudgetFormData): Promise<BudgetItem> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('budget_items')
        .insert({
          user_id: user.id,
          category: formData.category,
          budgeted: formData.budgeted,
          spent: 0,
          icon: formData.icon || 'wallet',
          color: formData.color || '#F4C2C2',
          description: formData.description,
        })
        .select()
        .single();

      if (error) throw error;
      if (!data) throw new Error('No data returned');

      return {
        ...data,
        expenses: [],
        budgeted: parseFloat(data.budgeted),
        spent: parseFloat(data.spent),
        createdAt: data.created_at,
        updatedAt: data.updated_at,
      };
    } catch (error) {
      console.error('Error creating budget item:', error);
      throw error;
    }
  }

  static async update(id: string, updates: Partial<BudgetFormData>): Promise<BudgetItem> {
    try {
      const updateData: any = {
        updated_at: new Date().toISOString(),
      };

      if (updates.category !== undefined) updateData.category = updates.category;
      if (updates.budgeted !== undefined) updateData.budgeted = updates.budgeted;
      if (updates.description !== undefined) updateData.description = updates.description;
      if (updates.icon !== undefined) updateData.icon = updates.icon;
      if (updates.color !== undefined) updateData.color = updates.color;

      const { data, error } = await supabase
        .from('budget_items')
        .update(updateData)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      if (!data) throw new Error('No data returned');

      return {
        ...data,
        expenses: [],
        budgeted: parseFloat(data.budgeted),
        spent: parseFloat(data.spent),
        createdAt: data.created_at,
        updatedAt: data.updated_at,
      };
    } catch (error) {
      console.error('Error updating budget item:', error);
      throw error;
    }
  }

  static async addExpense(budgetItemId: string, expense: Omit<BudgetExpense, 'id' | 'createdAt'>): Promise<void> {
    try {
      const { error: expenseError } = await supabase
        .from('budget_expenses')
        .insert({
          budget_item_id: budgetItemId,
          amount: expense.amount,
          description: expense.description,
          date: expense.date,
          vendor: expense.vendor,
        });

      if (expenseError) throw expenseError;

      const { data: expenses, error: fetchError } = await supabase
        .from('budget_expenses')
        .select('amount')
        .eq('budget_item_id', budgetItemId);

      if (fetchError) throw fetchError;

      const totalSpent = expenses?.reduce((sum, exp) => sum + parseFloat(exp.amount), 0) || 0;

      const { error: updateError } = await supabase
        .from('budget_items')
        .update({ spent: totalSpent, updated_at: new Date().toISOString() })
        .eq('id', budgetItemId);

      if (updateError) throw updateError;
    } catch (error) {
      console.error('Error adding expense:', error);
      throw error;
    }
  }

  static async delete(id: string): Promise<void> {
    try {
      const { error } = await supabase
        .from('budget_items')
        .delete()
        .eq('id', id);

      if (error) throw error;
    } catch (error) {
      console.error('Error deleting budget item:', error);
      throw error;
    }
  }

  static async getStats(): Promise<BudgetStats> {
    try {
      const items = await this.getAll();

      const totalBudget = items.reduce((sum, item) => sum + item.budgeted, 0);
      const totalSpent = items.reduce((sum, item) => sum + item.spent, 0);
      const remainingBudget = totalBudget - totalSpent;
      const percentageUsed = totalBudget > 0 ? (totalSpent / totalBudget) * 100 : 0;
      const overBudgetCount = items.filter(item => item.spent > item.budgeted).length;

      return {
        totalBudget,
        totalSpent,
        remainingBudget,
        percentageUsed,
        overBudgetCount,
      };
    } catch (error) {
      console.error('Error getting budget stats:', error);
      throw error;
    }
  }
}
