import { supabase } from '../utils/supabase';
import { Vendor, VendorFormData, VendorStats } from '../types/Vendor';

export class VendorService {
  static async getAll(): Promise<Vendor[]> {
    try {
      const { data, error } = await supabase
        .from('vendors')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      return (data || []).map(vendor => ({
        ...vendor,
        price: parseFloat(vendor.price),
        website: vendor.website || undefined,
        address: vendor.address || undefined,
        contactPerson: vendor.contact_person || undefined,
        contractSigned: vendor.contract_signed || false,
        depositPaid: vendor.deposit_paid || false,
        createdAt: vendor.created_at,
        updatedAt: vendor.updated_at,
      }));
    } catch (error) {
      console.error('Error fetching vendors:', error);
      throw error;
    }
  }

  static async create(formData: VendorFormData): Promise<Vendor> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('vendors')
        .insert({
          user_id: user.id,
          name: formData.name,
          category: formData.category,
          phone: formData.phone,
          email: formData.email,
          website: formData.website,
          price: formData.price,
          status: 'pending',
          notes: formData.notes || '',
          rating: formData.rating || 3,
          address: formData.address,
          contact_person: formData.contactPerson,
        })
        .select()
        .single();

      if (error) throw error;
      if (!data) throw new Error('No data returned');

      return {
        ...data,
        price: parseFloat(data.price),
        contactPerson: data.contact_person,
        contractSigned: data.contract_signed,
        depositPaid: data.deposit_paid,
        createdAt: data.created_at,
        updatedAt: data.updated_at,
      };
    } catch (error) {
      console.error('Error creating vendor:', error);
      throw error;
    }
  }

  static async update(id: string, updates: Partial<VendorFormData>): Promise<Vendor> {
    try {
      const updateData: any = {
        updated_at: new Date().toISOString(),
      };

      if (updates.name !== undefined) updateData.name = updates.name;
      if (updates.category !== undefined) updateData.category = updates.category;
      if (updates.phone !== undefined) updateData.phone = updates.phone;
      if (updates.email !== undefined) updateData.email = updates.email;
      if (updates.website !== undefined) updateData.website = updates.website;
      if (updates.price !== undefined) updateData.price = updates.price;
      if (updates.notes !== undefined) updateData.notes = updates.notes;
      if (updates.rating !== undefined) updateData.rating = updates.rating;
      if (updates.address !== undefined) updateData.address = updates.address;
      if (updates.contactPerson !== undefined) updateData.contact_person = updates.contactPerson;

      const { data, error } = await supabase
        .from('vendors')
        .update(updateData)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      if (!data) throw new Error('No data returned');

      return {
        ...data,
        price: parseFloat(data.price),
        contactPerson: data.contact_person,
        contractSigned: data.contract_signed,
        depositPaid: data.deposit_paid,
        createdAt: data.created_at,
        updatedAt: data.updated_at,
      };
    } catch (error) {
      console.error('Error updating vendor:', error);
      throw error;
    }
  }

  static async updateStatus(id: string, status: Vendor['status']): Promise<void> {
    try {
      const { error } = await supabase
        .from('vendors')
        .update({ status, updated_at: new Date().toISOString() })
        .eq('id', id);

      if (error) throw error;
    } catch (error) {
      console.error('Error updating vendor status:', error);
      throw error;
    }
  }

  static async delete(id: string): Promise<void> {
    try {
      const { error } = await supabase
        .from('vendors')
        .delete()
        .eq('id', id);

      if (error) throw error;
    } catch (error) {
      console.error('Error deleting vendor:', error);
      throw error;
    }
  }

  static async getStats(): Promise<VendorStats> {
    try {
      const vendors = await this.getAll();

      return {
        total: vendors.length,
        booked: vendors.filter(v => v.status === 'booked').length,
        contacted: vendors.filter(v => v.status === 'contacted').length,
        pending: vendors.filter(v => v.status === 'pending').length,
        totalBudget: vendors
          .filter(v => v.status === 'booked')
          .reduce((sum, v) => sum + v.price, 0),
      };
    } catch (error) {
      console.error('Error getting vendor stats:', error);
      throw error;
    }
  }
}
