
import { StyleSheet, ViewStyle, TextStyle } from 'react-native';

export const colors = {
  primary: '#F8F8F8',      // Pure white background
  secondary: '#2C2C2C',    // Dark grey for text
  accent: '#F4C2C2',       // Pastel pink
  gold: '#D4AF37',         // Gold accent
  background: '#FFFFFF',   // White background
  backgroundAlt: '#FAFAFA', // Light grey background
  text: '#2C2C2C',         // Dark grey text
  textLight: '#6B6B6B',    // Light grey text
  card: '#FFFFFF',         // White card background
  border: '#E8E8E8',       // Light border
  success: '#4CAF50',      // Success green
  warning: '#FF9800',      // Warning orange
  error: '#F44336',        // Error red
  grey: '#CCCCCC',         // Grey for handles and dividers
};

export const buttonStyles = StyleSheet.create({
  primary: {
    backgroundColor: colors.accent,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0px 2px 8px rgba(244, 194, 194, 0.3)',
    elevation: 3,
  } as ViewStyle,
  secondary: {
    backgroundColor: colors.gold,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0px 2px 8px rgba(212, 175, 55, 0.3)',
    elevation: 3,
  } as ViewStyle,
  outline: {
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: colors.accent,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
  } as ViewStyle,
});

export const commonStyles = StyleSheet.create({
  wrapper: {
    backgroundColor: colors.background,
    width: '100%',
    height: '100%',
  } as ViewStyle,
  container: {
    flex: 1,
    backgroundColor: colors.background,
    width: '100%',
    height: '100%',
  } as ViewStyle,
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
  } as ViewStyle,
  title: {
    fontSize: 32,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 8,
    fontFamily: 'Montserrat_700Bold',
  } as TextStyle,
  subtitle: {
    fontSize: 18,
    fontWeight: '400',
    color: colors.textLight,
    marginBottom: 24,
    fontFamily: 'Lato_400Regular',
  } as TextStyle,
  text: {
    fontSize: 16,
    fontWeight: '400',
    color: colors.text,
    lineHeight: 24,
    fontFamily: 'Lato_400Regular',
  } as TextStyle,
  textLight: {
    fontSize: 14,
    fontWeight: '400',
    color: colors.textLight,
    lineHeight: 20,
    fontFamily: 'Lato_400Regular',
  } as TextStyle,
  section: {
    marginBottom: 32,
  } as ViewStyle,
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 16,
    fontFamily: 'Montserrat_600SemiBold',
  } as TextStyle,
  card: {
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.08)',
    elevation: 4,
    borderWidth: 1,
    borderColor: colors.border,
  } as ViewStyle,
  cardSmall: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.06)',
    elevation: 2,
    borderWidth: 1,
    borderColor: colors.border,
  } as ViewStyle,
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  } as ViewStyle,
  centerContent: {
    alignItems: 'center',
    justifyContent: 'center',
  } as ViewStyle,
  icon: {
    width: 24,
    height: 24,
    tintColor: colors.text,
  } as ViewStyle,
  iconLarge: {
    width: 48,
    height: 48,
    tintColor: colors.accent,
  } as ViewStyle,
});
