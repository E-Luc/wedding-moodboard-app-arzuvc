
import React, { useState } from 'react';
import { Text, View, ScrollView, TouchableOpacity, Dimensions, Alert } from 'react-native';
import { commonStyles, colors, buttonStyles } from '../styles/commonStyles';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';

const { width } = Dimensions.get('window');

interface HelpSection {
  id: string;
  title: string;
  icon: keyof typeof Ionicons.glyphMap;
  color: string;
  content: string[];
}

const HelpCard: React.FC<{ 
  section: HelpSection; 
  isExpanded: boolean;
  onToggle: () => void;
}> = ({ section, isExpanded, onToggle }) => {
  return (
    <TouchableOpacity 
      style={[commonStyles.card, {
        borderLeftWidth: 4,
        borderLeftColor: section.color,
      }]}
      onPress={onToggle}
    >
      <View style={[commonStyles.row, { marginBottom: isExpanded ? 16 : 0 }]}>
        <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }}>
          <View style={{
            backgroundColor: section.color + '20',
            borderRadius: 20,
            padding: 12,
            marginRight: 16,
          }}>
            <Ionicons name={section.icon} size={24} color={section.color} />
          </View>
          <Text style={[commonStyles.text, { fontWeight: '600', flex: 1 }]}>
            {section.title}
          </Text>
        </View>
        <Ionicons 
          name={isExpanded ? 'chevron-up' : 'chevron-down'} 
          size={20} 
          color={colors.textLight} 
        />
      </View>
      
      {isExpanded && (
        <View style={{ paddingLeft: 56 }}>
          {section.content.map((item, index) => (
            <View key={index} style={{ flexDirection: 'row', marginBottom: 8 }}>
              <Text style={[commonStyles.textLight, { marginRight: 8 }]}>•</Text>
              <Text style={[commonStyles.textLight, { flex: 1, lineHeight: 20 }]}>
                {item}
              </Text>
            </View>
          ))}
        </View>
      )}
    </TouchableOpacity>
  );
};

