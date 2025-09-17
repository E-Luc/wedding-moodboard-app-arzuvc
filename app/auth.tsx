
import React, { useState } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  ScrollView, 
  Image, 
  Alert,
  KeyboardAvoidingView,
  Platform
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { router } from 'expo-router';
import { commonStyles, colors, buttonStyles } from '../styles/commonStyles';
import { useAuth } from '../hooks/useAuth';
import OptionsMenu from '../components/OptionsMenu';

const AuthScreen = () => {
  const { t } = useTranslation();
  const { login, register } = useAuth();
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [showOptionsMenu, setShowOptionsMenu] = useState(false);
  
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    firstName: '',
    lastName: '',
    confirmPassword: ''
  });

  const [errors, setErrors] = useState<{[key: string]: string}>({});

  const validateForm = () => {
    const newErrors: {[key: string]: string} = {};

    if (!formData.email) {
      newErrors.email = t('requiredField');
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = t('invalidEmail');
    }

    if (!formData.password) {
      newErrors.password = t('requiredField');
    }

    if (!isLogin) {
      if (!formData.firstName) {
        newErrors.firstName = t('requiredField');
      }
      if (!formData.lastName) {
        newErrors.lastName = t('requiredField');
      }
      if (!formData.confirmPassword) {
        newErrors.confirmPassword = t('requiredField');
      } else if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = t('passwordMismatch');
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setLoading(true);
    console.log('Submitting form:', isLogin ? 'login' : 'register');

    try {
      let result;
      if (isLogin) {
        result = await login({
          email: formData.email,
          password: formData.password
        });
      } else {
        result = await register({
          email: formData.email,
          password: formData.password,
          firstName: formData.firstName,
          lastName: formData.lastName
        });
      }

      if (result.success) {
        console.log('Auth successful, redirecting...');
        router.replace('/');
      } else {
        Alert.alert('Error', result.error || 'Authentication failed');
      }
    } catch (error) {
      console.error('Auth error:', error);
      Alert.alert('Error', 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  const updateFormData = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
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

        <KeyboardAvoidingView 
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={{ flex: 1 }}
        >
          <ScrollView 
            contentContainerStyle={{ flexGrow: 1 }}
            showsVerticalScrollIndicator={false}
          >
            <View style={{ flex: 1, justifyContent: 'center', padding: 20 }}>
              {/* Logo and Welcome */}
              <View style={[commonStyles.centerContent, { marginBottom: 40 }]}>
                <Image
                  source={require('../assets/images/fcc010d3-fb12-4957-8141-9246ba015046.png')}
                  style={{
                    width: 120,
                    height: 120,
                    marginBottom: 20,
                    borderRadius: 60,
                  }}
                  resizeMode="contain"
                />
                
                <Text style={[commonStyles.title, { 
                  fontSize: 32, 
                  textAlign: 'center',
                  marginBottom: 8,
                }]}>
                  {t('welcome')}
                </Text>
                
                <Text style={[commonStyles.title, { 
                  fontSize: 28, 
                  textAlign: 'center',
                  color: colors.accent,
                  marginBottom: 12,
                }]}>
                  {t('appName')}
                </Text>
                
                <Text style={[commonStyles.subtitle, { 
                  textAlign: 'center',
                  fontSize: 16,
                  marginBottom: 40,
                }]}>
                  {t('tagline')}
                </Text>
              </View>

              {/* Form */}
              <View style={commonStyles.card}>
                <Text style={[commonStyles.sectionTitle, { 
                  textAlign: 'center', 
                  marginBottom: 24 
                }]}>
                  {isLogin ? t('signIn') : t('createAccount')}
                </Text>

                {!isLogin && (
                  <>
                    <View style={{ marginBottom: 16 }}>
                      <Text style={styles.label}>{t('firstName')}</Text>
                      <TextInput
                        style={[styles.input, errors.firstName && styles.inputError]}
                        value={formData.firstName}
                        onChangeText={(value) => updateFormData('firstName', value)}
                        placeholder={t('firstName')}
                        autoCapitalize="words"
                      />
                      {errors.firstName && (
                        <Text style={styles.errorText}>{errors.firstName}</Text>
                      )}
                    </View>

                    <View style={{ marginBottom: 16 }}>
                      <Text style={styles.label}>{t('lastName')}</Text>
                      <TextInput
                        style={[styles.input, errors.lastName && styles.inputError]}
                        value={formData.lastName}
                        onChangeText={(value) => updateFormData('lastName', value)}
                        placeholder={t('lastName')}
                        autoCapitalize="words"
                      />
                      {errors.lastName && (
                        <Text style={styles.errorText}>{errors.lastName}</Text>
                      )}
                    </View>
                  </>
                )}

                <View style={{ marginBottom: 16 }}>
                  <Text style={styles.label}>{t('email')}</Text>
                  <TextInput
                    style={[styles.input, errors.email && styles.inputError]}
                    value={formData.email}
                    onChangeText={(value) => updateFormData('email', value)}
                    placeholder={t('email')}
                    keyboardType="email-address"
                    autoCapitalize="none"
                  />
                  {errors.email && (
                    <Text style={styles.errorText}>{errors.email}</Text>
                  )}
                </View>

                <View style={{ marginBottom: 16 }}>
                  <Text style={styles.label}>{t('password')}</Text>
                  <TextInput
                    style={[styles.input, errors.password && styles.inputError]}
                    value={formData.password}
                    onChangeText={(value) => updateFormData('password', value)}
                    placeholder={t('password')}
                    secureTextEntry
                  />
                  {errors.password && (
                    <Text style={styles.errorText}>{errors.password}</Text>
                  )}
                </View>

                {!isLogin && (
                  <View style={{ marginBottom: 16 }}>
                    <Text style={styles.label}>{t('confirmPassword')}</Text>
                    <TextInput
                      style={[styles.input, errors.confirmPassword && styles.inputError]}
                      value={formData.confirmPassword}
                      onChangeText={(value) => updateFormData('confirmPassword', value)}
                      placeholder={t('confirmPassword')}
                      secureTextEntry
                    />
                    {errors.confirmPassword && (
                      <Text style={styles.errorText}>{errors.confirmPassword}</Text>
                    )}
                  </View>
                )}

                <TouchableOpacity
                  style={[buttonStyles.primary, { 
                    marginBottom: 16,
                    opacity: loading ? 0.7 : 1 
                  }]}
                  onPress={handleSubmit}
                  disabled={loading}
                >
                  <Text style={[commonStyles.text, { 
                    color: colors.text, 
                    fontWeight: '600' 
                  }]}>
                    {loading ? '...' : (isLogin ? t('signIn') : t('createAccount'))}
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[buttonStyles.outline, { marginBottom: 16 }]}
                  onPress={() => setIsLogin(!isLogin)}
                >
                  <Text style={[commonStyles.text, { 
                    color: colors.accent, 
                    fontWeight: '600' 
                  }]}>
                    {isLogin ? t('createAccount') : t('signIn')}
                  </Text>
                </TouchableOpacity>

                {isLogin && (
                  <TouchableOpacity style={{ alignItems: 'center' }}>
                    <Text style={[commonStyles.textLight, { 
                      textDecorationLine: 'underline' 
                    }]}>
                      {t('forgotPassword')}
                    </Text>
                  </TouchableOpacity>
                )}
              </View>

              {/* Demo Account Info */}
              <View style={[commonStyles.card, { 
                backgroundColor: colors.accent + '10',
                marginTop: 20 
              }]}>
                <Text style={[commonStyles.text, { 
                  fontWeight: '600', 
                  marginBottom: 8,
                  textAlign: 'center' 
                }]}>
                  Demo Account
                </Text>
                <Text style={[commonStyles.textLight, { textAlign: 'center' }]}>
                  Email: admin{'\n'}
                  Password: admin
                </Text>
              </View>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>

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
  },
  inputError: {
    borderColor: colors.error,
  },
  errorText: {
    color: colors.error,
    fontSize: 14,
    marginTop: 4,
  },
};

export default AuthScreen;
