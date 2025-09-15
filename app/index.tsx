
import React, { useState, useEffect } from 'react';
import { Text, View, ScrollView, TouchableOpacity, Dimensions, Image, ImageBackground } from 'react-native';
import { commonStyles, colors, buttonStyles } from '../styles/commonStyles';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useFonts, Montserrat_400Regular, Montserrat_600SemiBold, Montserrat_700Bold } from '@expo-google-fonts/montserrat';
import { Lato_400Regular, Lato_700Bold } from '@expo-google-fonts/lato';
import { router } from 'expo-router';
import SimpleBottomSheet from '../components/BottomSheet';
import { LinearGradient } from 'expo-linear-gradient';

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
  const [showWelcome, setShowWelcome] = useState(true);
  const [currentTime, setCurrentTime] = useState(new Date());

  let [fontsLoaded] = useFonts({
    Montserrat_400Regular,
    Montserrat_600SemiBold,
    Montserrat_700Bold,
    Lato_400Regular,
    Lato_700Bold,
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000); // Update every minute

    return () => clearInterval(timer);
  }, []);

  console.log('MainScreen rendered, fonts loaded:', fontsLoaded);

  if (!fontsLoaded) {
    return (
      <SafeAreaView style={commonStyles.container}>
        <LinearGradient
          colors={[colors.accent + '20', colors.background]}
          style={[commonStyles.container, commonStyles.centerContent]}
        >
          <View style={{
            backgroundColor: colors.accent + '20',
            borderRadius: 50,
            padding: 20,
            marginBottom: 20,
          }}>
            <Ionicons name="heart" size={40} color={colors.accent} />
          </View>
          <Text style={[commonStyles.text, { fontSize: 18 }]}>Loading My Wedding Planist...</Text>
        </LinearGradient>
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
        console.log('Navigating to vendor hub screen');
        router.push('/vendors');
        break;
      case 'Inspiration Board':
        console.log('Navigating to inspiration board screen');
        router.push('/inspiration');
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
        router.push('/inspiration');
        break;
      case 'Contact Vendor':
        router.push('/vendors');
        break;
      case 'Vendor Hub':
        router.push('/vendors');
        break;
      default:
        console.log('No specific action for:', selectedAction);
    }
  };

  const getGreeting = () => {
    const hour = currentTime.getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 17) return 'Good Afternoon';
    return 'Good Evening';
  };

  const getDaysUntilWedding = () => {
    const weddingDate = new Date('2024-06-21');
    const today = new Date();
    const diffTime = weddingDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? diffDays : 0;
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
    {
      icon: 'camera' as keyof typeof Ionicons.glyphMap,
      title: 'Inspiration Board',
      description: 'Save ideas & photos',
      color: '#E91E63',
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

  if (showWelcome) {
    return (
      <SafeAreaView style={commonStyles.container}>
        <LinearGradient
          colors={[colors.accent + '30', colors.background]}
          style={commonStyles.container}
        >
          <ScrollView style={commonStyles.content} showsVerticalScrollIndicator={false}>
            {/* Welcome Hero Section */}
            <View style={[commonStyles.centerContent, { marginTop: 60, marginBottom: 40 }]}>
              <View style={{
                backgroundColor: colors.accent + '20',
                borderRadius: 80,
                padding: 30,
                marginBottom: 30,
                boxShadow: '0px 8px 24px rgba(244, 194, 194, 0.4)',
                elevation: 8,
              }}>
                <Ionicons name="heart" size={60} color={colors.accent} />
              </View>
              
              <Text style={[commonStyles.title, { 
                fontSize: 36, 
                textAlign: 'center',
                marginBottom: 12,
                color: colors.text,
              }]}>
                My Wedding Planist
              </Text>
              
              <Text style={[commonStyles.subtitle, { 
                textAlign: 'center',
                fontSize: 20,
                marginBottom: 8,
              }]}>
                {getGreeting()}! ✨
              </Text>
              
              <Text style={[commonStyles.textLight, { 
                textAlign: 'center',
                fontSize: 16,
                marginBottom: 30,
              }]}>
                Your dream wedding, perfectly planned
              </Text>

              {/* Wedding Countdown */}
              <View style={[commonStyles.card, { 
                alignItems: 'center', 
                marginBottom: 30,
                backgroundColor: colors.accent + '10',
                borderColor: colors.accent + '30',
              }]}>
                <Text style={[commonStyles.text, { 
                  fontSize: 48, 
                  fontWeight: '700', 
                  color: colors.accent,
                  marginBottom: 8,
                }]}>
                  {getDaysUntilWedding()}
                </Text>
                <Text style={[commonStyles.text, { 
                  fontSize: 18, 
                  fontWeight: '600',
                  marginBottom: 4,
                }]}>
                  Days Until Your Wedding
                </Text>
                <Text style={[commonStyles.textLight, { textAlign: 'center' }]}>
                  June 21, 2024 • The most important day of your life
                </Text>
              </View>

              {/* Action Buttons */}
              <View style={{ width: '100%', gap: 16 }}>
                <TouchableOpacity 
                  style={[buttonStyles.primary, { 
                    paddingVertical: 16,
                    boxShadow: '0px 4px 16px rgba(244, 194, 194, 0.4)',
                    elevation: 6,
                  }]}
                  onPress={() => {
                    console.log('Start Planning button pressed');
                    setShowWelcome(false);
                  }}
                >
                  <Text style={[commonStyles.text, { 
                    color: colors.text, 
                    fontWeight: '700',
                    fontSize: 18,
                  }]}>
                    Start Planning Your Wedding
                  </Text>
                </TouchableOpacity>
                
                <TouchableOpacity 
                  style={[buttonStyles.outline, { 
                    paddingVertical: 16,
                    borderWidth: 2,
                  }]}
                  onPress={() => {
                    console.log('Continue Planning button pressed');
                    setShowWelcome(false);
                  }}
                >
                  <Text style={[commonStyles.text, { 
                    color: colors.accent, 
                    fontWeight: '600',
                    fontSize: 16,
                  }]}>
                    Continue Planning
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Quick Preview Cards */}
            <View style={{ marginBottom: 40 }}>
              <Text style={[commonStyles.sectionTitle, { 
                textAlign: 'center', 
                marginBottom: 24,
                fontSize: 20,
              }]}>
                Everything You Need
              </Text>
              
              <View style={{
                flexDirection: 'row',
                flexWrap: 'wrap',
                justifyContent: 'space-between',
                gap: 12,
              }}>
                {features.slice(0, 4).map((feature, index) => (
                  <View
                    key={index}
                    style={[commonStyles.card, { 
                      width: (width - 60) / 2,
                      alignItems: 'center',
                      paddingVertical: 20,
                    }]}
                  >
                    <View style={{
                      backgroundColor: feature.color + '20',
                      borderRadius: 20,
                      padding: 12,
                      marginBottom: 12,
                    }}>
                      <Ionicons name={feature.icon} size={24} color={feature.color} />
                    </View>
                    <Text style={[commonStyles.text, { 
                      fontWeight: '600', 
                      textAlign: 'center',
                      fontSize: 14,
                    }]}>
                      {feature.title}
                    </Text>
                  </View>
                ))}
              </View>
            </View>
          </ScrollView>
        </LinearGradient>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={commonStyles.container}>
      <ScrollView style={commonStyles.content} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={{ marginBottom: 32 }}>
          <View style={[commonStyles.row, { marginBottom: 16 }]}>
            <View>
              <Text style={[commonStyles.title, { fontSize: 28, marginBottom: 4 }]}>
                {getGreeting()}! 👋
              </Text>
              <Text style={commonStyles.subtitle}>Ready to plan your perfect day?</Text>
            </View>
            <View style={{ flexDirection: 'row', gap: 12 }}>
              <TouchableOpacity 
                onPress={() => {
                  console.log('Help button pressed');
                  router.push('/help');
                }}
                style={{
                  backgroundColor: colors.success + '20',
                  borderRadius: 20,
                  padding: 8,
                }}
              >
                <Ionicons name="help-circle" size={24} color={colors.success} />
              </TouchableOpacity>
              <TouchableOpacity 
                onPress={() => setShowWelcome(true)}
                style={{
                  backgroundColor: colors.accent + '20',
                  borderRadius: 20,
                  padding: 8,
                }}
              >
                <Ionicons name="heart" size={24} color={colors.accent} />
              </TouchableOpacity>
            </View>
          </View>
          
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
