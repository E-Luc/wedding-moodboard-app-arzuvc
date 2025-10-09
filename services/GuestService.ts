import { supabase } from '../utils/supabase';
import { Guest, GuestFormData } from '../types/Guest';

export class GuestService {
  static async getAll(): Promise<Guest[]> {
    try {
      const { data, error } = await supabase
        .from('guests')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      return (data || []).map(guest => ({
        ...guest,
        group: guest.group || undefined,
        phone: guest.phone || undefined,
        plusOneName: guest.plus_one_name || undefined,
        dietaryRestrictions: guest.dietary_restrictions || undefined,
        notes: guest.notes || undefined,
        createdAt: guest.created_at,
        updatedAt: guest.updated_at,
      }));
    } catch (error) {
      console.error('Error fetching guests:', error);
      throw error;
    }
  }

  static async create(formData: GuestFormData): Promise<Guest> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('guests')
        .insert({
          user_id: user.id,
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          plus_one: formData.plusOne,
          plus_one_name: formData.plusOneName,
          group: formData.group,
          dietary_restrictions: formData.dietaryRestrictions,
          notes: formData.notes,
          status: 'pending',
        })
        .select()
        .single();

      if (error) throw error;
      if (!data) throw new Error('No data returned');

      return {
        ...data,
        plusOneName: data.plus_one_name,
        dietaryRestrictions: data.dietary_restrictions,
        createdAt: data.created_at,
        updatedAt: data.updated_at,
      };
    } catch (error) {
      console.error('Error creating guest:', error);
      throw error;
    }
  }

  static async update(id: string, updates: Partial<GuestFormData>): Promise<Guest> {
    try {
      const updateData: any = {
        updated_at: new Date().toISOString(),
      };

      if (updates.name !== undefined) updateData.name = updates.name;
      if (updates.email !== undefined) updateData.email = updates.email;
      if (updates.phone !== undefined) updateData.phone = updates.phone;
      if (updates.plusOne !== undefined) updateData.plus_one = updates.plusOne;
      if (updates.plusOneName !== undefined) updateData.plus_one_name = updates.plusOneName;
      if (updates.group !== undefined) updateData.group = updates.group;
      if (updates.dietaryRestrictions !== undefined) updateData.dietary_restrictions = updates.dietaryRestrictions;
      if (updates.notes !== undefined) updateData.notes = updates.notes;

      const { data, error } = await supabase
        .from('guests')
        .update(updateData)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      if (!data) throw new Error('No data returned');

      return {
        ...data,
        plusOneName: data.plus_one_name,
        dietaryRestrictions: data.dietary_restrictions,
        createdAt: data.created_at,
        updatedAt: data.updated_at,
      };
    } catch (error) {
      console.error('Error updating guest:', error);
      throw error;
    }
  }

  static async updateStatus(id: string, status: Guest['status']): Promise<void> {
    try {
      const { error } = await supabase
        .from('guests')
        .update({ status, updated_at: new Date().toISOString() })
        .eq('id', id);

      if (error) throw error;
    } catch (error) {
      console.error('Error updating guest status:', error);
      throw error;
    }
  }

  static async delete(id: string): Promise<void> {
    try {
      const { error } = await supabase
        .from('guests')
        .delete()
        .eq('id', id);

      if (error) throw error;
    } catch (error) {
      console.error('Error deleting guest:', error);
      throw error;
    }
  }

  static async getStats() {
    try {
      const guests = await this.getAll();

      return {
        total: guests.length,
        confirmed: guests.filter(g => g.status === 'confirmed').length,
        pending: guests.filter(g => g.status === 'pending').length,
        declined: guests.filter(g => g.status === 'declined').length,
        plusOnes: guests.filter(g => g.plusOne && g.status === 'confirmed').length,
      };
    } catch (error) {
      console.error('Error getting guest stats:', error);
      throw error;
    }
  }
}
