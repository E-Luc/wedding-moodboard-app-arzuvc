import React, { useState } from 'react';
import { Text, View, ScrollView, TouchableOpacity, TextInput, Alert, ActivityIndicator } from 'react-native';
import { commonStyles, colors, buttonStyles } from '../styles/commonStyles';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useGuests } from '../hooks/useGuests';
import { Guest, GuestFormData } from '../types/Guest';
import { HelpTooltip } from '../components/HelpTooltip';

interface GuestCardProps {
  guest: Guest;
  onStatusChange: (id: string, status: Guest['status']) => void;
  onEdit: (guest: Guest) => void;
  onDelete: (id: string) => void;
}

const GuestCard: React.FC<GuestCardProps> = ({ guest, onStatusChange, onEdit, onDelete }) => {
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
    const statusOptions: Guest['status'][] = ['pending', 'confirmed', 'declined'];
    const currentIndex = statusOptions.indexOf(guest.status);
    const nextIndex = (currentIndex + 1) % statusOptions.length;
    onStatusChange(guest.id, statusOptions[nextIndex]);
  };

  const handleLongPress = () => {
    Alert.alert(
      'Options Invité',
      `Que voulez-vous faire avec ${guest.name} ?`,
      [
        { text: 'Modifier', onPress: () => onEdit(guest) },
        { text: 'Supprimer', onPress: () => onDelete(guest.id), style: 'destructive' },
        { text: 'Annuler', style: 'cancel' }
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
            <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 4 }}>
              <Ionicons name="people" size={14} color={colors.accent} />
              <Text style={[commonStyles.textLight, { fontSize: 12, marginLeft: 4 }]}>
                + {guest.plusOneName || 'Accompagnateur'}
              </Text>
            </View>
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
          <Text style={[commonStyles.textLight, { fontSize: 12, marginTop: 4, textTransform: 'capitalize' }]}>
            {guest.status === 'confirmed' ? 'Confirmé' : guest.status === 'declined' ? 'Décliné' : 'En attente'}
          </Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
};

