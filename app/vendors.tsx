
import React, { useState } from 'react';
import { Text, View, ScrollView, TouchableOpacity, TextInput, Alert, Linking } from 'react-native';
import { commonStyles, colors, buttonStyles } from '../styles/commonStyles';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';

interface Vendor {
  id: string;
  name: string;
  category: 'photographer' | 'caterer' | 'florist' | 'musician' | 'venue' | 'decorator' | 'other';
  phone: string;
  email: string;
  website?: string;
  price: number;
  status: 'contacted' | 'booked' | 'declined' | 'pending';
  notes: string;
  rating: number;
}

const VendorCard: React.FC<{ 
  vendor: Vendor; 
  onStatusChange: (id: string, status: Vendor['status']) => void;
  onEdit: (vendor: Vendor) => void;
  onDelete: (id: string) => void;
  onContact: (vendor: Vendor) => void;
}> = ({ vendor, onStatusChange, onEdit, onDelete, onContact }) => {
  const getCategoryIcon = (category: Vendor['category']) => {
    switch (category) {
      case 'photographer': return 'camera';
      case 'caterer': return 'restaurant';
      case 'florist': return 'flower';
      case 'musician': return 'musical-notes';
      case 'venue': return 'business';
      case 'decorator': return 'color-palette';
      default: return 'briefcase';
    }
  };

  const getStatusColor = (status: Vendor['status']) => {
    switch (status) {
      case 'booked': return colors.success;
      case 'declined': return colors.error;
      case 'contacted': return colors.warning;
      default: return colors.textLight;
    }
  };

  const getStatusIcon = (status: Vendor['status']) => {
    switch (status) {
      case 'booked': return 'checkmark-circle';
      case 'declined': return 'close-circle';
      case 'contacted': return 'chatbubble';
      default: return 'time';
    }
  };

  const handleStatusPress = () => {
    console.log('Status pressed for vendor:', vendor.name);
    const statusOptions = ['pending', 'contacted', 'booked', 'declined'] as const;
    const currentIndex = statusOptions.indexOf(vendor.status);
    const nextIndex = (currentIndex + 1) % statusOptions.length;
    const nextStatus = statusOptions[nextIndex];
    
    console.log('Changing status from', vendor.status, 'to', nextStatus);
    onStatusChange(vendor.id, nextStatus);
  };

  const handleLongPress = () => {
    console.log('Long press on vendor:', vendor.name);
    Alert.alert(
      'Vendor Options',
      `What would you like to do with ${vendor.name}?`,
      [
        { text: 'Contact', onPress: () => onContact(vendor) },
        { text: 'Edit', onPress: () => onEdit(vendor) },
        { text: 'Delete', onPress: () => onDelete(vendor.id), style: 'destructive' },
        { text: 'Cancel', style: 'cancel' }
      ]
    );
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Ionicons
        key={i}
        name={i < rating ? 'star' : 'star-outline'}
        size={14}
        color={colors.gold}
      />
    ));
  };

  return (
    <TouchableOpacity 
      style={[commonStyles.cardSmall, {
        borderLeftWidth: 4,
        borderLeftColor: getStatusColor(vendor.status),
      }]} 
      onLongPress={handleLongPress}
      delayLongPress={500}
    >
      <View style={commonStyles.row}>
        <View style={{ flex: 1 }}>
          <View style={[commonStyles.row, { marginBottom: 8 }]}>
            <View style={{
              backgroundColor: colors.accent + '20',
              borderRadius: 16,
              padding: 6,
              marginRight: 12,
            }}>
              <Ionicons 
                name={getCategoryIcon(vendor.category) as keyof typeof Ionicons.glyphMap} 
                size={16} 
                color={colors.accent} 
              />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={[commonStyles.text, { fontWeight: '600', marginBottom: 2 }]}>
                {vendor.name}
              </Text>
              <Text style={[commonStyles.textLight, { fontSize: 12, textTransform: 'capitalize' }]}>
                {vendor.category}
              </Text>
            </View>
            <TouchableOpacity onPress={handleStatusPress}>
              <Ionicons 
                name={getStatusIcon(vendor.status) as keyof typeof Ionicons.glyphMap} 
                size={20} 
                color={getStatusColor(vendor.status)} 
              />
            </TouchableOpacity>
          </View>
          
          <View style={[commonStyles.row, { marginBottom: 8 }]}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              {renderStars(vendor.rating)}
              <Text style={[commonStyles.textLight, { marginLeft: 8, fontSize: 12 }]}>
                ({vendor.rating}/5)
              </Text>
            </View>
            <Text style={[commonStyles.text, { fontWeight: '600', color: colors.success }]}>
              €{vendor.price.toLocaleString()}
            </Text>
          </View>
          
          <View style={[commonStyles.row, { marginBottom: 8 }]}>
            <TouchableOpacity 
              style={{ flexDirection: 'row', alignItems: 'center', marginRight: 16 }}
              onPress={() => {
                console.log('Calling vendor:', vendor.phone);
                Linking.openURL(`tel:${vendor.phone}`);
              }}
            >
              <Ionicons name="call" size={14} color={colors.accent} />
              <Text style={[commonStyles.textLight, { marginLeft: 4, fontSize: 12 }]}>
                Call
              </Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={{ flexDirection: 'row', alignItems: 'center', marginRight: 16 }}
              onPress={() => {
                console.log('Emailing vendor:', vendor.email);
                Linking.openURL(`mailto:${vendor.email}`);
              }}
            >
              <Ionicons name="mail" size={14} color={colors.accent} />
              <Text style={[commonStyles.textLight, { marginLeft: 4, fontSize: 12 }]}>
                Email
              </Text>
            </TouchableOpacity>
            {vendor.website && (
              <TouchableOpacity 
                style={{ flexDirection: 'row', alignItems: 'center' }}
                onPress={() => {
                  console.log('Opening website:', vendor.website);
                  Linking.openURL(vendor.website!);
                }}
              >
                <Ionicons name="globe" size={14} color={colors.accent} />
                <Text style={[commonStyles.textLight, { marginLeft: 4, fontSize: 12 }]}>
                  Website
                </Text>
              </TouchableOpacity>
            )}
          </View>
          
          <Text style={[commonStyles.textLight, { 
            fontSize: 12, 
            textTransform: 'capitalize',
            color: getStatusColor(vendor.status),
            fontWeight: '600',
          }]}>
            {vendor.status}
          </Text>
          
          {vendor.notes && (
            <Text style={[commonStyles.textLight, { fontSize: 12, marginTop: 4, fontStyle: 'italic' }]}>
              "{vendor.notes}"
            </Text>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default function VendorsScreen() {
  const [vendors, setVendors] = useState<Vendor[]>([
    {
      id: '1',
      name: 'Elegant Photography Studio',
      category: 'photographer',
      phone: '+33 1 23 45 67 89',
      email: 'contact@elegantphoto.fr',
      website: 'https://elegantphoto.fr',
      price: 2500,
      status: 'booked',
      notes: 'Amazing portfolio, very professional',
      rating: 5,
    },
    {
      id: '2',
      name: 'Gourmet Catering Co.',
      category: 'caterer',
      phone: '+33 1 98 76 54 32',
      email: 'info@gourmetcatering.fr',
      website: 'https://gourmetcatering.fr',
      price: 5200,
      status: 'contacted',
      notes: 'Waiting for menu proposal',
      rating: 4,
    },
    {
      id: '3',
      name: 'Bloom & Blossom Florists',
      category: 'florist',
      phone: '+33 1 11 22 33 44',
      email: 'hello@bloomblossom.fr',
      price: 800,
      status: 'pending',
      notes: 'Recommended by venue',
      rating: 4,
    },
    {
      id: '4',
      name: 'Harmony Wedding Musicians',
      category: 'musician',
      phone: '+33 1 55 66 77 88',
      email: 'bookings@harmonywedding.fr',
      website: 'https://harmonywedding.fr',
      price: 1200,
      status: 'booked',
      notes: 'Perfect for ceremony music',
      rating: 5,
    },
    {
      id: '5',
      name: 'Château Belle Vue',
      category: 'venue',
      phone: '+33 1 99 88 77 66',
      email: 'events@chateaubellevue.fr',
      website: 'https://chateaubellevue.fr',
      price: 7500,
      status: 'booked',
      notes: 'Dream venue with garden',
      rating: 5,
    },
  ]);

  const [searchText, setSearchText] = useState('');
  const [filterCategory, setFilterCategory] = useState<Vendor['category'] | 'all'>('all');
  const [isAddingVendor, setIsAddingVendor] = useState(false);
  const [newVendorName, setNewVendorName] = useState('');
  const [newVendorPhone, setNewVendorPhone] = useState('');
  const [newVendorEmail, setNewVendorEmail] = useState('');

  const handleStatusChange = (id: string, status: Vendor['status']) => {
    console.log('Changing vendor status:', id, status);
    setVendors(prev => prev.map(vendor => 
      vendor.id === id ? { ...vendor, status } : vendor
    ));
  };

  const handleEditVendor = (vendor: Vendor) => {
    console.log('Editing vendor:', vendor.name);
    Alert.alert('Edit Vendor', `Editing functionality for ${vendor.name} will be implemented soon.`);
  };

  const handleDeleteVendor = (id: string) => {
    console.log('Deleting vendor:', id);
    const vendorToDelete = vendors.find(v => v.id === id);
    if (vendorToDelete) {
      Alert.alert(
        'Delete Vendor',
        `Are you sure you want to remove ${vendorToDelete.name} from your vendor list?`,
        [
          { text: 'Cancel', style: 'cancel' },
          { 
            text: 'Delete', 
            style: 'destructive',
            onPress: () => {
              setVendors(prev => prev.filter(vendor => vendor.id !== id));
              console.log('Vendor deleted:', vendorToDelete.name);
            }
          }
        ]
      );
    }
  };

  const handleContactVendor = (vendor: Vendor) => {
    console.log('Contacting vendor:', vendor.name);
    Alert.alert(
      'Contact Vendor',
      `How would you like to contact ${vendor.name}?`,
      [
        { 
          text: 'Call', 
          onPress: () => Linking.openURL(`tel:${vendor.phone}`)
        },
        { 
          text: 'Email', 
          onPress: () => Linking.openURL(`mailto:${vendor.email}`)
        },
        { text: 'Cancel', style: 'cancel' }
      ]
    );
  };

  const handleAddVendor = () => {
    console.log('Adding new vendor');
    setIsAddingVendor(true);
  };

  const handleSaveNewVendor = () => {
    if (newVendorName.trim() && newVendorPhone.trim() && newVendorEmail.trim()) {
      const newVendor: Vendor = {
        id: Date.now().toString(),
        name: newVendorName.trim(),
        category: 'other',
        phone: newVendorPhone.trim(),
        email: newVendorEmail.trim(),
        price: 0,
        status: 'pending',
        notes: '',
        rating: 3,
      };
      
      console.log('Saving new vendor:', newVendor);
      setVendors(prev => [...prev, newVendor]);
      setNewVendorName('');
      setNewVendorPhone('');
      setNewVendorEmail('');
      setIsAddingVendor(false);
    } else {
      Alert.alert('Error', 'Please enter name, phone, and email for the vendor.');
    }
  };

  const handleCancelAddVendor = () => {
    console.log('Cancelling add vendor');
    setNewVendorName('');
    setNewVendorPhone('');
    setNewVendorEmail('');
    setIsAddingVendor(false);
  };

  const filteredVendors = vendors.filter(vendor => {
    const matchesSearch = vendor.name.toLowerCase().includes(searchText.toLowerCase()) ||
                         vendor.category.toLowerCase().includes(searchText.toLowerCase());
    const matchesCategory = filterCategory === 'all' || vendor.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  const bookedCount = vendors.filter(v => v.status === 'booked').length;
  const contactedCount = vendors.filter(v => v.status === 'contacted').length;
  const pendingCount = vendors.filter(v => v.status === 'pending').length;
  const totalBudget = vendors.filter(v => v.status === 'booked').reduce((sum, v) => sum + v.price, 0);

  console.log('VendorsScreen rendered with', vendors.length, 'vendors');

  return (
    <SafeAreaView style={commonStyles.container}>
      <View style={commonStyles.content}>
        {/* Header */}
        <View style={[commonStyles.row, { marginBottom: 24 }]}>
          <TouchableOpacity onPress={() => {
            console.log('Back button pressed');
            router.back();
          }}>
            <Ionicons name="arrow-back" size={24} color={colors.text} />
          </TouchableOpacity>
          <Text style={[commonStyles.title, { fontSize: 24, marginBottom: 0 }]}>
            Vendor Hub
          </Text>
          <TouchableOpacity onPress={handleAddVendor}>
            <Ionicons name="add" size={24} color={colors.accent} />
          </TouchableOpacity>
        </View>

        {/* Stats */}
        <View style={[commonStyles.card, { marginBottom: 24 }]}>
          <View style={commonStyles.row}>
            <View style={commonStyles.centerContent}>
              <Text style={[commonStyles.text, { fontWeight: '700', fontSize: 20, color: colors.success }]}>
                {bookedCount}
              </Text>
              <Text style={commonStyles.textLight}>Booked</Text>
            </View>
            <View style={commonStyles.centerContent}>
              <Text style={[commonStyles.text, { fontWeight: '700', fontSize: 20, color: colors.warning }]}>
                {contactedCount}
              </Text>
              <Text style={commonStyles.textLight}>Contacted</Text>
            </View>
            <View style={commonStyles.centerContent}>
              <Text style={[commonStyles.text, { fontWeight: '700', fontSize: 20, color: colors.textLight }]}>
                {pendingCount}
              </Text>
              <Text style={commonStyles.textLight}>Pending</Text>
            </View>
          </View>
          <View style={[commonStyles.row, { marginTop: 12 }]}>
            <Text style={commonStyles.textLight}>
              Total Vendors: {vendors.length}
            </Text>
            <Text style={[commonStyles.textLight, { color: colors.success, fontWeight: '600' }]}>
              Booked Budget: €{totalBudget.toLocaleString()}
            </Text>
          </View>
        </View>

        {/* Category Filter */}
        <View style={[commonStyles.card, { marginBottom: 16 }]}>
          <Text style={[commonStyles.text, { fontWeight: '600', marginBottom: 12 }]}>
            Filter by Category
          </Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View style={{ flexDirection: 'row', gap: 8 }}>
              {(['all', 'photographer', 'caterer', 'florist', 'musician', 'venue', 'decorator', 'other'] as const).map((category) => (
                <TouchableOpacity
                  key={category}
                  style={[
                    buttonStyles.outline,
                    { 
                      paddingHorizontal: 16, 
                      paddingVertical: 8,
                      backgroundColor: filterCategory === category ? colors.accent : 'transparent'
                    }
                  ]}
                  onPress={() => {
                    console.log('Filter changed to:', category);
                    setFilterCategory(category);
                  }}
                >
                  <Text style={[
                    commonStyles.text, 
                    { 
                      color: filterCategory === category ? colors.text : colors.accent,
                      fontWeight: '600',
                      fontSize: 14,
                      textTransform: 'capitalize',
                    }
                  ]}>
                    {category === 'all' ? 'All' : category}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </ScrollView>
        </View>

        {/* Add Vendor Form */}
        {isAddingVendor && (
          <View style={[commonStyles.card, { marginBottom: 16 }]}>
            <Text style={[commonStyles.text, { fontWeight: '600', marginBottom: 12 }]}>
              Add New Vendor
            </Text>
            <TextInput
              style={[commonStyles.cardSmall, { marginBottom: 12 }]}
              placeholder="Vendor Name"
              placeholderTextColor={colors.textLight}
              value={newVendorName}
              onChangeText={setNewVendorName}
            />
            <TextInput
              style={[commonStyles.cardSmall, { marginBottom: 12 }]}
              placeholder="Phone Number"
              placeholderTextColor={colors.textLight}
              value={newVendorPhone}
              onChangeText={setNewVendorPhone}
              keyboardType="phone-pad"
            />
            <TextInput
              style={[commonStyles.cardSmall, { marginBottom: 16 }]}
              placeholder="Email Address"
              placeholderTextColor={colors.textLight}
              value={newVendorEmail}
              onChangeText={setNewVendorEmail}
              keyboardType="email-address"
              autoCapitalize="none"
            />
            <View style={commonStyles.row}>
              <TouchableOpacity 
                style={[buttonStyles.outline, { flex: 1, marginRight: 8 }]}
                onPress={handleCancelAddVendor}
              >
                <Text style={[commonStyles.text, { color: colors.accent, fontWeight: '600' }]}>
                  Cancel
                </Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[buttonStyles.primary, { flex: 1, marginLeft: 8 }]}
                onPress={handleSaveNewVendor}
              >
                <Text style={[commonStyles.text, { fontWeight: '600' }]}>
                  Add Vendor
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        {/* Search */}
        <View style={[commonStyles.cardSmall, { marginBottom: 16 }]}>
          <View style={commonStyles.row}>
            <Ionicons name="search" size={20} color={colors.textLight} />
            <TextInput
              style={[commonStyles.text, { flex: 1, marginLeft: 12 }]}
              placeholder="Search vendors..."
              placeholderTextColor={colors.textLight}
              value={searchText}
              onChangeText={(text) => {
                console.log('Search text changed:', text);
                setSearchText(text);
              }}
            />
            {searchText.length > 0 && (
              <TouchableOpacity onPress={() => setSearchText('')}>
                <Ionicons name="close" size={20} color={colors.textLight} />
              </TouchableOpacity>
            )}
          </View>
        </View>

        {/* Vendor List */}
        <ScrollView showsVerticalScrollIndicator={false}>
          {filteredVendors.length > 0 ? (
            filteredVendors.map((vendor) => (
              <VendorCard
                key={vendor.id}
                vendor={vendor}
                onStatusChange={handleStatusChange}
                onEdit={handleEditVendor}
                onDelete={handleDeleteVendor}
                onContact={handleContactVendor}
              />
            ))
          ) : (
            <View style={[commonStyles.card, commonStyles.centerContent]}>
              <Ionicons name="business-outline" size={48} color={colors.textLight} />
              <Text style={[commonStyles.text, { textAlign: 'center', marginTop: 16 }]}>
                {searchText || filterCategory !== 'all' ? 'No vendors found' : 'No vendors added yet'}
              </Text>
              <Text style={[commonStyles.textLight, { textAlign: 'center', marginTop: 8 }]}>
                {searchText || filterCategory !== 'all' ? 'Try adjusting your search or filter' : 'Tap the + button to add your first vendor'}
              </Text>
            </View>
          )}
          <View style={{ height: 40 }} />
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}
