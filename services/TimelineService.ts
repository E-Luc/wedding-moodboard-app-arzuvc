import { supabase } from '../utils/supabase';
import { TimelineItem, TimelineFormData, TimelineStats } from '../types/Timeline';

export class TimelineService {
  static async getAll(): Promise<TimelineItem[]> {
    try {
      const { data, error } = await supabase
        .from('timeline_items')
        .select('*')
        .order('date', { ascending: true });

      if (error) throw error;

      return (data || []).map(item => ({
        ...item,
        priority: item.priority || undefined,
        assignedTo: item.assigned_to || undefined,
        notes: item.notes || undefined,
        createdAt: item.created_at,
        updatedAt: item.updated_at,
      }));
    } catch (error) {
      console.error('Error fetching timeline items:', error);
      throw error;
    }
  }

  static async create(formData: TimelineFormData): Promise<TimelineItem> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('timeline_items')
        .insert({
          user_id: user.id,
          title: formData.title,
          description: formData.description,
          date: formData.date,
          time: formData.time,
          category: formData.category,
          completed: false,
          icon: 'checkmark-circle',
          priority: formData.priority || 'medium',
          assigned_to: formData.assignedTo,
          notes: formData.notes,
        })
        .select()
        .single();

      if (error) throw error;
      if (!data) throw new Error('No data returned');

      return {
        ...data,
        assignedTo: data.assigned_to,
        createdAt: data.created_at,
        updatedAt: data.updated_at,
      };
    } catch (error) {
      console.error('Error creating timeline item:', error);
      throw error;
    }
  }

  static async update(id: string, updates: Partial<TimelineFormData>): Promise<TimelineItem> {
    try {
      const updateData: any = {
        updated_at: new Date().toISOString(),
      };

      if (updates.title !== undefined) updateData.title = updates.title;
      if (updates.description !== undefined) updateData.description = updates.description;
      if (updates.date !== undefined) updateData.date = updates.date;
      if (updates.time !== undefined) updateData.time = updates.time;
      if (updates.category !== undefined) updateData.category = updates.category;
      if (updates.priority !== undefined) updateData.priority = updates.priority;
      if (updates.assignedTo !== undefined) updateData.assigned_to = updates.assignedTo;
      if (updates.notes !== undefined) updateData.notes = updates.notes;

      const { data, error } = await supabase
        .from('timeline_items')
        .update(updateData)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      if (!data) throw new Error('No data returned');

      return {
        ...data,
        assignedTo: data.assigned_to,
        createdAt: data.created_at,
        updatedAt: data.updated_at,
      };
    } catch (error) {
      console.error('Error updating timeline item:', error);
      throw error;
    }
  }

  static async toggleComplete(id: string): Promise<void> {
    try {
      const { data: item } = await supabase
        .from('timeline_items')
        .select('completed')
        .eq('id', id)
        .single();

      if (!item) throw new Error('Item not found');

      const { error } = await supabase
        .from('timeline_items')
        .update({
          completed: !item.completed,
          updated_at: new Date().toISOString()
        })
        .eq('id', id);

      if (error) throw error;
    } catch (error) {
      console.error('Error toggling timeline item:', error);
      throw error;
    }
  }

  static async delete(id: string): Promise<void> {
    try {
      const { error } = await supabase
        .from('timeline_items')
        .delete()
        .eq('id', id);

      if (error) throw error;
    } catch (error) {
      console.error('Error deleting timeline item:', error);
      throw error;
    }
  }

  static async getStats(): Promise<TimelineStats> {
    try {
      const items = await this.getAll();

      const categoryBreakdown = items.reduce((acc, item) => {
        acc[item.category] = (acc[item.category] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);

      const completed = items.filter(i => i.completed).length;
      const total = items.length;

      return {
        total,
        completed,
        remaining: total - completed,
        percentageComplete: total > 0 ? (completed / total) * 100 : 0,
        categoryBreakdown,
      };
    } catch (error) {
      console.error('Error getting timeline stats:', error);
      throw error;
    }
  }
}
