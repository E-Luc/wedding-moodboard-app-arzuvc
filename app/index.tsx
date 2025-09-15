
import React, { useState } from 'react';
import { Text, View, ScrollView, TouchableOpacity, Dimensions } from 'react-native';
import { commonStyles, colors, buttonStyles } from '../styles/commonStyles';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useFonts, Montserrat_400Regular, Montserrat_600SemiBold, Montserrat_700Bold } from '@expo-google-fonts/montserrat';
import { Lato_400Regular, Lato_700Bold } from '@expo-google-fonts/lato';
import { router } from 'expo-router';
import SimpleBottomSheet from '../components/BottomSheet';

const { width } = Dimensions.get('window');

interface FeatureCardProps {
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  description: string;
  color: string;
  onPress: () => void;
}

const FeatureCard: React.FC<FeatureCardProps> = ({ icon, title, description, color, onPress }) => {
  console.log('Rendering FeatureCard:', title);
  
  return (
    <TouchableOpacity style={[commonStyles.card, { width: (width - 60) / 2 }]} onPress={onPress}>
      <View style={[commonStyles.centerContent, { marginBottom: 12 }]}>
        <View style={{
          backgroundColor: color + '20',
          borderRadius: 24,
          padding: 12,
          marginBottom: 8,
        }}>
          <Ionicons name={icon} size={24} color={color} />
        </View>
        <Text style={[commonStyles.text, { fontWeight: '600', textAlign: 'center', marginBottom: 4 }]}>
          {title}
        </Text>
        <Text style={[commonStyles.textLight, { textAlign: 'center', fontSize: 12 }]}>
          {description}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

interface QuickActionProps {
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  subtitle: string;
  onPress: () => void;
}

const QuickAction: React.FC<QuickActionProps> = ({ icon, title, subtitle, onPress }) => {
  console.log('Rendering QuickAction:', title);
  
  return (
    <TouchableOpacity style={commonStyles.cardSmall} onPress={onPress}>
      <View style={commonStyles.row}>
        <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }}>
          <View style={{
            backgroundColor: colors.accent + '20',
            borderRadius: 20,
            padding: 8,
            marginRight: 12,
          }}>
            <Ionicons name={icon} size={20} color={colors.accent} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={[commonStyles.text, { fontWeight: '600', marginBottom: 2 }]}>
              {title}
            </Text>
            <Text style={commonStyles.textLight}>
              {subtitle}
            </Text>
          </View>
        </View>
        <Ionicons name="chevron-forward" size={20} color={colors.textLight} />
      </View>
    </TouchableOpacity>
  );
};

