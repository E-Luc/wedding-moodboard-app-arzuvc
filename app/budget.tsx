
import React, { useState } from 'react';
import { Text, View, ScrollView, TouchableOpacity, Dimensions, Alert, TextInput } from 'react-native';
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

const BudgetCard: React.FC<{ item: BudgetItem; onEdit: (item: BudgetItem) => void; onAddExpense: (item: BudgetItem) => void }> = ({ item, onEdit, onAddExpense }) => {
  const percentage = (item.spent / item.budgeted) * 100;
  const isOverBudget = percentage > 100;
  const remaining = item.budgeted - item.spent;

  const handleCardPress = () => {
    console.log('Budget card pressed:', item.category);
    Alert.alert(
      item.category,
      `Budget: €${item.budgeted.toLocaleString()}\nSpent: €${item.spent.toLocaleString()}\nRemaining: €${remaining.toLocaleString()}`,
      [
        { text: 'Add Expense', onPress: () => onAddExpense(item) },
        { text: 'Edit Budget', onPress: () => onEdit(item) },
        { text: 'Cancel', style: 'cancel' }
      ]
    );
  };

  return (
    <TouchableOpacity style={commonStyles.card} onPress={handleCardPress}>
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
      
      {isOverBudget && (
        <Text style={[commonStyles.textLight, { 
          color: colors.error, 
          fontSize: 12, 
          marginTop: 4,
          textAlign: 'center'
        }]}>
          Over budget by €{Math.abs(remaining).toLocaleString()}
        </Text>
      )}
    </TouchableOpacity>
  );
};

