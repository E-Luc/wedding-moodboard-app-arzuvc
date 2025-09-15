
import React, { useState } from 'react';
import { Text, View, ScrollView, TouchableOpacity } from 'react-native';
import { commonStyles, colors, buttonStyles } from '../styles/commonStyles';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';

interface TimelineItem {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  completed: boolean;
  category: 'planning' | 'booking' | 'preparation' | 'ceremony';
  icon: keyof typeof Ionicons.glyphMap;
}

const TimelineCard: React.FC<{ item: TimelineItem; onToggle: (id: string) => void }> = ({ item, onToggle }) => {
  const getCategoryColor = (category: TimelineItem['category']) => {
    switch (category) {
      case 'planning': return colors.accent;
      case 'booking': return colors.gold;
      case 'preparation': return colors.success;
      case 'ceremony': return '#E91E63';
      default: return colors.textLight;
    }
  };

  return (
    <View style={[commonStyles.cardSmall, { 
      opacity: item.completed ? 0.7 : 1,
      borderLeftWidth: 4,
      borderLeftColor: getCategoryColor(item.category),
    }]}>
      <View style={commonStyles.row}>
        <TouchableOpacity 
          onPress={() => onToggle(item.id)}
          style={{ marginRight: 12 }}
        >
          <Ionicons 
            name={item.completed ? 'checkmark-circle' : 'ellipse-outline'} 
            size={24} 
            color={item.completed ? colors.success : colors.textLight} 
          />
        </TouchableOpacity>
        
        <View style={{ flex: 1 }}>
          <View style={[commonStyles.row, { marginBottom: 4 }]}>
            <Text style={[commonStyles.text, { 
              fontWeight: '600', 
              textDecorationLine: item.completed ? 'line-through' : 'none',
              flex: 1,
            }]}>
              {item.title}
            </Text>
            <View style={{
              backgroundColor: getCategoryColor(item.category) + '20',
              borderRadius: 12,
              padding: 4,
            }}>
              <Ionicons name={item.icon} size={16} color={getCategoryColor(item.category)} />
            </View>
          </View>
          
          <Text style={[commonStyles.textLight, { marginBottom: 8 }]}>
            {item.description}
          </Text>
          
          <View style={commonStyles.row}>
            <Text style={[commonStyles.textLight, { fontSize: 12 }]}>
              {item.date} • {item.time}
            </Text>
            <Text style={[commonStyles.textLight, { 
              fontSize: 12, 
              color: getCategoryColor(item.category),
              fontWeight: '600',
            }]}>
              {item.category.toUpperCase()}
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
};

export default function TimelineScreen() {
  const [timelineItems, setTimelineItems] = useState<TimelineItem[]>([
    {
      id: '1',
      title: 'Book Wedding Venue',
      description: 'Confirm the ceremony and reception location',
      date: 'Jan 15, 2024',
      time: '10:00 AM',
      completed: true,
      category: 'booking',
      icon: 'business',
    },
    {
      id: '2',
      title: 'Send Save the Dates',
      description: 'Mail save the date cards to all guests',
      date: 'Feb 1, 2024',
      time: '2:00 PM',
      completed: true,
      category: 'planning',
      icon: 'mail',
    },
    {
      id: '3',
      title: 'Book Photographer',
      description: 'Hire professional wedding photographer',
      date: 'Feb 15, 2024',
      time: '11:00 AM',
      completed: false,
      category: 'booking',
      icon: 'camera',
    },
    {
      id: '4',
      title: 'Choose Wedding Dress',
      description: 'Final fitting and alterations',
      date: 'Mar 1, 2024',
      time: '3:00 PM',
      completed: false,
      category: 'preparation',
      icon: 'shirt',
    },
    {
      id: '5',
      title: 'Book Catering Service',
      description: 'Finalize menu and catering details',
      date: 'Mar 10, 2024',
      time: '1:00 PM',
      completed: false,
      category: 'booking',
      icon: 'restaurant',
    },
    {
      id: '6',
      title: 'Send Wedding Invitations',
      description: 'Mail formal invitations with RSVP cards',
      date: 'Apr 1, 2024',
      time: '10:00 AM',
      completed: false,
      category: 'planning',
      icon: 'mail-open',
    },
    {
      id: '7',
      title: 'Bachelor/Bachelorette Party',
      description: 'Celebrate with friends before the big day',
      date: 'May 15, 2024',
      time: '7:00 PM',
      completed: false,
      category: 'preparation',
      icon: 'wine',
    },
    {
      id: '8',
      title: 'Wedding Rehearsal',
      description: 'Practice ceremony with wedding party',
      date: 'Jun 20, 2024',
      time: '5:00 PM',
      completed: false,
      category: 'ceremony',
      icon: 'people',
    },
    {
      id: '9',
      title: 'Wedding Day!',
      description: 'The most important day of your life',
      date: 'Jun 21, 2024',
      time: '4:00 PM',
      completed: false,
      category: 'ceremony',
      icon: 'heart',
    },
  ]);

  const handleToggleComplete = (id: string) => {
    console.log('Toggling timeline item:', id);
    setTimelineItems(prev => prev.map(item =>
      item.id === id ? { ...item, completed: !item.completed } : item
    ));
  };

  const completedCount = timelineItems.filter(item => item.completed).length;
  const totalCount = timelineItems.length;
  const progressPercentage = (completedCount / totalCount) * 100;

  return (
    <SafeAreaView style={commonStyles.container}>
      <View style={commonStyles.content}>
        {/* Header */}
        <View style={[commonStyles.row, { marginBottom: 24 }]}>
          <TouchableOpacity onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={24} color={colors.text} />
          </TouchableOpacity>
          <Text style={[commonStyles.title, { fontSize: 24, marginBottom: 0 }]}>
            Wedding Timeline
          </Text>
          <TouchableOpacity>
            <Ionicons name="add" size={24} color={colors.accent} />
          </TouchableOpacity>
        </View>

        {/* Progress Overview */}
        <View style={[commonStyles.card, { marginBottom: 24 }]}>
          <Text style={[commonStyles.text, { fontWeight: '600', marginBottom: 16, textAlign: 'center' }]}>
            Planning Progress
          </Text>
          
          <View style={commonStyles.row}>
            <View style={commonStyles.centerContent}>
              <Text style={[commonStyles.text, { fontWeight: '700', fontSize: 24, color: colors.success }]}>
                {completedCount}
              </Text>
              <Text style={commonStyles.textLight}>Completed</Text>
            </View>
            <View style={commonStyles.centerContent}>
              <Text style={[commonStyles.text, { fontWeight: '700', fontSize: 24, color: colors.warning }]}>
                {totalCount - completedCount}
              </Text>
              <Text style={commonStyles.textLight}>Remaining</Text>
            </View>
            <View style={commonStyles.centerContent}>
              <Text style={[commonStyles.text, { fontWeight: '700', fontSize: 24, color: colors.accent }]}>
                {progressPercentage.toFixed(0)}%
              </Text>
              <Text style={commonStyles.textLight}>Progress</Text>
            </View>
          </View>

          <View style={{
            height: 8,
            backgroundColor: colors.backgroundAlt,
            borderRadius: 4,
            marginTop: 16,
          }}>
            <View style={{
              height: 8,
              backgroundColor: colors.success,
              borderRadius: 4,
              width: `${progressPercentage}%`,
            }} />
          </View>
        </View>

        {/* Timeline Items */}
        <ScrollView showsVerticalScrollIndicator={false}>
          <Text style={[commonStyles.sectionTitle, { marginBottom: 16 }]}>
            Timeline Tasks
          </Text>
          
          {timelineItems.map((item) => (
            <TimelineCard
              key={item.id}
              item={item}
              onToggle={handleToggleComplete}
            />
          ))}

          <View style={{ height: 40 }} />
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}
