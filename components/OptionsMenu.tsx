
import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Modal, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, commonStyles } from '../styles/commonStyles';
import { useTranslation } from 'react-i18next';
import { router } from 'expo-router';
import { useAuth } from '../hooks/useAuth';

interface OptionsMenuProps {
  visible: boolean;
  onClose: () => void;
}

const OptionsMenu: React.FC<OptionsMenuProps> = ({ visible, onClose }) => {
  const { t, i18n } = useTranslation();
  const { user, logout } = useAuth();
  const [showLanguageMenu, setShowLanguageMenu] = useState(false);

  const languages = [
    { code: 'en', name: 'English', flag: '🇺🇸' },
    { code: 'fr', name: 'Français', flag: '🇫🇷' },
    { code: 'es', name: 'Español', flag: '🇪🇸' },
    { code: 'de', name: 'Deutsch', flag: '🇩🇪' },
    { code: 'it', name: 'Italiano', flag: '🇮🇹' },
    { code: 'pt', name: 'Português', flag: '🇵🇹' },
  ];

  const handleLanguageChange = (languageCode: string) => {
    console.log('Changing language to:', languageCode);
    i18n.changeLanguage(languageCode);
    setShowLanguageMenu(false);
    onClose();
  };

  const handleLogout = async () => {
    console.log('Logging out from options menu');
    await logout();
    onClose();
    router.replace('/auth');
  };

  const menuItems = [
    {
      icon: 'person-circle' as keyof typeof Ionicons.glyphMap,
      title: t('profile'),
      onPress: () => {
        onClose();
        router.push('/profile');
      }
    },
    {
      icon: 'language' as keyof typeof Ionicons.glyphMap,
      title: 'Language / Langue',
      onPress: () => setShowLanguageMenu(true)
    },
    {
      icon: 'settings' as keyof typeof Ionicons.glyphMap,
      title: t('settings'),
      onPress: () => {
        onClose();
        router.push('/settings');
      }
    },
    {
      icon: 'help-circle' as keyof typeof Ionicons.glyphMap,
      title: 'Help',
      onPress: () => {
        onClose();
        router.push('/help');
      }
    },
    {
      icon: 'log-out' as keyof typeof Ionicons.glyphMap,
      title: t('logout'),
      onPress: handleLogout,
      color: colors.error
    }
  ];

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <TouchableOpacity 
        style={styles.overlay} 
        activeOpacity={1} 
        onPress={onClose}
      >
        <View style={styles.menuContainer}>
          {/* User Info */}
          <View style={styles.userInfo}>
            <View style={styles.avatar}>
              <Ionicons 
                name="person" 
                size={24} 
                color={colors.accent} 
              />
            </View>
            <View>
              <Text style={styles.userName}>
                {user?.firstName} {user?.lastName}
              </Text>
              <Text style={styles.userEmail}>
                {user?.email}
              </Text>
            </View>
          </View>

          {/* Menu Items */}
          {menuItems.map((item, index) => (
            <TouchableOpacity
              key={index}
              style={styles.menuItem}
              onPress={item.onPress}
            >
              <Ionicons 
                name={item.icon} 
                size={20} 
                color={item.color || colors.text} 
              />
              <Text style={[
                styles.menuText,
                item.color && { color: item.color }
              ]}>
                {item.title}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </TouchableOpacity>

      {/* Language Selection Modal */}
      <Modal
        visible={showLanguageMenu}
        transparent
        animationType="slide"
        onRequestClose={() => setShowLanguageMenu(false)}
      >
        <TouchableOpacity 
          style={styles.overlay} 
          activeOpacity={1} 
          onPress={() => setShowLanguageMenu(false)}
        >
          <View style={styles.languageContainer}>
            <Text style={styles.languageTitle}>
              Select Language / Choisir la langue
            </Text>
            
            {languages.map((language) => (
              <TouchableOpacity
                key={language.code}
                style={[
                  styles.languageItem,
                  i18n.language === language.code && styles.selectedLanguage
                ]}
                onPress={() => handleLanguageChange(language.code)}
              >
                <Text style={styles.languageFlag}>
                  {language.flag}
                </Text>
                <Text style={[
                  styles.languageName,
                  i18n.language === language.code && styles.selectedLanguageText
                ]}>
                  {language.name}
                </Text>
                {i18n.language === language.code && (
                  <Ionicons 
                    name="checkmark" 
                    size={20} 
                    color={colors.accent} 
                  />
                )}
              </TouchableOpacity>
            ))}
          </View>
        </TouchableOpacity>
      </Modal>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-start',
    alignItems: 'flex-end',
    paddingTop: 60,
    paddingRight: 20,
  },
  menuContainer: {
    backgroundColor: colors.card,
    borderRadius: 12,
    minWidth: 250,
    maxWidth: 300,
    boxShadow: '0px 8px 24px rgba(0, 0, 0, 0.15)',
    elevation: 8,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.accent + '20',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  userName: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 2,
  },
  userEmail: {
    fontSize: 14,
    color: colors.textLight,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  menuText: {
    fontSize: 16,
    color: colors.text,
    marginLeft: 12,
    flex: 1,
  },
  languageContainer: {
    backgroundColor: colors.card,
    borderRadius: 12,
    margin: 20,
    maxHeight: '70%',
    boxShadow: '0px 8px 24px rgba(0, 0, 0, 0.15)',
    elevation: 8,
  },
  languageTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    padding: 20,
    textAlign: 'center',
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  languageItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  selectedLanguage: {
    backgroundColor: colors.accent + '10',
  },
  languageFlag: {
    fontSize: 24,
    marginRight: 12,
  },
  languageName: {
    fontSize: 16,
    color: colors.text,
    flex: 1,
  },
  selectedLanguageText: {
    color: colors.accent,
    fontWeight: '600',
  },
});

export default OptionsMenu;