export default function MainScreen() {
  const [isBottomSheetVisible, setIsBottomSheetVisible] = useState(false);
  const [selectedAction, setSelectedAction] = useState<string>('');

  let [fontsLoaded] = useFonts({
    Montserrat_400Regular,
    Montserrat_600SemiBold,
    Montserrat_700Bold,
    Lato_400Regular,
    Lato_700Bold,
  });

  console.log('MainScreen rendered, fonts loaded:', fontsLoaded);

  if (!fontsLoaded) {
    return (
      <SafeAreaView style={commonStyles.container}>
        <View style={[commonStyles.container, commonStyles.centerContent]}>
          <Text style={commonStyles.text}>Loading fonts...</Text>
        </View>
      </SafeAreaView>
    );
  }

  const handleQuickAction = (action: string) => {
    console.log('Quick action pressed:', action);
    setSelectedAction(action);
    setIsBottomSheetVisible(true);
  };

  const handleFeaturePress = (feature: string) => {
    console.log('Feature pressed:', feature);
    switch (feature) {
      case 'Guest Management':
        console.log('Navigating to guests screen');
        router.push('/guests');
        break;
      case 'Timeline':
        console.log('Navigating to timeline screen');
        router.push('/timeline');
        break;
      case 'Budget Tracker':
        console.log('Navigating to budget screen');
        router.push('/budget');
        break;
      case 'Vendor Hub':
        console.log('Opening vendor hub bottom sheet');
        setSelectedAction('Vendor Hub');
        setIsBottomSheetVisible(true);
        break;
      default:
        console.log('Unknown feature:', feature);
    }
  };

  const handleCloseBottomSheet = () => {
    console.log('Closing bottom sheet');
    setIsBottomSheetVisible(false);
  };

  const handleGetStarted = () => {
    console.log('Get started button pressed for:', selectedAction);
    setIsBottomSheetVisible(false);
    
    // Navigate to appropriate screen based on selected action
    switch (selectedAction) {
      case 'Add New Guest':
        router.push('/guests');
        break;
      case 'Update Checklist':
        router.push('/timeline');
        break;
      case 'Inspiration Board':
        console.log('Inspiration board feature not yet implemented');
        break;
      case 'Contact Vendor':
        console.log('Contact vendor feature not yet implemented');
        break;
      case 'Vendor Hub':
        console.log('Vendor hub feature not yet implemented');
        break;
      default:
        console.log('No specific action for:', selectedAction);
    }
  };

  const features = [
    {
      icon: 'people' as keyof typeof Ionicons.glyphMap,
      title: 'Guest Management',
      description: 'Track RSVPs & seating',
      color: colors.accent,
    },
    {
      icon: 'calendar' as keyof typeof Ionicons.glyphMap,
      title: 'Timeline',
      description: 'Plan your perfect day',
      color: colors.gold,
    },
    {
      icon: 'card' as keyof typeof Ionicons.glyphMap,
      title: 'Budget Tracker',
      description: 'Stay within budget',
      color: colors.success,
    },
    {
      icon: 'business' as keyof typeof Ionicons.glyphMap,
      title: 'Vendor Hub',
      description: 'Manage all vendors',
      color: colors.warning,
    },
  ];

  const quickActions = [
    {
      icon: 'add-circle' as keyof typeof Ionicons.glyphMap,
      title: 'Add New Guest',
      subtitle: 'Invite someone to your wedding',
    },
    {
      icon: 'checkmark-circle' as keyof typeof Ionicons.glyphMap,
      title: 'Update Checklist',
      subtitle: 'Mark tasks as complete',
    },
    {
      icon: 'camera' as keyof typeof Ionicons.glyphMap,
      title: 'Inspiration Board',
      subtitle: 'Save ideas and photos',
    },
    {
      icon: 'call' as keyof typeof Ionicons.glyphMap,
      title: 'Contact Vendor',
      subtitle: 'Get in touch with suppliers',
    },
  ];

  return (
    <SafeAreaView style={commonStyles.container}>
      <ScrollView style={commonStyles.content} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={{ marginBottom: 32 }}>
          <Text style={commonStyles.title}>My Wedding Planist</Text>
          <Text style={commonStyles.subtitle}>Your dream wedding, perfectly planned</Text>
          
          <View style={commonStyles.row}>
            <TouchableOpacity 
              style={buttonStyles.primary}
              onPress={() => {
                console.log('Start Planning button pressed');
                router.push('/timeline');
              }}
            >
              <Text style={[commonStyles.text, { color: colors.text, fontWeight: '600' }]}>
                Start Planning
              </Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[buttonStyles.outline, { marginLeft: 12 }]}
              onPress={() => {
                console.log('View Timeline button pressed');
                router.push('/timeline');
              }}
            >
              <Text style={[commonStyles.text, { color: colors.accent, fontWeight: '600' }]}>
                View Timeline
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Wedding Progress */}
        <View style={commonStyles.section}>
          <Text style={commonStyles.sectionTitle}>Wedding Progress</Text>
          <View style={commonStyles.card}>
            <View style={commonStyles.row}>
              <View>
                <Text style={[commonStyles.text, { fontWeight: '600', marginBottom: 4 }]}>
                  Planning Progress
                </Text>
                <Text style={commonStyles.textLight}>
                  68% Complete
                </Text>
              </View>
              <View style={{
                width: 60,
                height: 60,
                borderRadius: 30,
                backgroundColor: colors.backgroundAlt,
                alignItems: 'center',
                justifyContent: 'center',
              }}>
                <Text style={[commonStyles.text, { fontWeight: '700', fontSize: 18 }]}>
                  68%
                </Text>
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
                backgroundColor: colors.accent,
                borderRadius: 4,
                width: '68%',
              }} />
            </View>
          </View>
        </View>

        {/* Key Features */}
        <View style={commonStyles.section}>
          <Text style={commonStyles.sectionTitle}>Key Features</Text>
          <View style={{
            flexDirection: 'row',
            flexWrap: 'wrap',
            justifyContent: 'space-between',
          }}>
            {features.map((feature, index) => (
              <FeatureCard
                key={index}
                icon={feature.icon}
                title={feature.title}
                description={feature.description}
                color={feature.color}
                onPress={() => handleFeaturePress(feature.title)}
              />
            ))}
          </View>
        </View>

        {/* Quick Actions */}
        <View style={commonStyles.section}>
          <Text style={commonStyles.sectionTitle}>Quick Actions</Text>
          {quickActions.map((action, index) => (
            <QuickAction
              key={index}
              icon={action.icon}
              title={action.title}
              subtitle={action.subtitle}
              onPress={() => handleQuickAction(action.title)}
            />
          ))}
        </View>

        {/* Wedding Stats */}
        <View style={[commonStyles.section, { marginBottom: 40 }]}>
          <Text style={commonStyles.sectionTitle}>Wedding Overview</Text>
          <View style={commonStyles.card}>
            <View style={commonStyles.row}>
              <TouchableOpacity 
                style={commonStyles.centerContent}
                onPress={() => {
                  console.log('Guests stat pressed');
                  router.push('/guests');
                }}
              >
                <Text style={[commonStyles.text, { fontWeight: '700', fontSize: 24, color: colors.accent }]}>
                  150
                </Text>
                <Text style={commonStyles.textLight}>
                  Guests Invited
                </Text>
              </TouchableOpacity>
              <View style={commonStyles.centerContent}>
                <Text style={[commonStyles.text, { fontWeight: '700', fontSize: 24, color: colors.gold }]}>
                  12
                </Text>
                <Text style={commonStyles.textLight}>
                  Vendors Booked
                </Text>
              </View>
              <TouchableOpacity 
                style={commonStyles.centerContent}
                onPress={() => {
                  console.log('Budget stat pressed');
                  router.push('/budget');
                }}
              >
                <Text style={[commonStyles.text, { fontWeight: '700', fontSize: 24, color: colors.success }]}>
                  85%
                </Text>
                <Text style={commonStyles.textLight}>
                  Budget Used
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </ScrollView>

      <SimpleBottomSheet
        isVisible={isBottomSheetVisible}
        onClose={handleCloseBottomSheet}
      >
        <View style={{ padding: 20 }}>
          <Text style={[commonStyles.sectionTitle, { textAlign: 'center', marginBottom: 16 }]}>
            {selectedAction}
          </Text>
          <Text style={[commonStyles.text, { textAlign: 'center', marginBottom: 24 }]}>
            This feature will help you manage your wedding planning tasks efficiently. 
            Stay organized and never miss an important detail for your special day.
          </Text>
          <TouchableOpacity 
            style={buttonStyles.primary}
            onPress={handleGetStarted}
          >
            <Text style={[commonStyles.text, { fontWeight: '600' }]}>
              Get Started
            </Text>
          </TouchableOpacity>
        </View>
      </SimpleBottomSheet>
    </SafeAreaView>
  );
}
