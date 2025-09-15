
import { Platform } from 'react-native';

// Simple storage utility for persisting app data
class Storage {
  private static instance: Storage;
  private data: { [key: string]: any } = {};

  private constructor() {
    console.log('Storage instance created');
  }

  public static getInstance(): Storage {
    if (!Storage.instance) {
      Storage.instance = new Storage();
    }
    return Storage.instance;
  }

  async setItem(key: string, value: any): Promise<void> {
    try {
      console.log('Setting storage item:', key, value);
      this.data[key] = value;
      
      // In a real app, you would use AsyncStorage or similar
      if (Platform.OS === 'web' && typeof localStorage !== 'undefined') {
        localStorage.setItem(key, JSON.stringify(value));
      }
    } catch (error) {
      console.error('Error setting storage item:', error);
    }
  }

  async getItem(key: string): Promise<any> {
    try {
      console.log('Getting storage item:', key);
      
      // First check in-memory data
      if (this.data[key] !== undefined) {
        return this.data[key];
      }
      
      // Then check localStorage on web
      if (Platform.OS === 'web' && typeof localStorage !== 'undefined') {
        const item = localStorage.getItem(key);
        if (item) {
          const parsed = JSON.parse(item);
          this.data[key] = parsed; // Cache it
          return parsed;
        }
      }
      
      return null;
    } catch (error) {
      console.error('Error getting storage item:', error);
      return null;
    }
  }

  async removeItem(key: string): Promise<void> {
    try {
      console.log('Removing storage item:', key);
      delete this.data[key];
      
      if (Platform.OS === 'web' && typeof localStorage !== 'undefined') {
        localStorage.removeItem(key);
      }
    } catch (error) {
      console.error('Error removing storage item:', error);
    }
  }

  async clear(): Promise<void> {
    try {
      console.log('Clearing all storage');
      this.data = {};
      
      if (Platform.OS === 'web' && typeof localStorage !== 'undefined') {
        localStorage.clear();
      }
    } catch (error) {
      console.error('Error clearing storage:', error);
    }
  }

  // Helper methods for common data types
  async saveGuests(guests: any[]): Promise<void> {
    await this.setItem('wedding_guests', guests);
  }

  async loadGuests(): Promise<any[]> {
    const guests = await this.getItem('wedding_guests');
    return guests || [];
  }

  async saveBudgetItems(budgetItems: any[]): Promise<void> {
    await this.setItem('wedding_budget', budgetItems);
  }

  async loadBudgetItems(): Promise<any[]> {
    const budgetItems = await this.getItem('wedding_budget');
    return budgetItems || [];
  }

  async saveTimelineItems(timelineItems: any[]): Promise<void> {
    await this.setItem('wedding_timeline', timelineItems);
  }

  async loadTimelineItems(): Promise<any[]> {
    const timelineItems = await this.getItem('wedding_timeline');
    return timelineItems || [];
  }

  async saveVendors(vendors: any[]): Promise<void> {
    await this.setItem('wedding_vendors', vendors);
  }

  async loadVendors(): Promise<any[]> {
    const vendors = await this.getItem('wedding_vendors');
    return vendors || [];
  }

  async saveInspirationItems(inspirationItems: any[]): Promise<void> {
    await this.setItem('wedding_inspiration', inspirationItems);
  }

  async loadInspirationItems(): Promise<any[]> {
    const inspirationItems = await this.getItem('wedding_inspiration');
    return inspirationItems || [];
  }

  async saveWeddingSettings(settings: any): Promise<void> {
    await this.setItem('wedding_settings', settings);
  }

  async loadWeddingSettings(): Promise<any> {
    const settings = await this.getItem('wedding_settings');
    return settings || {
      weddingDate: '2024-06-21',
      brideName: '',
      groomName: '',
      venue: '',
      hasSeenWelcome: false,
    };
  }
}

export default Storage.getInstance();
