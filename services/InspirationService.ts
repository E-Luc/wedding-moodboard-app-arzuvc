import { supabase } from '../utils/supabase';
import { InspirationItem, InspirationFormData, InspirationStats } from '../types/Inspiration';

export class InspirationService {
  static async getAll(): Promise<InspirationItem[]> {
    try {
      const { data, error } = await supabase
        .from('inspiration_items')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      return (data || []).map(item => ({
        ...item,
        imageUrl: item.image_url,
        isFavorite: item.is_favorite,
        dateAdded: new Date(item.created_at).toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric',
          year: 'numeric'
        }),
        source: item.source || undefined,
        notes: item.notes || undefined,
        createdAt: item.created_at,
        updatedAt: item.updated_at,
      }));
    } catch (error) {
      console.error('Error fetching inspiration items:', error);
      throw error;
    }
  }

  static async create(formData: InspirationFormData): Promise<InspirationItem> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('inspiration_items')
        .insert({
          user_id: user.id,
          title: formData.title,
          description: formData.description,
          image_url: formData.imageUrl,
          category: formData.category,
          tags: formData.tags || [],
          is_favorite: false,
          source: formData.source,
          notes: formData.notes,
        })
        .select()
        .single();

      if (error) throw error;
      if (!data) throw new Error('No data returned');

      return {
        ...data,
        imageUrl: data.image_url,
        isFavorite: data.is_favorite,
        dateAdded: new Date(data.created_at).toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric',
          year: 'numeric'
        }),
        createdAt: data.created_at,
        updatedAt: data.updated_at,
      };
    } catch (error) {
      console.error('Error creating inspiration item:', error);
      throw error;
    }
  }

  static async update(id: string, updates: Partial<InspirationFormData>): Promise<InspirationItem> {
    try {
      const updateData: any = {
        updated_at: new Date().toISOString(),
      };

      if (updates.title !== undefined) updateData.title = updates.title;
      if (updates.description !== undefined) updateData.description = updates.description;
      if (updates.imageUrl !== undefined) updateData.image_url = updates.imageUrl;
      if (updates.category !== undefined) updateData.category = updates.category;
      if (updates.tags !== undefined) updateData.tags = updates.tags;
      if (updates.source !== undefined) updateData.source = updates.source;
      if (updates.notes !== undefined) updateData.notes = updates.notes;

      const { data, error } = await supabase
        .from('inspiration_items')
        .update(updateData)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      if (!data) throw new Error('No data returned');

      return {
        ...data,
        imageUrl: data.image_url,
        isFavorite: data.is_favorite,
        dateAdded: new Date(data.created_at).toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric',
          year: 'numeric'
        }),
        createdAt: data.created_at,
        updatedAt: data.updated_at,
      };
    } catch (error) {
      console.error('Error updating inspiration item:', error);
      throw error;
    }
  }

  static async toggleFavorite(id: string): Promise<void> {
    try {
      const { data: item } = await supabase
        .from('inspiration_items')
        .select('is_favorite')
        .eq('id', id)
        .single();

      if (!item) throw new Error('Item not found');

      const { error } = await supabase
        .from('inspiration_items')
        .update({
          is_favorite: !item.is_favorite,
          updated_at: new Date().toISOString()
        })
        .eq('id', id);

      if (error) throw error;
    } catch (error) {
      console.error('Error toggling favorite:', error);
      throw error;
    }
  }

  static async delete(id: string): Promise<void> {
    try {
      const { error } = await supabase
        .from('inspiration_items')
        .delete()
        .eq('id', id);

      if (error) throw error;
    } catch (error) {
      console.error('Error deleting inspiration item:', error);
      throw error;
    }
  }

  static async getStats(): Promise<InspirationStats> {
    try {
      const items = await this.getAll();

      const categoryCounts = items.reduce((acc, item) => {
        acc[item.category] = (acc[item.category] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);

      return {
        total: items.length,
        favorites: items.filter(i => i.isFavorite).length,
        categoryCounts,
      };
    } catch (error) {
      console.error('Error getting inspiration stats:', error);
      throw error;
    }
  }
}
