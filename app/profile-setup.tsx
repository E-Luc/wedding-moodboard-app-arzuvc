
import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  ScrollView, 
  Alert,
  Platform
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { router } from 'expo-router';
import DateTimePicker from '@react-native-community/datetimepicker';
import { commonStyles, colors, buttonStyles } from '../styles/commonStyles';
import { useAuth } from '../hooks/useAuth';
import { ProfileSetupStep } from '../types/User';
import OptionsMenu from '../components/OptionsMenu';

const ProfileSetupScreen = () => {
  const { t } = useTranslation();
  const { user, updateProfile } = useAuth();
  const [currentStep, setCurrentStep] = useState(0);
  const [showOptionsMenu, setShowOptionsMenu] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState<'birth' | 'wedding' | null>(null);
  
  const [profileData, setProfileData] = useState({
    dateOfBirth: '',
    weddingDate: '',
    partnerName: '',
    budget: '',
    venue: '',
    guestCount: '',
    weddingStyle: '',
    phone: '',
    address: ''
  });

  const [errors, setErrors] = useState<{[key: string]: string}>({});

  const setupSteps: ProfileSetupStep[] = [
    {
      id: 'personal',
      title: t('personalInfo'),
      description: t('infoUtility.personalInfo'),
      fields: ['dateOfBirth', 'phone'],
      required: true,
      completed: false
    },
    {
      id: 'wedding',
      title: t('weddingDetails'),
      description: t('infoUtility.weddingDetails'),
      fields: ['weddingDate', 'partnerName', 'budget', 'venue'],
      required: true,
      completed: false
    },
    {
      id: 'preferences',
      title: t('preferences'),
      description: t('infoUtility.preferences'),
      fields: ['guestCount', 'weddingStyle', 'address'],
      required: false,
      completed: false
    }
  ];

  useEffect(() => {
    if (user) {
      setProfileData({
        dateOfBirth: user.dateOfBirth || '',
        weddingDate: user.weddingDate || '',
        partnerName: user.partnerName || '',
        budget: user.budget?.toString() || '',
        venue: user.venue || '',
        guestCount: user.guestCount?.toString() || '',
        weddingStyle: user.weddingStyle || '',
        phone: user.phone || '',
        address: user.address || ''
      });
    }
  }, [user]);

  const validateCurrentStep = () => {
    const currentStepData = setupSteps[currentStep];
    const newErrors: {[key: string]: string} = {};

    if (currentStepData.required) {
      currentStepData.fields.forEach(field => {
        if (!profileData[field as keyof typeof profileData]) {
          newErrors[field] = t('requiredField');
        }
      });
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (!validateCurrentStep()) return;

    if (currentStep < setupSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      handleFinish();
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleFinish = async () => {
    console.log('Finishing profile setup');
    
    const updates = {
      ...profileData,
      budget: profileData.budget ? parseFloat(profileData.budget) : undefined,
      guestCount: profileData.guestCount ? parseInt(profileData.guestCount) : undefined,
      profileComplete: true
    };

    const result = await updateProfile(updates);
    
    if (result.success) {
      Alert.alert('Success', t('profileSaved'), [
        { text: 'OK', onPress: () => router.replace('/') }
      ]);
    } else {
      Alert.alert('Error', result.error || 'Failed to save profile');
    }
  };

  const updateProfileData = (field: string, value: string) => {
    setProfileData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleDateChange = (event: any, selectedDate?: Date) => {
    if (Platform.OS === 'android') {
      setShowDatePicker(null);
    }
    
    if (selectedDate) {
      const dateString = selectedDate.toISOString().split('T')[0];
      if (showDatePicker === 'birth') {
        updateProfileData('dateOfBirth', dateString);
      } else if (showDatePicker === 'wedding') {
        updateProfileData('weddingDate', dateString);
      }
    }
    
    if (Platform.OS === 'ios') {
      // Keep picker open on iOS
    }
  };

  const renderDatePicker = () => {
    if (!showDatePicker) return null;

    const currentDate = showDatePicker === 'birth' 
      ? (profileData.dateOfBirth ? new Date(profileData.dateOfBirth) : new Date(1990, 0, 1))
      : (profileData.weddingDate ? new Date(profileData.weddingDate) : new Date());

    return (
      <DateTimePicker
        value={currentDate}
        mode="date"
        display={Platform.OS === 'ios' ? 'spinner' : 'default'}
        onChange={handleDateChange}
        maximumDate={showDatePicker === 'birth' ? new Date() : undefined}
        minimumDate={showDatePicker === 'wedding' ? new Date() : undefined}
      />
    );
  };

  const renderStepContent = () => {
    const step = setupSteps[currentStep];
    
    return (
      <View>
        <Text style={[commonStyles.sectionTitle, { textAlign: 'center', marginBottom: 8 }]}>
          {step.title}
        </Text>
        <Text style={[commonStyles.textLight, { 
          textAlign: 'center', 
          marginBottom: 32,
          lineHeight: 22 
        }]}>
          {step.description}
        </Text>

        {step.fields.includes('dateOfBirth') && (
          <View style={{ marginBottom: 20 }}>
            <Text style={styles.label}>{t('dateOfBirth')}</Text>
            <TouchableOpacity
              style={[styles.input, errors.dateOfBirth && styles.inputError]}
              onPress={() => setShowDatePicker('birth')}
            >
              <Text style={{ 
                color: profileData.dateOfBirth ? colors.text : colors.textLight 
              }}>
                {profileData.dateOfBirth || t('dateOfBirth')}
              </Text>
              <Ionicons name="calendar" size={20} color={colors.textLight} />
            </TouchableOpacity>
            {errors.dateOfBirth && (
              <Text style={styles.errorText}>{errors.dateOfBirth}</Text>
            )}
          </View>
        )}

        {step.fields.includes('phone') && (
          <View style={{ marginBottom: 20 }}>
            <Text style={styles.label}>Phone</Text>
            <TextInput
              style={[styles.input, errors.phone && styles.inputError]}
              value={profileData.phone}
              onChangeText={(value) => updateProfileData('phone', value)}
              placeholder="Phone number"
              keyboardType="phone-pad"
            />
            {errors.phone && (
              <Text style={styles.errorText}>{errors.phone}</Text>
            )}
          </View>
        )}

        {step.fields.includes('weddingDate') && (
          <View style={{ marginBottom: 20 }}>
            <Text style={styles.label}>{t('weddingDate')}</Text>
            <TouchableOpacity
              style={[styles.input, errors.weddingDate && styles.inputError]}
              onPress={() => setShowDatePicker('wedding')}
            >
              <Text style={{ 
                color: profileData.weddingDate ? colors.text : colors.textLight 
              }}>
                {profileData.weddingDate || t('weddingDate')}
              </Text>
              <Ionicons name="calendar" size={20} color={colors.textLight} />
            </TouchableOpacity>
            {errors.weddingDate && (
              <Text style={styles.errorText}>{errors.weddingDate}</Text>
            )}
          </View>
        )}

        {step.fields.includes('partnerName') && (
          <View style={{ marginBottom: 20 }}>
            <Text style={styles.label}>Partner&apos;s Name</Text>
            <TextInput
              style={[styles.input, errors.partnerName && styles.inputError]}
              value={profileData.partnerName}
              onChangeText={(value) => updateProfileData('partnerName', value)}
              placeholder="Partner's name"
              autoCapitalize="words"
            />
            {errors.partnerName && (
              <Text style={styles.errorText}>{errors.partnerName}</Text>
            )}
          </View>
        )}

        {step.fields.includes('budget') && (
          <View style={{ marginBottom: 20 }}>
            <Text style={styles.label}>{t('budget')}</Text>
            <TextInput
              style={[styles.input, errors.budget && styles.inputError]}
              value={profileData.budget}
              onChangeText={(value) => updateProfileData('budget', value)}
              placeholder="Wedding budget"
              keyboardType="numeric"
            />
            {errors.budget && (
              <Text style={styles.errorText}>{errors.budget}</Text>
            )}
          </View>
        )}

        {step.fields.includes('venue') && (
          <View style={{ marginBottom: 20 }}>
            <Text style={styles.label}>{t('venue')}</Text>
            <TextInput
              style={[styles.input, errors.venue && styles.inputError]}
              value={profileData.venue}
              onChangeText={(value) => updateProfileData('venue', value)}
              placeholder="Wedding venue"
              autoCapitalize="words"
            />
            {errors.venue && (
              <Text style={styles.errorText}>{errors.venue}</Text>
            )}
          </View>
        )}

        {step.fields.includes('guestCount') && (
          <View style={{ marginBottom: 20 }}>
            <Text style={styles.label}>{t('guestCount')}</Text>
            <TextInput
              style={[styles.input, errors.guestCount && styles.inputError]}
              value={profileData.guestCount}
              onChangeText={(value) => updateProfileData('guestCount', value)}
              placeholder="Expected number of guests"
              keyboardType="numeric"
            />
            {errors.guestCount && (
              <Text style={styles.errorText}>{errors.guestCount}</Text>
            )}
          </View>
        )}

        {step.fields.includes('weddingStyle') && (
          <View style={{ marginBottom: 20 }}>
            <Text style={styles.label}>{t('weddingStyle')}</Text>
            <TextInput
              style={[styles.input, errors.weddingStyle && styles.inputError]}
              value={profileData.weddingStyle}
              onChangeText={(value) => updateProfileData('weddingStyle', value)}
              placeholder="e.g., Traditional, Modern, Rustic, Beach"
              autoCapitalize="words"
            />
            {errors.weddingStyle && (
              <Text style={styles.errorText}>{errors.weddingStyle}</Text>
            )}
          </View>
        )}

        {step.fields.includes('address') && (
          <View style={{ marginBottom: 20 }}>
            <Text style={styles.label}>Address</Text>
            <TextInput
              style={[styles.input, errors.address && styles.inputError]}
              value={profileData.address}
              onChangeText={(value) => updateProfileData('address', value)}
              placeholder="Your address"
              autoCapitalize="words"
              multiline
              numberOfLines={3}
            />
            {errors.address && (
              <Text style={styles.errorText}>{errors.address}</Text>
            )}
          </View>
        )}
      </View>
    );
  };

  return (
    <SafeAreaView style={commonStyles.container}>
      <LinearGradient
        colors={[colors.accent + '20', colors.background]}
        style={commonStyles.container}
      >
        {/* Options Menu Button */}
        <TouchableOpacity
          style={{
            position: 'absolute',
            top: 60,
            right: 20,
            zIndex: 1000,
            backgroundColor: colors.card,
            borderRadius: 20,
            padding: 8,
            boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.1)',
            elevation: 3,
          }}
          onPress={() => setShowOptionsMenu(true)}
        >
          <Ionicons name="menu" size={24} color={colors.text} />
        </TouchableOpacity>

        <ScrollView 
          style={commonStyles.content}
          showsVerticalScrollIndicator={false}
        >
          {/* Progress Indicator */}
          <View style={{ marginBottom: 32, marginTop: 20 }}>
            <Text style={[commonStyles.title, { 
              textAlign: 'center', 
              marginBottom: 20 
            }]}>
              Profile Setup
            </Text>
            
            <View style={styles.progressContainer}>
              {setupSteps.map((_, index) => (
                <View key={index} style={styles.progressStep}>
                  <View style={[
                    styles.progressDot,
                    index <= currentStep && styles.progressDotActive
                  ]}>
                    <Text style={[
                      styles.progressText,
                      index <= currentStep && styles.progressTextActive
                    ]}>
                      {index + 1}
                    </Text>
                  </View>
                  {index < setupSteps.length - 1 && (
                    <View style={[
                      styles.progressLine,
                      index < currentStep && styles.progressLineActive
                    ]} />
                  )}
                </View>
              ))}
            </View>
          </View>

          {/* Step Content */}
          <View style={commonStyles.card}>
            {renderStepContent()}
          </View>

          {/* Navigation Buttons */}
          <View style={styles.buttonContainer}>
            {currentStep > 0 && (
              <TouchableOpacity
                style={[buttonStyles.outline, { flex: 1, marginRight: 8 }]}
                onPress={handlePrevious}
              >
                <Text style={[commonStyles.text, { 
                  color: colors.accent, 
                  fontWeight: '600' 
                }]}>
                  {t('previous')}
                </Text>
              </TouchableOpacity>
            )}
            
            <TouchableOpacity
              style={[buttonStyles.primary, { 
                flex: currentStep > 0 ? 1 : undefined,
                marginLeft: currentStep > 0 ? 8 : 0 
              }]}
              onPress={handleNext}
            >
              <Text style={[commonStyles.text, { 
                color: colors.text, 
                fontWeight: '600' 
              }]}>
                {currentStep === setupSteps.length - 1 ? t('finish') : t('next')}
              </Text>
            </TouchableOpacity>
          </View>

          {/* Skip Option for Non-Required Steps */}
          {!setupSteps[currentStep].required && (
            <TouchableOpacity
              style={{ alignItems: 'center', marginTop: 16 }}
              onPress={() => {
                if (currentStep < setupSteps.length - 1) {
                  setCurrentStep(currentStep + 1);
                } else {
                  handleFinish();
                }
              }}
            >
              <Text style={[commonStyles.textLight, { 
                textDecorationLine: 'underline' 
              }]}>
                Skip this step
              </Text>
            </TouchableOpacity>
          )}
        </ScrollView>

        {renderDatePicker()}

        <OptionsMenu
          visible={showOptionsMenu}
          onClose={() => setShowOptionsMenu(false)}
        />
      </LinearGradient>
    </SafeAreaView>
  );
};

const styles = {
  label: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: colors.text,
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: colors.background,
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    justifyContent: 'space-between' as const,
  },
  inputError: {
    borderColor: colors.error,
  },
  errorText: {
    color: colors.error,
    fontSize: 14,
    marginTop: 4,
  },
  progressContainer: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
  },
  progressStep: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
  },
  progressDot: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.border,
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
  },
  progressDotActive: {
    backgroundColor: colors.accent,
  },
  progressText: {
    fontSize: 14,
    fontWeight: '600' as const,
    color: colors.textLight,
  },
  progressTextActive: {
    color: colors.text,
  },
  progressLine: {
    width: 40,
    height: 2,
    backgroundColor: colors.border,
    marginHorizontal: 8,
  },
  progressLineActive: {
    backgroundColor: colors.accent,
  },
  buttonContainer: {
    flexDirection: 'row' as const,
    marginTop: 24,
    marginBottom: 40,
  },
};

export default ProfileSetupScreen;
