
import React, { useState } from 'react';
import { Text, View, ScrollView, TouchableOpacity, Alert, TextInput } from 'react-native';
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

const TimelineCard: React.FC<{ 
  item: TimelineItem; 
  onToggle: (id: string) => void; 
  onEdit: (item: TimelineItem) => void;
  onDelete: (id: string) => void;
}> = ({ item, onToggle, onEdit, onDelete }) => {
  const getCategoryColor = (category: TimelineItem['category']) => {
    switch (category) {
      case 'planning': return colors.accent;
      case 'booking': return colors.gold;
      case 'preparation': return colors.success;
      case 'ceremony': return '#E91E63';
      default: return colors.textLight;
    }
  };

  const handleLongPress = () => {
    console.log('Long press on timeline item:', item.title);
    Alert.alert(
      'Task Options',
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
      style={[commonStyles.cardSmall, { 
        opacity: item.completed ? 0.7 : 1,
        borderLeftWidth: 4,
        borderLeftColor: getCategoryColor(item.category),
      }]}
      onLongPress={handleLongPress}
      delayLongPress={500}
    >
      <View style={commonStyles.row}>
        <TouchableOpacity 
          onPress={() => {
            console.log('Toggling completion for:', item.title);
            onToggle(item.id);
          }}
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
    </TouchableOpacity>
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

  const [isAddingTask, setIsAddingTask] = useState(false);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskDescription, setNewTaskDescription] = useState('');
  const [filterCategory, setFilterCategory] = useState<TimelineItem['category'] | 'all'>('all');

  const handleToggleComplete = (id: string) => {
    console.log('Toggling timeline item:', id);
    setTimelineItems(prev => prev.map(item =>
      item.id === id ? { ...item, completed: !item.completed } : item
    ));
  };

  const handleEditTask = (task: TimelineItem) => {
    console.log('Editing task:', task.title);
    Alert.alert(
      'Edit Task',
      `What would you like to edit for "${task.title}"?`,
      [
        { 
          text: 'Edit Title', 
          onPress: () => {
            Alert.prompt(
              'Edit Title',
              'Enter new title:',
              [
                { text: 'Cancel', style: 'cancel' },
                { 
                  text: 'Update',
                  onPress: (newTitle) => {
                    if (newTitle && newTitle.trim()) {
                      setTimelineItems(prev => prev.map(item =>
                        item.id === task.id ? { ...item, title: newTitle.trim() } : item
                      ));
                      console.log('Updated title for task:', task.id, 'to:', newTitle);
                    }
                  }
                }
              ],
              'plain-text',
              task.title
            );
          }
        },
        { 
          text: 'Edit Description', 
          onPress: () => {
            Alert.prompt(
              'Edit Description',
              'Enter new description:',
              [
                { text: 'Cancel', style: 'cancel' },
                { 
                  text: 'Update',
                  onPress: (newDescription) => {
                    if (newDescription && newDescription.trim()) {
                      setTimelineItems(prev => prev.map(item =>
                        item.id === task.id ? { ...item, description: newDescription.trim() } : item
                      ));
                      console.log('Updated description for task:', task.id, 'to:', newDescription);
                    }
                  }
                }
              ],
              'plain-text',
              task.description
            );
          }
        },
        { 
          text: 'Change Category', 
          onPress: () => {
            Alert.alert(
              'Change Category',
              'Select new category:',
              [
                { text: 'Planning', onPress: () => updateTaskCategory(task.id, 'planning') },
                { text: 'Booking', onPress: () => updateTaskCategory(task.id, 'booking') },
                { text: 'Preparation', onPress: () => updateTaskCategory(task.id, 'preparation') },
                { text: 'Ceremony', onPress: () => updateTaskCategory(task.id, 'ceremony') },
                { text: 'Cancel', style: 'cancel' }
              ]
            );
          }
        },
        { text: 'Cancel', style: 'cancel' }
      ]
    );
  };

  const updateTaskCategory = (id: string, category: TimelineItem['category']) => {
    setTimelineItems(prev => prev.map(item =>
      item.id === id ? { ...item, category } : item
    ));
    console.log('Updated category for task:', id, 'to:', category);
  };

  const handleDeleteTask = (id: string) => {
    console.log('Deleting task:', id);
    const taskToDelete = timelineItems.find(t => t.id === id);
    if (taskToDelete) {
      Alert.alert(
        'Delete Task',
        `Are you sure you want to remove "${taskToDelete.title}" from your timeline?`,
        [
          { text: 'Cancel', style: 'cancel' },
          { 
            text: 'Delete', 
            style: 'destructive',
            onPress: () => {
              setTimelineItems(prev => prev.filter(item => item.id !== id));
              console.log('Task deleted:', taskToDelete.title);
            }
          }
        ]
      );
    }
  };

  const handleAddTask = () => {
    console.log('Adding new task');
    setIsAddingTask(true);
  };

  const handleSaveNewTask = () => {
    if (newTaskTitle.trim() && newTaskDescription.trim()) {
      const newTask: TimelineItem = {
        id: Date.now().toString(),
        title: newTaskTitle.trim(),
        description: newTaskDescription.trim(),
        date: 'TBD',
        time: 'TBD',
        completed: false,
        category: 'planning',
        icon: 'checkmark-circle'
      };
      
      console.log('Saving new task:', newTask);
      setTimelineItems(prev => [...prev, newTask]);
      setNewTaskTitle('');
      setNewTaskDescription('');
      setIsAddingTask(false);
    } else {
      Alert.alert('Error', 'Please enter both title and description for the task.');
    }
  };

  const handleCancelAddTask = () => {
    console.log('Cancelling add task');
    setNewTaskTitle('');
    setNewTaskDescription('');
    setIsAddingTask(false);
  };

  const filteredItems = filterCategory === 'all' 
    ? timelineItems 
    : timelineItems.filter(item => item.category === filterCategory);

  const completedCount = timelineItems.filter(item => item.completed).length;
  const totalCount = timelineItems.length;
  const progressPercentage = totalCount > 0 ? (completedCount / totalCount) * 100 : 0;

  const categoryStats = {
    planning: timelineItems.filter(item => item.category === 'planning').length,
    booking: timelineItems.filter(item => item.category === 'booking').length,
    preparation: timelineItems.filter(item => item.category === 'preparation').length,
    ceremony: timelineItems.filter(item => item.category === 'ceremony').length,
  };

  console.log('TimelineScreen rendered with', totalCount, 'tasks,', completedCount, 'completed');

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
            Wedding Timeline
          </Text>
          <TouchableOpacity onPress={handleAddTask}>
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

        {/* Category Filter */}
        <View style={[commonStyles.card, { marginBottom: 16 }]}>
          <Text style={[commonStyles.text, { fontWeight: '600', marginBottom: 12 }]}>
            Filter by Category
          </Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View style={{ flexDirection: 'row', gap: 8 }}>
              {(['all', 'planning', 'booking', 'preparation', 'ceremony'] as const).map((category) => (
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
                      fontSize: 14
                    }
                  ]}>
                    {category === 'all' ? 'All' : category.charAt(0).toUpperCase() + category.slice(1)}
                    {category !== 'all' && ` (${categoryStats[category]})`}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </ScrollView>
        </View>

        {/* Add Task Form */}
        {isAddingTask && (
          <View style={[commonStyles.card, { marginBottom: 16 }]}>
            <Text style={[commonStyles.text, { fontWeight: '600', marginBottom: 12 }]}>
              Add New Task
            </Text>
            <TextInput
              style={[commonStyles.cardSmall, { marginBottom: 12 }]}
              placeholder="Task Title"
              placeholderTextColor={colors.textLight}
              value={newTaskTitle}
              onChangeText={setNewTaskTitle}
            />
            <TextInput
              style={[commonStyles.cardSmall, { marginBottom: 16 }]}
              placeholder="Task Description"
              placeholderTextColor={colors.textLight}
              value={newTaskDescription}
              onChangeText={setNewTaskDescription}
              multiline
              numberOfLines={3}
            />
            <View style={commonStyles.row}>
              <TouchableOpacity 
                style={[buttonStyles.outline, { flex: 1, marginRight: 8 }]}
                onPress={handleCancelAddTask}
              >
                <Text style={[commonStyles.text, { color: colors.accent, fontWeight: '600' }]}>
                  Cancel
                </Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[buttonStyles.primary, { flex: 1, marginLeft: 8 }]}
                onPress={handleSaveNewTask}
              >
                <Text style={[commonStyles.text, { fontWeight: '600' }]}>
                  Add Task
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        {/* Timeline Items */}
        <ScrollView showsVerticalScrollIndicator={false}>
          <Text style={[commonStyles.sectionTitle, { marginBottom: 16 }]}>
            Timeline Tasks {filterCategory !== 'all' && `(${filterCategory})`}
          </Text>
          
          {filteredItems.length > 0 ? (
            filteredItems.map((item) => (
              <TimelineCard
                key={item.id}
                item={item}
                onToggle={handleToggleComplete}
                onEdit={handleEditTask}
                onDelete={handleDeleteTask}
              />
            ))
          ) : (
            <View style={[commonStyles.card, commonStyles.centerContent]}>
              <Ionicons name="calendar-outline" size={48} color={colors.textLight} />
              <Text style={[commonStyles.text, { textAlign: 'center', marginTop: 16 }]}>
                {filterCategory === 'all' ? 'No tasks added yet' : `No ${filterCategory} tasks found`}
              </Text>
              <Text style={[commonStyles.textLight, { textAlign: 'center', marginTop: 8 }]}>
                {filterCategory === 'all' ? 'Tap the + button to add your first task' : 'Try a different category filter'}
              </Text>
            </View>
          )}

          <View style={{ height: 40 }} />
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}
