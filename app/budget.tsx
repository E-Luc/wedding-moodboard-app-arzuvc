
import React, { useState } from 'react';
import { Text, View, ScrollView, TouchableOpacity, Dimensions } from 'react-native';
import { commonStyles, colors, buttonStyles } from '../styles/commonStyles';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';

const { width } = Dimensions.get('window');

interface BudgetItem {
  id: string;
  category: string;
  budgeted: number;
  spent: number;
  icon: keyof typeof Ionicons.glyphMap;
  color: string;
}

const BudgetCard: React.FC<{ item: BudgetItem }> = ({ item }) => {
  const percentage = (item.spent / item.budgeted) * 100;
  const isOverBudget = percentage > 100;

  return (
    <View style={commonStyles.card}>
      <View style={[commonStyles.row, { marginBottom: 12 }]}>
        <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }}>
          <View style={{
            backgroundColor: item.color + '20',
            borderRadius: 20,
            padding: 8,
            marginRight: 12,
          }}>
            <Ionicons name={item.icon} size={20} color={item.color} />
          </View>
          <Text style={[commonStyles.text, { fontWeight: '600' }]}>
            {item.category}
          </Text>
        </View>
        <Text style={[commonStyles.text, { 
          fontWeight: '700', 
          color: isOverBudget ? colors.error : colors.text 
        }]}>
          €{item.spent.toLocaleString()}
        </Text>
      </View>
      
      <View style={{
        height: 6,
        backgroundColor: colors.backgroundAlt,
        borderRadius: 3,
        marginBottom: 8,
      }}>
        <View style={{
          height: 6,
          backgroundColor: isOverBudget ? colors.error : item.color,
          borderRadius: 3,
          width: `${Math.min(percentage, 100)}%`,
        }} />
      </View>
      
      <View style={commonStyles.row}>
        <Text style={commonStyles.textLight}>
          Budget: €{item.budgeted.toLocaleString()}
        </Text>
        <Text style={[commonStyles.textLight, { 
          color: isOverBudget ? colors.error : colors.textLight 
        }]}>
          {percentage.toFixed(0)}% used
        </Text>
      </View>
    </View>
  );
};

export default function BudgetScreen() {
  const [budgetItems] = useState<BudgetItem[]>([
    { id: '1', category: 'Venue', budgeted: 8000, spent: 7500, icon: 'business', color: colors.accent },
    { id: '2', category: 'Catering', budgeted: 6000, spent: 5200, icon: 'restaurant', color: colors.gold },
    { id: '3', category: 'Photography', budgeted: 2500, spent: 2500, icon: 'camera', color: colors.success },
    { id: '4', category: 'Flowers', budgeted: 1500, spent: 800, icon: 'flower', color: '#E91E63' },
    { id: '5', category: 'Music/DJ', budgeted: 1200, spent: 1200, icon: 'musical-notes', color: '#9C27B0' },
    { id: '6', category: 'Dress & Attire', budgeted: 2000, spent: 1800, icon: 'shirt', color: '#FF5722' },
    { id: '7', category: 'Transportation', budgeted: 800, spent: 600, icon: 'car', color: '#607D8B' },
    { id: '8', category: 'Miscellaneous', budgeted: 1000, spent: 450, icon: 'ellipsis-horizontal', color: colors.textLight },
  ]);

  const totalBudget = budgetItems.reduce((sum, item) => sum + item.budgeted, 0);
  const totalSpent = budgetItems.reduce((sum, item) => sum + item.spent, 0);
  const remainingBudget = totalBudget - totalSpent;
  const budgetPercentage = (totalSpent / totalBudget) * 100;

  return (
    <SafeAreaView style={commonStyles.container}>
      <View style={commonStyles.content}>
        {/* Header */}
        <View style={[commonStyles.row, { marginBottom: 24 }]}>
          <TouchableOpacity onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={24} color={colors.text} />
          </TouchableOpacity>
          <Text style={[commonStyles.title, { fontSize: 24, marginBottom: 0 }]}>
            Budget Tracker
          </Text>
          <TouchableOpacity>
            <Ionicons name="add" size={24} color={colors.accent} />
          </TouchableOpacity>
        </View>

        <ScrollView showsVerticalScrollIndicator={false}>
          {/* Budget Overview */}
          <View style={[commonStyles.card, { marginBottom: 24 }]}>
            <Text style={[commonStyles.text, { fontWeight: '600', marginBottom: 16, textAlign: 'center' }]}>
              Total Budget Overview
            </Text>
            
            <View style={commonStyles.centerContent}>
              <View style={{
                width: 120,
                height: 120,
                borderRadius: 60,
                backgroundColor: colors.backgroundAlt,
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: 16,
                position: 'relative',
              }}>
                <View style={{
                  position: 'absolute',
                  width: 120,
                  height: 120,
                  borderRadius: 60,
                  borderWidth: 8,
                  borderColor: colors.accent,
                  borderTopColor: 'transparent',
                  borderRightColor: budgetPercentage > 25 ? colors.accent : 'transparent',
                  borderBottomColor: budgetPercentage > 50 ? colors.accent : 'transparent',
                  borderLeftColor: budgetPercentage > 75 ? colors.accent : 'transparent',
                  transform: [{ rotate: '-90deg' }],
                }} />
                <Text style={[commonStyles.text, { fontWeight: '700', fontSize: 16 }]}>
                  {budgetPercentage.toFixed(0)}%
                </Text>
                <Text style={[commonStyles.textLight, { fontSize: 12 }]}>
                  Used
                </Text>
              </View>
            </View>

            <View style={commonStyles.row}>
              <View style={commonStyles.centerContent}>
                <Text style={[commonStyles.text, { fontWeight: '700', fontSize: 18, color: colors.error }]}>
                  €{totalSpent.toLocaleString()}
                </Text>
                <Text style={commonStyles.textLight}>Spent</Text>
              </View>
              <View style={commonStyles.centerContent}>
                <Text style={[commonStyles.text, { fontWeight: '700', fontSize: 18, color: colors.success }]}>
                  €{remainingBudget.toLocaleString()}
                </Text>
                <Text style={commonStyles.textLight}>Remaining</Text>
              </View>
              <View style={commonStyles.centerContent}>
                <Text style={[commonStyles.text, { fontWeight: '700', fontSize: 18 }]}>
                  €{totalBudget.toLocaleString()}
                </Text>
                <Text style={commonStyles.textLight}>Total</Text>
              </View>
            </View>
          </View>

          {/* Budget Categories */}
          <Text style={[commonStyles.sectionTitle, { marginBottom: 16 }]}>
            Budget Categories
          </Text>
          
          {budgetItems.map((item) => (
            <BudgetCard key={item.id} item={item} />
          ))}

          <View style={{ height: 40 }} />
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}
