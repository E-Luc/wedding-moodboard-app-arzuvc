
import React, { useState } from 'react';
import { Text, View, ScrollView, TouchableOpacity, TextInput } from 'react-native';
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

const GuestCard: React.FC<{ guest: Guest; onStatusChange: (id: string, status: Guest['status']) => void }> = ({ guest, onStatusChange }) => {
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

  return (
    <View style={commonStyles.cardSmall}>
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
        <View style={{ alignItems: 'center' }}>
          <Ionicons 
            name={getStatusIcon(guest.status) as keyof typeof Ionicons.glyphMap} 
            size={24} 
            color={getStatusColor(guest.status)} 
          />
          <Text style={[commonStyles.textLight, { fontSize: 12, marginTop: 4 }]}>
            {guest.status.charAt(0).toUpperCase() + guest.status.slice(1)}
          </Text>
        </View>
      </View>
    </View>
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

  const handleStatusChange = (id: string, status: Guest['status']) => {
    console.log('Changing guest status:', id, status);
    setGuests(prev => prev.map(guest => 
      guest.id === id ? { ...guest, status } : guest
    ));
  };

  const filteredGuests = guests.filter(guest =>
    guest.name.toLowerCase().includes(searchText.toLowerCase()) ||
    guest.email.toLowerCase().includes(searchText.toLowerCase())
  );

  const confirmedCount = guests.filter(g => g.status === 'confirmed').length;
  const pendingCount = guests.filter(g => g.status === 'pending').length;
  const declinedCount = guests.filter(g => g.status === 'declined').length;

  return (
    <SafeAreaView style={commonStyles.container}>
      <View style={commonStyles.content}>
        {/* Header */}
        <View style={[commonStyles.row, { marginBottom: 24 }]}>
          <TouchableOpacity onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={24} color={colors.text} />
          </TouchableOpacity>
          <Text style={[commonStyles.title, { fontSize: 24, marginBottom: 0 }]}>
            Guest List
          </Text>
          <TouchableOpacity>
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
        </View>

        {/* Search */}
        <View style={[commonStyles.cardSmall, { marginBottom: 16 }]}>
          <View style={commonStyles.row}>
            <Ionicons name="search" size={20} color={colors.textLight} />
            <TextInput
              style={[commonStyles.text, { flex: 1, marginLeft: 12 }]}
              placeholder="Search guests..."
              placeholderTextColor={colors.textLight}
              value={searchText}
              onChangeText={setSearchText}
            />
          </View>
        </View>

        {/* Guest List */}
        <ScrollView showsVerticalScrollIndicator={false}>
          {filteredGuests.map((guest) => (
            <GuestCard
              key={guest.id}
              guest={guest}
              onStatusChange={handleStatusChange}
            />
          ))}
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}
