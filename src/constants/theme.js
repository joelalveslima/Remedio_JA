import { Platform } from "react-native";

// Tema centralizado do app - modifique aqui para atualizar todo o app
export const COLORS = {
  // Cores principais
  primary: "#21796A",
  primaryLight: "#F0F9F7",

  // Cores de status
  success: "#4CAF50",
  error: "#B00020",
  warning: "#FF9800",
  info: "#2196F3",

  // Cores de texto
  textPrimary: "#333",
  textSecondary: "#666",
  textLight: "#888",
  textWhite: "#fff",

  // Cores de fundo
  background: "#F6F8F9",
  cardBackground: "#fff",

  // Cores de ícones
  iconLocation: "#4CAF50", // Verde para localização
  iconTime: "#FF9800", // Laranja para horário
  iconPrimary: "#21796A", // Verde principal
  iconSecondary: "#666",
  iconWhite: "#fff",

  // Cores de borda
  border: "#E0E0E0",
  borderLight: "#F0F0F0",

  // Cores de disponibilidade
  available: "#21796A",
  unavailable: "#B00020",

  // Cores de permissão de localização
  locationActive: "#4CAF50",
  locationInactive: "#FF9800",
  locationDenied: "#F44336",
  locationUnavailable: "#888",
};

export const FONTS = {
  // Fontes Open Sans
  regular: "OpenSans_400Regular",
  semiBold: "OpenSans_600SemiBold",
  bold: "OpenSans_700Bold",
};

export const FONT_SIZES = {
  // Tamanhos de fonte padronizados
  xs: 11,
  sm: 12,
  md: 13,
  base: 14,
  lg: 16,
  xl: 18,
  xxl: 20,
  title: 24,
  headerTitle: 28,
};

export const ICON_SIZES = {
  // Tamanhos de ícones padronizados
  xs: 12,
  sm: 14,
  md: 16,
  lg: 18,
  xl: 20,
  xxl: 24,
  large: 40,
  xlarge: 80,
};

export const SPACING = {
  // Espaçamentos padronizados
  xs: 4,
  sm: 6,
  md: 8,
  base: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  xxxl: 32,
};

// Estilos de sombra padronizados
export const SHADOWS = {
  light: {
    elevation: 2,
    shadowColor: "#000",
    shadowOpacity: Platform.OS === "ios" ? 0.08 : 0.1,
    shadowRadius: Platform.OS === "ios" ? 6 : 4,
    shadowOffset: { width: 0, height: Platform.OS === "ios" ? 3 : 2 },
  },
  medium: {
    elevation: 3,
    shadowColor: "#000",
    shadowOpacity: Platform.OS === "ios" ? 0.12 : 0.1,
    shadowRadius: Platform.OS === "ios" ? 10 : 8,
    shadowOffset: { width: 0, height: Platform.OS === "ios" ? 4 : 2 },
  },
  heavy: {
    elevation: 4,
    shadowColor: "#000",
    shadowOpacity: Platform.OS === "ios" ? 0.15 : 0.12,
    shadowRadius: Platform.OS === "ios" ? 12 : 10,
    shadowOffset: { width: 0, height: Platform.OS === "ios" ? 6 : 4 },
  },
};

// Estilos de texto padronizados
export const TEXT_STYLES = {
  headerTitle: {
    fontSize: FONT_SIZES.headerTitle,
    fontFamily: FONTS.bold,
    color: COLORS.textWhite,
    letterSpacing: 1,
  },
  screenTitle: {
    fontSize: FONT_SIZES.xxl,
    fontFamily: FONTS.bold,
    color: COLORS.textWhite,
  },
  cardTitle: {
    fontSize: FONT_SIZES.lg,
    fontFamily: FONTS.bold,
    color: COLORS.primary,
  },
  sectionTitle: {
    fontSize: FONT_SIZES.xl,
    fontFamily: FONTS.bold,
    color: COLORS.primary,
  },
  unitName: {
    fontSize: FONT_SIZES.title,
    fontFamily: FONTS.bold,
    color: COLORS.primary,
  },
  bodyText: {
    fontSize: FONT_SIZES.base,
    fontFamily: FONTS.regular,
    color: COLORS.textPrimary,
  },
  infoText: {
    fontSize: FONT_SIZES.lg,
    fontFamily: FONTS.semiBold,
    color: COLORS.textPrimary,
  },
  buttonText: {
    fontSize: FONT_SIZES.lg,
    fontFamily: FONTS.semiBold,
    color: COLORS.primary,
  },
  buttonTextWhite: {
    fontSize: FONT_SIZES.base,
    fontFamily: FONTS.semiBold,
    color: COLORS.textWhite,
  },
  locationText: {
    fontSize: FONT_SIZES.sm,
    fontFamily: FONTS.regular,
    color: COLORS.textWhite,
    opacity: 0.9,
  },
  distanceText: {
    fontSize: FONT_SIZES.md,
    fontFamily: FONTS.regular,
    color: COLORS.primary,
  },
  statusText: {
    fontSize: FONT_SIZES.md,
    fontFamily: FONTS.semiBold,
  },
  timeText: {
    fontSize: FONT_SIZES.sm,
    fontFamily: FONTS.regular,
    color: COLORS.textSecondary,
  },
  medicineText: {
    fontSize: FONT_SIZES.lg,
    fontFamily: FONTS.semiBold,
    color: COLORS.textPrimary,
  },
  descriptionText: {
    fontSize: FONT_SIZES.base,
    fontFamily: FONTS.regular,
    color: COLORS.textSecondary,
  },
  smallText: {
    fontSize: FONT_SIZES.xs,
    fontFamily: FONTS.regular,
    color: COLORS.textLight,
  },
};