export default function GuestsScreen() {
  const { guests, loading, error, createGuest, updateGuestStatus, deleteGuest, getStats } = useGuests();
  const [searchText, setSearchText] = useState('');
  const [isAddingGuest, setIsAddingGuest] = useState(false);
  const [newGuestName, setNewGuestName] = useState('');
  const [newGuestEmail, setNewGuestEmail] = useState('');
  const [newGuestPlusOne, setNewGuestPlusOne] = useState(false);

  const handleStatusChange = async (id: string, status: Guest['status']) => {
    const success = await updateGuestStatus(id, status);
    if (!success) {
      Alert.alert('Erreur', 'Impossible de mettre à jour le statut');
    }
  };

  const handleEditGuest = (guest: Guest) => {
    Alert.alert('Modifier', 'Fonctionnalité d\'édition à venir');
  };

  const handleDeleteGuest = async (id: string) => {
    const guest = guests.find(g => g.id === id);
    if (!guest) return;

    Alert.alert(
      'Supprimer l\'invité',
      `Êtes-vous sûr de vouloir supprimer ${guest.name} ?`,
      [
        { text: 'Annuler', style: 'cancel' },
        {
          text: 'Supprimer',
          style: 'destructive',
          onPress: async () => {
            const success = await deleteGuest(id);
            if (!success) {
              Alert.alert('Erreur', 'Impossible de supprimer l\'invité');
            }
          }
        }
      ]
    );
  };

  const handleAddGuest = () => {
    setIsAddingGuest(true);
  };

  const handleSaveNewGuest = async () => {
    if (!newGuestName.trim() || !newGuestEmail.trim()) {
      Alert.alert('Erreur', 'Veuillez entrer un nom et un email');
      return;
    }

    const formData: GuestFormData = {
      name: newGuestName.trim(),
      email: newGuestEmail.trim(),
      plusOne: newGuestPlusOne,
    };

    const newGuest = await createGuest(formData);
    if (newGuest) {
      setNewGuestName('');
      setNewGuestEmail('');
      setNewGuestPlusOne(false);
      setIsAddingGuest(false);
    } else {
      Alert.alert('Erreur', 'Impossible d\'ajouter l\'invité');
    }
  };

  const handleCancelAddGuest = () => {
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
  const plusOneCount = guests.filter(g => g.plusOne && g.status === 'confirmed').length;

  if (loading) {
    return (
      <SafeAreaView style={commonStyles.container}>
        <View style={[commonStyles.container, commonStyles.centerContent]}>
          <ActivityIndicator size="large" color={colors.accent} />
          <Text style={[commonStyles.text, { marginTop: 16 }]}>Chargement...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={commonStyles.container}>
      <View style={commonStyles.content}>
        {/* Header */}
        <View style={[commonStyles.row, { marginBottom: 24 }]}>
          <TouchableOpacity onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={24} color={colors.text} />
          </TouchableOpacity>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Text style={[commonStyles.title, { fontSize: 24, marginBottom: 0 }]}>
              Liste d'Invités
            </Text>
            <HelpTooltip
              title="Gestion des Invités"
              content="Gérez votre liste d'invités, suivez les confirmations et les accompagnateurs. Appuyez longuement sur un invité pour plus d'options."
            />
          </View>
          <TouchableOpacity onPress={handleAddGuest}>
            <Ionicons name="add-circle" size={28} color={colors.accent} />
          </TouchableOpacity>
        </View>

        {error && (
          <View style={[commonStyles.card, { backgroundColor: colors.error + '10', marginBottom: 16 }]}>
            <Text style={[commonStyles.text, { color: colors.error }]}>{error}</Text>
          </View>
        )}

        {/* Stats */}
        <View style={[commonStyles.card, { marginBottom: 24 }]}>
          <View style={commonStyles.row}>
            <View style={commonStyles.centerContent}>
              <Text style={[commonStyles.text, { fontWeight: '700', fontSize: 20, color: colors.success }]}>
                {confirmedCount}
              </Text>
              <Text style={commonStyles.textLight}>Confirmés</Text>
            </View>
            <View style={commonStyles.centerContent}>
              <Text style={[commonStyles.text, { fontWeight: '700', fontSize: 20, color: colors.warning }]}>
                {pendingCount}
              </Text>
              <Text style={commonStyles.textLight}>En attente</Text>
            </View>
            <View style={commonStyles.centerContent}>
              <Text style={[commonStyles.text, { fontWeight: '700', fontSize: 20, color: colors.error }]}>
                {declinedCount}
              </Text>
              <Text style={commonStyles.textLight}>Déclinés</Text>
            </View>
          </View>
          <View style={[commonStyles.row, { marginTop: 12 }]}>
            <Text style={commonStyles.textLight}>
              Total: {guests.length} invités
            </Text>
            <Text style={commonStyles.textLight}>
              Accompagnateurs: {plusOneCount}
            </Text>
          </View>
        </View>

        {/* Add Guest Form */}
        {isAddingGuest && (
          <View style={[commonStyles.card, { marginBottom: 16, borderColor: colors.accent, borderWidth: 2 }]}>
            <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 12 }}>
              <Text style={[commonStyles.text, { fontWeight: '600', flex: 1 }]}>
                Nouvel Invité
              </Text>
              <HelpTooltip
                title="Ajouter un Invité"
                content="Remplissez les informations de l'invité. Activez 'Accompagnateur' s'il vient avec quelqu'un."
                size={18}
              />
            </View>
            <TextInput
              style={[commonStyles.cardSmall, { marginBottom: 12 }]}
              placeholder="Nom complet"
              placeholderTextColor={colors.textLight}
              value={newGuestName}
              onChangeText={setNewGuestName}
            />
            <TextInput
              style={[commonStyles.cardSmall, { marginBottom: 12 }]}
              placeholder="Email"
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
                backgroundColor: newGuestPlusOne ? colors.accentLight : colors.backgroundAlt,
              }]}
              onPress={() => setNewGuestPlusOne(!newGuestPlusOne)}
            >
              <Text style={commonStyles.text}>Accompagnateur</Text>
              <Ionicons
                name={newGuestPlusOne ? 'checkmark-circle' : 'ellipse-outline'}
                size={24}
                color={newGuestPlusOne ? colors.accent : colors.textLight}
              />
            </TouchableOpacity>
            <View style={commonStyles.row}>
              <TouchableOpacity
                style={[buttonStyles.outline, { flex: 1, marginRight: 8 }]}
                onPress={handleCancelAddGuest}
              >
                <Text style={[commonStyles.text, { color: colors.accent, fontWeight: '600' }]}>
                  Annuler
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[buttonStyles.primary, { flex: 1, marginLeft: 8 }]}
                onPress={handleSaveNewGuest}
              >
                <Text style={[commonStyles.text, { fontWeight: '600', color: colors.card }]}>
                  Ajouter
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
              placeholder="Rechercher..."
              placeholderTextColor={colors.textLight}
              value={searchText}
              onChangeText={setSearchText}
            />
            {searchText.length > 0 && (
              <TouchableOpacity onPress={() => setSearchText('')}>
                <Ionicons name="close-circle" size={20} color={colors.textLight} />
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
            <View style={[commonStyles.card, commonStyles.centerContent, { padding: 40 }]}>
              <Ionicons name="people-outline" size={64} color={colors.textLight} />
              <Text style={[commonStyles.text, { textAlign: 'center', marginTop: 16, fontWeight: '600' }]}>
                {searchText ? 'Aucun invité trouvé' : 'Aucun invité'}
              </Text>
              <Text style={[commonStyles.textLight, { textAlign: 'center', marginTop: 8 }]}>
                {searchText ? 'Essayez une autre recherche' : 'Appuyez sur + pour ajouter votre premier invité'}
              </Text>
            </View>
          )}
          <View style={{ height: 40 }} />
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}
