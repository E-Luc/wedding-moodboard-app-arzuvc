
import React, { useState } from 'react';
import { Text, View, ScrollView, TouchableOpacity, TextInput, Alert, Image, Dimensions } from 'react-native';
import { commonStyles, colors, buttonStyles } from '../styles/commonStyles';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';

const { width } = Dimensions.get('window');

interface InspirationItem {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  category: 'dress' | 'flowers' | 'venue' | 'decoration' | 'cake' | 'hairstyle' | 'other';
  tags: string[];
  isFavorite: boolean;
  dateAdded: string;
}

const InspirationCard: React.FC<{ 
  item: InspirationItem; 
  onToggleFavorite: (id: string) => void;
  onEdit: (item: InspirationItem) => void;
  onDelete: (id: string) => void;
}> = ({ item, onToggleFavorite, onEdit, onDelete }) => {
  const getCategoryIcon = (category: InspirationItem['category']) => {
    switch (category) {
      case 'dress': return 'shirt';
      case 'flowers': return 'flower';
      case 'venue': return 'business';
      case 'decoration': return 'color-palette';
      case 'cake': return 'cafe';
      case 'hairstyle': return 'cut';
      default: return 'image';
    }
  };

  const getCategoryColor = (category: InspirationItem['category']) => {
    switch (category) {
      case 'dress': return '#E91E63';
      case 'flowers': return colors.success;
      case 'venue': return colors.accent;
      case 'decoration': return colors.gold;
      case 'cake': return '#FF5722';
      case 'hairstyle': return '#9C27B0';
      default: return colors.textLight;
    }
  };

  const handleLongPress = () => {
    console.log('Long press on inspiration item:', item.title);
    Alert.alert(
      'Inspiration Options',
      `What would you like to do with "${item.title}"?`,
      [
        { text: 'Edit', onPress: () => onEdit(item) },
        { text: 'Delete', onPress: () => onDelete(item.id), style: 'destructive' },
        { text: 'Cancel', style: 'cancel' }
      ]
    );
  };

  return (
    <TouchableOpacity 
      style={[commonStyles.card, { 
        width: (width - 60) / 2,
        marginBottom: 16,
      }]}
      onLongPress={handleLongPress}
      delayLongPress={500}
    >
      <View style={{ position: 'relative', marginBottom: 12 }}>
        <Image 
          source={{ uri: item.imageUrl }}
          style={{
            width: '100%',
            height: 120,
            borderRadius: 8,
            backgroundColor: colors.backgroundAlt,
          }}
          resizeMode="cover"
        />
        <TouchableOpacity 
          style={{
            position: 'absolute',
            top: 8,
            right: 8,
            backgroundColor: 'rgba(0,0,0,0.6)',
            borderRadius: 16,
            padding: 6,
          }}
          onPress={() => {
            console.log('Toggling favorite for:', item.title);
            onToggleFavorite(item.id);
          }}
        >
          <Ionicons 
            name={item.isFavorite ? 'heart' : 'heart-outline'} 
            size={16} 
            color={item.isFavorite ? colors.error : colors.background} 
          />
        </TouchableOpacity>
        <View style={{
          position: 'absolute',
          bottom: 8,
          left: 8,
          backgroundColor: getCategoryColor(item.category) + '90',
          borderRadius: 12,
          paddingHorizontal: 8,
          paddingVertical: 4,
          flexDirection: 'row',
          alignItems: 'center',
        }}>
          <Ionicons 
            name={getCategoryIcon(item.category) as keyof typeof Ionicons.glyphMap} 
            size={12} 
            color={colors.background} 
          />
          <Text style={[commonStyles.textLight, { 
            color: colors.background, 
            fontSize: 10, 
            marginLeft: 4,
            textTransform: 'capitalize',
            fontWeight: '600',
          }]}>
            {item.category}
          </Text>
        </View>
      </View>
      
      <Text style={[commonStyles.text, { 
        fontWeight: '600', 
        marginBottom: 4,
        fontSize: 14,
      }]}>
        {item.title}
      </Text>
      
      <Text style={[commonStyles.textLight, { 
        fontSize: 12, 
        marginBottom: 8,
        lineHeight: 16,
      }]} numberOfLines={2}>
        {item.description}
      </Text>
      
      {item.tags.length > 0 && (
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', marginBottom: 8 }}>
          {item.tags.slice(0, 2).map((tag, index) => (
            <View key={index} style={{
              backgroundColor: colors.accent + '20',
              borderRadius: 8,
              paddingHorizontal: 6,
              paddingVertical: 2,
              marginRight: 4,
              marginBottom: 4,
            }}>
              <Text style={[commonStyles.textLight, { 
                fontSize: 10, 
                color: colors.accent,
                fontWeight: '600',
              }]}>
                #{tag}
              </Text>
            </View>
          ))}
          {item.tags.length > 2 && (
            <Text style={[commonStyles.textLight, { fontSize: 10 }]}>
              +{item.tags.length - 2} more
            </Text>
          )}
        </View>
      )}
      
      <Text style={[commonStyles.textLight, { fontSize: 10 }]}>
        Added {item.dateAdded}
      </Text>
    </TouchableOpacity>
  );
};