export default function HelpScreen() {
  const [expandedSection, setExpandedSection] = useState<string | null>(null);

  const helpSections: HelpSection[] = [
    {
      id: 'getting-started',
      title: 'Getting Started',
      icon: 'rocket',
      color: colors.accent,
      content: [
        'Welcome to My Wedding Planist! This app helps you organize every aspect of your wedding.',
        'Start by exploring the main features: Guest Management, Timeline, Budget Tracker, Vendor Hub, and Inspiration Board.',
        'Each section allows you to add, edit, and manage different aspects of your wedding planning.',
        'Your data is automatically saved as you make changes.',
      ],
    },
    {
      id: 'guest-management',
      title: 'Managing Guests',
      icon: 'people',
      color: colors.success,
      content: [
        'Add guests by tapping the + button in the Guest Management section.',
        'Track RSVP status by tapping the status icon next to each guest.',
        'Toggle plus-one status when editing a guest.',
        'Use the search function to quickly find specific guests.',
        'Long-press on any guest to access edit and delete options.',
        'View statistics at the top to see confirmed, pending, and declined guests.',
      ],
    },
    {
      id: 'timeline-planning',
      title: 'Timeline & Tasks',
      icon: 'calendar',
      color: colors.gold,
      content: [
        'Create tasks for different phases of wedding planning.',
        'Mark tasks as complete by tapping the circle icon.',
        'Filter tasks by category: Planning, Booking, Preparation, or Ceremony.',
        'Long-press on tasks to edit or delete them.',
        'Track your overall progress with the progress bar.',
        'Add new tasks with the + button.',
      ],
    },
    {
      id: 'budget-tracking',
      title: 'Budget Management',
      icon: 'card',
      color: colors.warning,
      content: [
        'Monitor spending across different wedding categories.',
        'Tap on budget cards to add expenses or edit budget amounts.',
        'Visual progress bars show how much of each budget you\'ve used.',
        'Get warnings when you go over budget in any category.',
        'Add new budget categories with the + button.',
        'View total budget overview with spending breakdown.',
      ],
    },
    {
      id: 'vendor-hub',
      title: 'Vendor Management',
      icon: 'business',
      color: colors.error,
      content: [
        'Keep track of all your wedding vendors in one place.',
        'Store contact information, pricing, and notes for each vendor.',
        'Track vendor status: Pending, Contacted, Booked, or Declined.',
        'Rate vendors with a 5-star system.',
        'Contact vendors directly via phone, email, or website.',
        'Filter vendors by category or search by name.',
      ],
    },
    {
      id: 'inspiration-board',
      title: 'Inspiration Board',
      icon: 'camera',
      color: '#E91E63',
      content: [
        'Save wedding inspiration photos and ideas.',
        'Organize inspiration by categories like dress, flowers, venue, etc.',
        'Mark favorite inspirations with the heart icon.',
        'Add tags to make searching easier.',
        'Long-press on items to edit or delete them.',
        'Filter by category or favorites to find specific inspiration.',
      ],
    },
    {
      id: 'tips-tricks',
      title: 'Tips & Tricks',
      icon: 'bulb',
      color: '#9C27B0',
      content: [
        'Use long-press gestures throughout the app for quick actions.',
        'The search function works across names, descriptions, and tags.',
        'Status indicators use colors: Green (confirmed/booked), Orange (pending/contacted), Red (declined).',
        'Your data is automatically saved - no need to manually save changes.',
        'Use the back button or swipe gestures to navigate between screens.',
        'The welcome screen can be accessed anytime by tapping the heart icon on the main screen.',
      ],
    },
  ];

  const handleToggleSection = (sectionId: string) => {
    console.log('Toggling help section:', sectionId);
    setExpandedSection(expandedSection === sectionId ? null : sectionId);
  };

  console.log('HelpScreen rendered');

  return (
    <SafeAreaView style={commonStyles.container}>
      <LinearGradient
        colors={[colors.accent + '10', colors.background]}
        style={commonStyles.container}
      >
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
              Help & Guide
            </Text>
            <View style={{ width: 24 }} />
          </View>

          {/* Welcome Message */}
          <View style={[commonStyles.card, { 
            marginBottom: 24,
            backgroundColor: colors.accent + '10',
            borderColor: colors.accent + '30',
          }]}>
            <View style={[commonStyles.row, { marginBottom: 12 }]}>
              <View style={{
                backgroundColor: colors.accent + '20',
                borderRadius: 20,
                padding: 8,
                marginRight: 12,
              }}>
                <Ionicons name="heart" size={20} color={colors.accent} />
              </View>
              <Text style={[commonStyles.text, { fontWeight: '600', flex: 1 }]}>
                Welcome to My Wedding Planist!
              </Text>
            </View>
            <Text style={[commonStyles.textLight, { lineHeight: 20 }]}>
              This comprehensive guide will help you make the most of your wedding planning app. 
              Tap on any section below to learn more about specific features.
            </Text>
          </View>

          {/* User Flow Overview */}
          <View style={[commonStyles.card, { marginBottom: 24 }]}>
            <Text style={[commonStyles.text, { fontWeight: '600', marginBottom: 12 }]}>
              Typical User Flow
            </Text>
            <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}>
              <View style={{
                backgroundColor: colors.accent + '20',
                borderRadius: 12,
                padding: 6,
                marginRight: 8,
              }}>
                <Text style={[commonStyles.textLight, { fontSize: 12, fontWeight: '600' }]}>1</Text>
              </View>
              <Text style={[commonStyles.textLight, { flex: 1 }]}>
                Start with Timeline to plan major milestones
              </Text>
            </View>
            <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}>
              <View style={{
                backgroundColor: colors.accent + '20',
                borderRadius: 12,
                padding: 6,
                marginRight: 8,
              }}>
                <Text style={[commonStyles.textLight, { fontSize: 12, fontWeight: '600' }]}>2</Text>
              </View>
              <Text style={[commonStyles.textLight, { flex: 1 }]}>
                Set up Budget to track spending across categories
              </Text>
            </View>
            <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}>
              <View style={{
                backgroundColor: colors.accent + '20',
                borderRadius: 12,
                padding: 6,
                marginRight: 8,
              }}>
                <Text style={[commonStyles.textLight, { fontSize: 12, fontWeight: '600' }]}>3</Text>
              </View>
              <Text style={[commonStyles.textLight, { flex: 1 }]}>
                Add Vendors and track their booking status
              </Text>
            </View>
            <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}>
              <View style={{
                backgroundColor: colors.accent + '20',
                borderRadius: 12,
                padding: 6,
                marginRight: 8,
              }}>
                <Text style={[commonStyles.textLight, { fontSize: 12, fontWeight: '600' }]}>4</Text>
              </View>
              <Text style={[commonStyles.textLight, { flex: 1 }]}>
                Build Guest List and manage RSVPs
              </Text>
            </View>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <View style={{
                backgroundColor: colors.accent + '20',
                borderRadius: 12,
                padding: 6,
                marginRight: 8,
              }}>
                <Text style={[commonStyles.textLight, { fontSize: 12, fontWeight: '600' }]}>5</Text>
              </View>
              <Text style={[commonStyles.textLight, { flex: 1 }]}>
                Collect Inspiration for styling and decoration
              </Text>
            </View>
          </View>

          {/* Help Sections */}
          <ScrollView showsVerticalScrollIndicator={false}>
            <Text style={[commonStyles.sectionTitle, { marginBottom: 16 }]}>
              Detailed Guides
            </Text>
            
            {helpSections.map((section) => (
              <HelpCard
                key={section.id}
                section={section}
                isExpanded={expandedSection === section.id}
                onToggle={() => handleToggleSection(section.id)}
              />
            ))}

            {/* Contact Support */}
            <View style={[commonStyles.card, { 
              marginTop: 24,
              backgroundColor: colors.success + '10',
              borderColor: colors.success + '30',
            }]}>
              <View style={[commonStyles.row, { marginBottom: 12 }]}>
                <View style={{
                  backgroundColor: colors.success + '20',
                  borderRadius: 20,
                  padding: 8,
                  marginRight: 12,
                }}>
                  <Ionicons name="help-circle" size={20} color={colors.success} />
                </View>
                <Text style={[commonStyles.text, { fontWeight: '600', flex: 1 }]}>
                  Need More Help?
                </Text>
              </View>
              <Text style={[commonStyles.textLight, { lineHeight: 20, marginBottom: 16 }]}>
                If you have questions not covered in this guide, or if you encounter any issues, 
                we&apos;re here to help make your wedding planning as smooth as possible.
              </Text>
              <TouchableOpacity 
                style={[buttonStyles.primary, { backgroundColor: colors.success }]}
                onPress={() => {
                  console.log('Contact support pressed');
                  Alert.alert(
                    'Contact Support',
                    'Support features will be available in future updates. For now, all essential wedding planning features are available in the app.',
                    [{ text: 'OK' }]
                  );
                }}
              >
                <Text style={[commonStyles.text, { fontWeight: '600' }]}>
                  Contact Support
                </Text>
              </TouchableOpacity>
            </View>

            <View style={{ height: 40 }} />
          </ScrollView>
        </View>
      </LinearGradient>
    </SafeAreaView>
  );
}
