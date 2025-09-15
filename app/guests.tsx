
import React, { useState } from 'react';
import { Text, View, ScrollView, TouchableOpacity, TextInput, Alert } from 'react-native';
import { commonStyles, colors, buttonStyles } from '../styles/commonStyles';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';

interface Guest {
  id: string;
  name: string;
  email: string;
  status: 'pending' | 'confirmed' | 'declined';
  plusOne: boolean;
}

const GuestCard: React.FC<{ guest: Guest; onStatusChange: (id: string, status: Guest['status']) => void; onEdit: (guest: Guest) => void; onDelete: (id: string) => void }> = ({ guest, onStatusChange, onEdit, onDelete }) => {
  const getStatusColor = (status: Guest['status']) => {
    switch (status) {
      case 'confirmed': return colors.success;
      case 'declined': return colors.error;
      default: return colors.warning;
    }
  };

  const getStatusIcon = (status: Guest['status']) => {
    switch (status) {
      case 'confirmed': return 'checkmark-circle';
      case 'declined': return 'close-circle';
      default: return 'time';
    }
  };

  const handleStatusPress = () => {
    console.log('Status pressed for guest:', guest.name);
    const statusOptions = ['pending', 'confirmed', 'declined'] as const;
    const currentIndex = statusOptions.indexOf(guest.status);
    const nextIndex = (currentIndex + 1) % statusOptions.length;
    const nextStatus = statusOptions[nextIndex];
    
    console.log('Changing status from', guest.status, 'to', nextStatus);
    onStatusChange(guest.id, nextStatus);
  };

  const handleLongPress = () => {
    console.log('Long press on guest:', guest.name);
    Alert.alert(
      'Guest Options',
      `What would you like to do with ${guest.name}?`,
      [
        { text: 'Edit', onPress: () => onEdit(guest) },
        { text: 'Delete', onPress: () => onDelete(guest.id), style: 'destructive' },
        { text: 'Cancel', style: 'cancel' }
      ]
    );
  };

  return (
    <TouchableOpacity 
      style={commonStyles.cardSmall} 
      onLongPress={handleLongPress}
      delayLongPress={500}
    >
      <View style={commonStyles.row}>
        <View style={{ flex: 1 }}>
          <Text style={[commonStyles.text, { fontWeight: '600', marginBottom: 4 }]}>
            {guest.name}
          </Text>
          <Text style={[commonStyles.textLight, { marginBottom: 4 }]}>
            {guest.email}
          </Text>
          {guest.plusOne && (
            <Text style={[commonStyles.textLight, { fontSize: 12 }]}>
              + Plus One
            </Text>
          )}
        </View>
        <TouchableOpacity 
          style={{ alignItems: 'center' }}
          onPress={handleStatusPress}
        >
          <Ionicons 
            name={getStatusIcon(guest.status) as keyof typeof Ionicons.glyphMap} 
            size={24} 
            color={getStatusColor(guest.status)} 
          />
          <Text style={[commonStyles.textLight, { fontSize: 12, marginTop: 4 }]}>
            {guest.status.charAt(0).toUpperCase() + guest.status.slice(1)}
          </Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
};

export default function GuestsScreen() {
  const [guests, setGuests] = useState<Guest[]>([
    { id: '1', name: 'Marie Dubois', email: 'marie@email.com', status: 'confirmed', plusOne: true },
    { id: '2', name: 'Jean Martin', email: 'jean@email.com', status: 'pending', plusOne: false },
    { id: '3', name: 'Sophie Laurent', email: 'sophie@email.com', status: 'confirmed', plusOne: true },
    { id: '4', name: 'Pierre Moreau', email: 'pierre@email.com', status: 'declined', plusOne: false },
    { id: '5', name: 'Claire Petit', email: 'claire@email.com', status: 'pending', plusOne: true },
  ]);

  const [searchText, setSearchText] = useState('');
  const [isAddingGuest, setIsAddingGuest] = useState(false);
  const [newGuestName, setNewGuestName] = useState('');
  const [newGuestEmail, setNewGuestEmail] = useState('');
  const [newGuestPlusOne, setNewGuestPlusOne] = useState(false);

  const handleStatusChange = (id: string, status: Guest['status']) => {
    console.log('Changing guest status:', id, status);
    setGuests(prev => prev.map(guest => 
      guest.id === id ? { ...guest, status } : guest
    ));
  };

  const handleEditGuest = (guest: Guest) => {
    console.log('Editing guest:', guest.name);
    Alert.alert(
      'Edit Guest',
      `What would you like to edit for ${guest.name}?`,
      [
        { 
          text: 'Toggle Plus One', 
          onPress: () => {
            setGuests(prev => prev.map(g => 
              g.id === guest.id ? { ...g, plusOne: !g.plusOne } : g
            ));
            console.log('Toggled plus one for:', guest.name);
          }
        },
        { 
          text: 'Change Name', 
          onPress: () => {
            Alert.prompt(
              'Change Name',
              'Enter new name:',
              [
                { text: 'Cancel', style: 'cancel' },
                { 
                  text: 'Update',
                  onPress: (newName) => {
                    if (newName && newName.trim()) {
                      setGuests(prev => prev.map(g => 
                        g.id === guest.id ? { ...g, name: newName.trim() } : g
                      ));
                      console.log('Updated name for guest:', guest.id, 'to:', newName);
                    }
                  }
                }
              ],
              'plain-text',
              guest.name
            );
          }
        },
        { 
          text: 'Change Email', 
          onPress: () => {
            Alert.prompt(
              'Change Email',
              'Enter new email:',
              [
                { text: 'Cancel', style: 'cancel' },
                { 
                  text: 'Update',
                  onPress: (newEmail) => {
                    if (newEmail && newEmail.trim()) {
                      setGuests(prev => prev.map(g => 
                        g.id === guest.id ? { ...g, email: newEmail.trim() } : g
                      ));
                      console.log('Updated email for guest:', guest.id, 'to:', newEmail);
                    }
                  }
                }
              ],
              'plain-text',
              guest.email
            );
          }
        },
        { text: 'Cancel', style: 'cancel' }
      ]
    );
  };

  const handleDeleteGuest = (id: string) => {
    console.log('Deleting guest:', id);
    const guestToDelete = guests.find(g => g.id === id);
    if (guestToDelete) {
      Alert.alert(
        'Delete Guest',
        `Are you sure you want to remove ${guestToDelete.name} from your guest list?`,
        [
          { text: 'Cancel', style: 'cancel' },
          { 
            text: 'Delete', 
            style: 'destructive',
            onPress: () => {
              setGuests(prev => prev.filter(guest => guest.id !== id));
              console.log('Guest deleted:', guestToDelete.name);
            }
          }
        ]
      );
    }
  };

  const handleAddGuest = () => {
    console.log('Adding new guest');
    setIsAddingGuest(true);
  };

  const handleSaveNewGuest = () => {
    if (newGuestName.trim() && newGuestEmail.trim()) {
      const newGuest: Guest = {
        id: Date.now().toString(),
        name: newGuestName.trim(),
        email: newGuestEmail.trim(),
        status: 'pending',
        plusOne: newGuestPlusOne
      };
      
      console.log('Saving new guest:', newGuest);
      setGuests(prev => [...prev, newGuest]);
      setNewGuestName('');
      setNewGuestEmail('');
      setNewGuestPlusOne(false);
      setIsAddingGuest(false);
    } else {
      Alert.alert('Error', 'Please enter both name and email for the guest.');
    }
  };

  const handleCancelAddGuest = () => {
    console.log('Cancelling add guest');
    setNewGuestName('');
    setNewGuestEmail('');
    setNewGuestPlusOne(false);
    setIsAddingGuest(false);
  };

  const filteredGuests = guests.filter(guest =>
    guest.name.toLowerCase().includes(searchText.toLowerCase()) ||
    guest.email.toLowerCase().includes(searchText.toLowerCase())
  );

  const confirmedCount = guests.filter(g => g.status === 'confirmed').length;
  const pendingCount = guests.filter(g => g.status === 'pending').length;
  const declinedCount = guests.filter(g => g.status === 'declined').length;
  const totalGuests = guests.length;
  const plusOneCount = guests.filter(g => g.plusOne && g.status === 'confirmed').length;

  console.log('GuestsScreen rendered with', totalGuests, 'guests');

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
            Guest List
          </Text>
          <TouchableOpacity onPress={handleAddGuest}>
            <Ionicons name="add" size={24} color={colors.accent} />
          </TouchableOpacity>
        </View>

        {/* Stats */}
        <View style={[commonStyles.card, { marginBottom: 24 }]}>
          <View style={commonStyles.row}>
            <View style={commonStyles.centerContent}>
              <Text style={[commonStyles.text, { fontWeight: '700', fontSize: 20, color: colors.success }]}>
                {confirmedCount}
              </Text>
              <Text style={commonStyles.textLight}>Confirmed</Text>
            </View>
            <View style={commonStyles.centerContent}>
              <Text style={[commonStyles.text, { fontWeight: '700', fontSize: 20, color: colors.warning }]}>
                {pendingCount}
              </Text>
              <Text style={commonStyles.textLight}>Pending</Text>
            </View>
            <View style={commonStyles.centerContent}>
              <Text style={[commonStyles.text, { fontWeight: '700', fontSize: 20, color: colors.error }]}>
                {declinedCount}
              </Text>
              <Text style={commonStyles.textLight}>Declined</Text>
            </View>
          </View>
          <View style={[commonStyles.row, { marginTop: 12 }]}>
            <Text style={commonStyles.textLight}>
              Total: {totalGuests} guests
            </Text>
            <Text style={commonStyles.textLight}>
              Plus Ones: {plusOneCount}
            </Text>
          </View>
        </View>

        {/* Add Guest Form */}
        {isAddingGuest && (
          <View style={[commonStyles.card, { marginBottom: 16 }]}>
            <Text style={[commonStyles.text, { fontWeight: '600', marginBottom: 12 }]}>
              Add New Guest
            </Text>
            <TextInput
              style={[commonStyles.cardSmall, { marginBottom: 12 }]}
              placeholder="Guest Name"
              placeholderTextColor={colors.textLight}
              value={newGuestName}
              onChangeText={setNewGuestName}
            />
            <TextInput
              style={[commonStyles.cardSmall, { marginBottom: 12 }]}
              placeholder="Email Address"
              placeholderTextColor={colors.textLight}
              value={newGuestEmail}
              onChangeText={setNewGuestEmail}
              keyboardType="email-address"
              autoCapitalize="none"
            />
            <TouchableOpacity 
              style={[commonStyles.cardSmall, { 
                marginBottom: 16,
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
              }]}
              onPress={() => {
                console.log('Toggling plus one for new guest');
                setNewGuestPlusOne(!newGuestPlusOne);
              }}
            >
              <Text style={commonStyles.text}>Plus One</Text>
              <Ionicons 
                name={newGuestPlusOne ? 'checkmark-circle' : 'ellipse-outline'} 
                size={24} 
                color={newGuestPlusOne ? colors.success : colors.textLight} 
              />
            </TouchableOpacity>
            <View style={commonStyles.row}>
              <TouchableOpacity 
                style={[buttonStyles.outline, { flex: 1, marginRight: 8 }]}
                onPress={handleCancelAddGuest}
              >
                <Text style={[commonStyles.text, { color: colors.accent, fontWeight: '600' }]}>
                  Cancel
                </Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[buttonStyles.primary, { flex: 1, marginLeft: 8 }]}
                onPress={handleSaveNewGuest}
              >
                <Text style={[commonStyles.text, { fontWeight: '600' }]}>
                  Add Guest
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
              placeholder="Search guests..."
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

        {/* Guest List */}
        <ScrollView showsVerticalScrollIndicator={false}>
          {filteredGuests.length > 0 ? (
            filteredGuests.map((guest) => (
              <GuestCard
                key={guest.id}
                guest={guest}
                onStatusChange={handleStatusChange}
                onEdit={handleEditGuest}
                onDelete={handleDeleteGuest}
              />
            ))
          ) : (
            <View style={[commonStyles.card, commonStyles.centerContent]}>
              <Ionicons name="people-outline" size={48} color={colors.textLight} />
              <Text style={[commonStyles.text, { textAlign: 'center', marginTop: 16 }]}>
                {searchText ? 'No guests found matching your search' : 'No guests added yet'}
              </Text>
              <Text style={[commonStyles.textLight, { textAlign: 'center', marginTop: 8 }]}>
                {searchText ? 'Try a different search term' : 'Tap the + button to add your first guest'}
              </Text>
            </View>
          )}
          <View style={{ height: 40 }} />
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}