export default function InspirationScreen() {
  const [inspirationItems, setInspirationItems] = useState<InspirationItem[]>([
    {
      id: '1',
      title: 'Elegant White Dress',
      description: 'Beautiful flowing white dress with lace details and long train',
      imageUrl: 'https://images.unsplash.com/photo-1594736797933-d0401ba2fe65?w=400',
      category: 'dress',
      tags: ['elegant', 'lace', 'white', 'train'],
      isFavorite: true,
      dateAdded: 'Jan 15, 2024',
    },
    {
      id: '2',
      title: 'Garden Venue Setup',
      description: 'Outdoor ceremony with beautiful garden backdrop and fairy lights',
      imageUrl: 'https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=400',
      category: 'venue',
      tags: ['outdoor', 'garden', 'lights', 'romantic'],
      isFavorite: false,
      dateAdded: 'Jan 20, 2024',
    },
    {
      id: '3',
      title: 'Bridal Bouquet',
      description: 'Soft pink and white roses with eucalyptus leaves',
      imageUrl: 'https://images.unsplash.com/photo-1606800052052-a08af7148866?w=400',
      category: 'flowers',
      tags: ['roses', 'pink', 'white', 'eucalyptus'],
      isFavorite: true,
      dateAdded: 'Feb 1, 2024',
    },
    {
      id: '4',
      title: 'Vintage Cake Design',
      description: 'Three-tier cake with vintage lace pattern and fresh flowers',
      imageUrl: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=400',
      category: 'cake',
      tags: ['vintage', 'lace', 'flowers', 'three-tier'],
      isFavorite: false,
      dateAdded: 'Feb 5, 2024',
    },
    {
      id: '5',
      title: 'Romantic Hairstyle',
      description: 'Loose curls with braided crown and baby\'s breath flowers',
      imageUrl: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=400',
      category: 'hairstyle',
      tags: ['curls', 'braids', 'flowers', 'romantic'],
      isFavorite: true,
      dateAdded: 'Feb 10, 2024',
    },
    {
      id: '6',
      title: 'Table Centerpiece',
      description: 'Gold candelabras with white flowers and greenery',
      imageUrl: 'https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=400',
      category: 'decoration',
      tags: ['gold', 'candles', 'centerpiece', 'elegant'],
      isFavorite: false,
      dateAdded: 'Feb 15, 2024',
    },
  ]);

  const [searchText, setSearchText] = useState('');
  const [filterCategory, setFilterCategory] = useState<InspirationItem['category'] | 'all' | 'favorites'>('all');
  const [isAddingItem, setIsAddingItem] = useState(false);
  const [newItemTitle, setNewItemTitle] = useState('');
  const [newItemDescription, setNewItemDescription] = useState('');

  const handleToggleFavorite = (id: string) => {
    console.log('Toggling favorite for item:', id);
    setInspirationItems(prev => prev.map(item =>
      item.id === id ? { ...item, isFavorite: !item.isFavorite } : item
    ));
  };

  const handleEditItem = (item: InspirationItem) => {
    console.log('Editing inspiration item:', item.title);
    Alert.alert('Edit Inspiration', `Editing functionality for "${item.title}" will be implemented soon.`);
  };

  const handleDeleteItem = (id: string) => {
    console.log('Deleting inspiration item:', id);
    const itemToDelete = inspirationItems.find(i => i.id === id);
    if (itemToDelete) {
      Alert.alert(
        'Delete Inspiration',
        `Are you sure you want to remove "${itemToDelete.title}" from your inspiration board?`,
        [
          { text: 'Cancel', style: 'cancel' },
          { 
            text: 'Delete', 
            style: 'destructive',
            onPress: () => {
              setInspirationItems(prev => prev.filter(item => item.id !== id));
              console.log('Inspiration item deleted:', itemToDelete.title);
            }
          }
        ]
      );
    }
  };

  const handleAddItem = () => {
    console.log('Adding new inspiration item');
    setIsAddingItem(true);
  };

  const handleSaveNewItem = () => {
    if (newItemTitle.trim() && newItemDescription.trim()) {
      const newItem: InspirationItem = {
        id: Date.now().toString(),
        title: newItemTitle.trim(),
        description: newItemDescription.trim(),
        imageUrl: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=400',
        category: 'other',
        tags: [],
        isFavorite: false,
        dateAdded: new Date().toLocaleDateString('en-US', { 
          month: 'short', 
          day: 'numeric', 
          year: 'numeric' 
        }),
      };
      
      console.log('Saving new inspiration item:', newItem);
      setInspirationItems(prev => [newItem, ...prev]);
      setNewItemTitle('');
      setNewItemDescription('');
      setIsAddingItem(false);
    } else {
      Alert.alert('Error', 'Please enter both title and description for the inspiration item.');
    }
  };

  const handleCancelAddItem = () => {
    console.log('Cancelling add inspiration item');
    setNewItemTitle('');
    setNewItemDescription('');
    setIsAddingItem(false);
  };

  const filteredItems = inspirationItems.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(searchText.toLowerCase()) ||
                         item.description.toLowerCase().includes(searchText.toLowerCase()) ||
                         item.tags.some(tag => tag.toLowerCase().includes(searchText.toLowerCase()));
    
    let matchesCategory = true;
    if (filterCategory === 'favorites') {
      matchesCategory = item.isFavorite;
    } else if (filterCategory !== 'all') {
      matchesCategory = item.category === filterCategory;
    }
    
    return matchesSearch && matchesCategory;
  });

  const favoriteCount = inspirationItems.filter(item => item.isFavorite).length;
  const categoryStats = {
    dress: inspirationItems.filter(item => item.category === 'dress').length,
    flowers: inspirationItems.filter(item => item.category === 'flowers').length,
    venue: inspirationItems.filter(item => item.category === 'venue').length,
    decoration: inspirationItems.filter(item => item.category === 'decoration').length,
    cake: inspirationItems.filter(item => item.category === 'cake').length,
    hairstyle: inspirationItems.filter(item => item.category === 'hairstyle').length,
    other: inspirationItems.filter(item => item.category === 'other').length,
  };

  console.log('InspirationScreen rendered with', inspirationItems.length, 'items');

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
            Inspiration Board
          </Text>
          <TouchableOpacity onPress={handleAddItem}>
            <Ionicons name="add" size={24} color={colors.accent} />
          </TouchableOpacity>
        </View>

        {/* Stats */}
        <View style={[commonStyles.card, { marginBottom: 24 }]}>
          <View style={commonStyles.row}>
            <View style={commonStyles.centerContent}>
              <Text style={[commonStyles.text, { fontWeight: '700', fontSize: 20, color: colors.error }]}>
                {favoriteCount}
              </Text>
              <Text style={commonStyles.textLight}>Favorites</Text>
            </View>
            <View style={commonStyles.centerContent}>
              <Text style={[commonStyles.text, { fontWeight: '700', fontSize: 20, color: colors.accent }]}>
                {inspirationItems.length}
              </Text>
              <Text style={commonStyles.textLight}>Total Ideas</Text>
            </View>
            <View style={commonStyles.centerContent}>
              <Text style={[commonStyles.text, { fontWeight: '700', fontSize: 20, color: colors.success }]}>
                {Object.keys(categoryStats).filter(cat => categoryStats[cat as keyof typeof categoryStats] > 0).length}
              </Text>
              <Text style={commonStyles.textLight}>Categories</Text>
            </View>
          </View>
        </View>

        {/* Category Filter */}
        <View style={[commonStyles.card, { marginBottom: 16 }]}>
          <Text style={[commonStyles.text, { fontWeight: '600', marginBottom: 12 }]}>
            Filter by Category
          </Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View style={{ flexDirection: 'row', gap: 8 }}>
              {(['all', 'favorites', 'dress', 'flowers', 'venue', 'decoration', 'cake', 'hairstyle', 'other'] as const).map((category) => (
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
                    {category === 'all' ? 'All' : category === 'favorites' ? '♥ Favorites' : category}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </ScrollView>
        </View>

        {/* Add Item Form */}
        {isAddingItem && (
          <View style={[commonStyles.card, { marginBottom: 16 }]}>
            <Text style={[commonStyles.text, { fontWeight: '600', marginBottom: 12 }]}>
              Add New Inspiration
            </Text>
            <TextInput
              style={[commonStyles.cardSmall, { marginBottom: 12 }]}
              placeholder="Title"
              placeholderTextColor={colors.textLight}
              value={newItemTitle}
              onChangeText={setNewItemTitle}
            />
            <TextInput
              style={[commonStyles.cardSmall, { marginBottom: 16 }]}
              placeholder="Description"
              placeholderTextColor={colors.textLight}
              value={newItemDescription}
              onChangeText={setNewItemDescription}
              multiline
              numberOfLines={3}
            />
            <View style={commonStyles.row}>
              <TouchableOpacity 
                style={[buttonStyles.outline, { flex: 1, marginRight: 8 }]}
                onPress={handleCancelAddItem}
              >
                <Text style={[commonStyles.text, { color: colors.accent, fontWeight: '600' }]}>
                  Cancel
                </Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[buttonStyles.primary, { flex: 1, marginLeft: 8 }]}
                onPress={handleSaveNewItem}
              >
                <Text style={[commonStyles.text, { fontWeight: '600' }]}>
                  Add Inspiration
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
              placeholder="Search inspiration..."
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

        {/* Inspiration Grid */}
        <ScrollView showsVerticalScrollIndicator={false}>
          {filteredItems.length > 0 ? (
            <View style={{
              flexDirection: 'row',
              flexWrap: 'wrap',
              justifyContent: 'space-between',
            }}>
              {filteredItems.map((item) => (
                <InspirationCard
                  key={item.id}
                  item={item}
                  onToggleFavorite={handleToggleFavorite}
                  onEdit={handleEditItem}
                  onDelete={handleDeleteItem}
                />
              ))}
            </View>
          ) : (
            <View style={[commonStyles.card, commonStyles.centerContent]}>
              <Ionicons name="camera-outline" size={48} color={colors.textLight} />
              <Text style={[commonStyles.text, { textAlign: 'center', marginTop: 16 }]}>
                {searchText || filterCategory !== 'all' ? 'No inspiration found' : 'No inspiration added yet'}
              </Text>
              <Text style={[commonStyles.textLight, { textAlign: 'center', marginTop: 8 }]}>
                {searchText || filterCategory !== 'all' ? 'Try adjusting your search or filter' : 'Tap the + button to add your first inspiration'}
              </Text>
            </View>
          )}
          <View style={{ height: 40 }} />
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}