export default function BudgetScreen() {
  const [budgetItems, setBudgetItems] = useState<BudgetItem[]>([
    { id: '1', category: 'Venue', budgeted: 8000, spent: 7500, icon: 'business', color: colors.accent },
    { id: '2', category: 'Catering', budgeted: 6000, spent: 5200, icon: 'restaurant', color: colors.gold },
    { id: '3', category: 'Photography', budgeted: 2500, spent: 2500, icon: 'camera', color: colors.success },
    { id: '4', category: 'Flowers', budgeted: 1500, spent: 800, icon: 'flower', color: '#E91E63' },
    { id: '5', category: 'Music/DJ', budgeted: 1200, spent: 1200, icon: 'musical-notes', color: '#9C27B0' },
    { id: '6', category: 'Dress & Attire', budgeted: 2000, spent: 1800, icon: 'shirt', color: '#FF5722' },
    { id: '7', category: 'Transportation', budgeted: 800, spent: 600, icon: 'car', color: '#607D8B' },
    { id: '8', category: 'Miscellaneous', budgeted: 1000, spent: 450, icon: 'ellipsis-horizontal', color: colors.textLight },
  ]);

  const [isAddingCategory, setIsAddingCategory] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [newCategoryBudget, setNewCategoryBudget] = useState('');

  const totalBudget = budgetItems.reduce((sum, item) => sum + item.budgeted, 0);
  const totalSpent = budgetItems.reduce((sum, item) => sum + item.spent, 0);
  const remainingBudget = totalBudget - totalSpent;
  const budgetPercentage = (totalSpent / totalBudget) * 100;

  console.log('BudgetScreen rendered with total budget:', totalBudget, 'spent:', totalSpent);

  const handleEditBudgetItem = (item: BudgetItem) => {
    console.log('Editing budget item:', item.category);
    Alert.alert(
      'Edit Budget Item',
      `What would you like to edit for ${item.category}?`,
      [
        { 
          text: 'Edit Budget Amount', 
          onPress: () => {
            Alert.prompt(
              'Edit Budget',
              `Enter new budget amount for ${item.category}:`,
              [
                { text: 'Cancel', style: 'cancel' },
                { 
                  text: 'Update',
                  onPress: (value) => {
                    const newBudget = parseFloat(value || '0');
                    if (newBudget > 0) {
                      setBudgetItems(prev => prev.map(budgetItem =>
                        budgetItem.id === item.id ? { ...budgetItem, budgeted: newBudget } : budgetItem
                      ));
                      console.log('Updated budget for', item.category, 'to', newBudget);
                    }
                  }
                }
              ],
              'plain-text',
              item.budgeted.toString()
            );
          }
        },
        { 
          text: 'Reset Spent Amount', 
          onPress: () => {
            Alert.alert(
              'Reset Spent Amount',
              `Are you sure you want to reset the spent amount for ${item.category} to €0?`,
              [
                { text: 'Cancel', style: 'cancel' },
                { 
                  text: 'Reset', 
                  style: 'destructive',
                  onPress: () => {
                    setBudgetItems(prev => prev.map(budgetItem =>
                      budgetItem.id === item.id ? { ...budgetItem, spent: 0 } : budgetItem
                    ));
                    console.log('Reset spent amount for', item.category);
                  }
                }
              ]
            );
          }
        },
        { text: 'Cancel', style: 'cancel' }
      ]
    );
  };

  const handleAddExpense = (item: BudgetItem) => {
    console.log('Adding expense to:', item.category);
    Alert.prompt(
      'Add Expense',
      `Enter expense amount for ${item.category}:`,
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Add',
          onPress: (value) => {
            const expenseAmount = parseFloat(value || '0');
            if (expenseAmount > 0) {
              setBudgetItems(prev => prev.map(budgetItem =>
                budgetItem.id === item.id ? { ...budgetItem, spent: budgetItem.spent + expenseAmount } : budgetItem
              ));
              console.log('Added expense of', expenseAmount, 'to', item.category);
            }
          }
        }
      ],
      'plain-text',
      '0'
    );
  };

  const handleAddCategory = () => {
    console.log('Adding new budget category');
    setIsAddingCategory(true);
  };

  const handleSaveNewCategory = () => {
    if (newCategoryName.trim() && newCategoryBudget.trim()) {
      const budget = parseFloat(newCategoryBudget);
      if (budget > 0) {
        const newCategory: BudgetItem = {
          id: Date.now().toString(),
          category: newCategoryName.trim(),
          budgeted: budget,
          spent: 0,
          icon: 'wallet',
          color: colors.accent
        };
        
        console.log('Saving new category:', newCategory);
        setBudgetItems(prev => [...prev, newCategory]);
        setNewCategoryName('');
        setNewCategoryBudget('');
        setIsAddingCategory(false);
      } else {
        Alert.alert('Error', 'Please enter a valid budget amount.');
      }
    } else {
      Alert.alert('Error', 'Please enter both category name and budget amount.');
    }
  };

  const handleCancelAddCategory = () => {
    console.log('Cancelling add category');
    setNewCategoryName('');
    setNewCategoryBudget('');
    setIsAddingCategory(false);
  };

  const overBudgetItems = budgetItems.filter(item => item.spent > item.budgeted);
  const isOverallOverBudget = totalSpent > totalBudget;

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
            Budget Tracker
          </Text>
          <TouchableOpacity onPress={handleAddCategory}>
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
                  borderColor: isOverallOverBudget ? colors.error : colors.accent,
                  borderTopColor: 'transparent',
                  borderRightColor: budgetPercentage > 25 ? (isOverallOverBudget ? colors.error : colors.accent) : 'transparent',
                  borderBottomColor: budgetPercentage > 50 ? (isOverallOverBudget ? colors.error : colors.accent) : 'transparent',
                  borderLeftColor: budgetPercentage > 75 ? (isOverallOverBudget ? colors.error : colors.accent) : 'transparent',
                  transform: [{ rotate: '-90deg' }],
                }} />
                <Text style={[commonStyles.text, { 
                  fontWeight: '700', 
                  fontSize: 16,
                  color: isOverallOverBudget ? colors.error : colors.text
                }]}>
                  {budgetPercentage.toFixed(0)}%
                </Text>
                <Text style={[commonStyles.textLight, { fontSize: 12 }]}>
                  Used
                </Text>
              </View>
            </View>

            <View style={commonStyles.row}>
              <View style={commonStyles.centerContent}>
                <Text style={[commonStyles.text, { 
                  fontWeight: '700', 
                  fontSize: 18, 
                  color: isOverallOverBudget ? colors.error : colors.error 
                }]}>
                  €{totalSpent.toLocaleString()}
                </Text>
                <Text style={commonStyles.textLight}>Spent</Text>
              </View>
              <View style={commonStyles.centerContent}>
                <Text style={[commonStyles.text, { 
                  fontWeight: '700', 
                  fontSize: 18, 
                  color: remainingBudget >= 0 ? colors.success : colors.error 
                }]}>
                  €{Math.abs(remainingBudget).toLocaleString()}
                </Text>
                <Text style={commonStyles.textLight}>
                  {remainingBudget >= 0 ? 'Remaining' : 'Over Budget'}
                </Text>
              </View>
              <View style={commonStyles.centerContent}>
                <Text style={[commonStyles.text, { fontWeight: '700', fontSize: 18 }]}>
                  €{totalBudget.toLocaleString()}
                </Text>
                <Text style={commonStyles.textLight}>Total</Text>
              </View>
            </View>

            {overBudgetItems.length > 0 && (
              <View style={{ 
                marginTop: 16, 
                padding: 12, 
                backgroundColor: colors.error + '20', 
                borderRadius: 8 
              }}>
                <Text style={[commonStyles.text, { 
                  color: colors.error, 
                  fontWeight: '600', 
                  textAlign: 'center' 
                }]}>
                  ⚠️ {overBudgetItems.length} categories over budget
                </Text>
              </View>
            )}
          </View>

          {/* Add Category Form */}
          {isAddingCategory && (
            <View style={[commonStyles.card, { marginBottom: 16 }]}>
              <Text style={[commonStyles.text, { fontWeight: '600', marginBottom: 12 }]}>
                Add New Category
              </Text>
              <TextInput
                style={[commonStyles.cardSmall, { marginBottom: 12 }]}
                placeholder="Category Name"
                placeholderTextColor={colors.textLight}
                value={newCategoryName}
                onChangeText={setNewCategoryName}
              />
              <TextInput
                style={[commonStyles.cardSmall, { marginBottom: 16 }]}
                placeholder="Budget Amount (€)"
                placeholderTextColor={colors.textLight}
                value={newCategoryBudget}
                onChangeText={setNewCategoryBudget}
                keyboardType="numeric"
              />
              <View style={commonStyles.row}>
                <TouchableOpacity 
                  style={[buttonStyles.outline, { flex: 1, marginRight: 8 }]}
                  onPress={handleCancelAddCategory}
                >
                  <Text style={[commonStyles.text, { color: colors.accent, fontWeight: '600' }]}>
                    Cancel
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity 
                  style={[buttonStyles.primary, { flex: 1, marginLeft: 8 }]}
                  onPress={handleSaveNewCategory}
                >
                  <Text style={[commonStyles.text, { fontWeight: '600' }]}>
                    Add Category
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          )}

          {/* Budget Categories */}
          <Text style={[commonStyles.sectionTitle, { marginBottom: 16 }]}>
            Budget Categories
          </Text>
          
          {budgetItems.map((item) => (
            <BudgetCard 
              key={item.id} 
              item={item} 
              onEdit={handleEditBudgetItem}
              onAddExpense={handleAddExpense}
            />
          ))}

          <View style={{ height: 40 }} />
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}
