// Tema centralizado do app - modifique aqui para atualizar todo o app
import { Platform } from "react-native";

export const COLORS = {
  // Cores principais - Mantidas
  primary: "#009900",
  primaryLight: "#E8F5E8", // Mais suave e harmoniosa
  primaryDark: "#006600", // Versão mais escura do verde principal

  // Cores de status - Melhoradas
  success: "#4CAF50",
  error: "#F44336",
  warning: "#FF9800",
  info: "#2196F3",

  // Cores de texto - Otimizadas para legibilidade
  textPrimary: "#212121", // Preto mais suave
  textSecondary: "#757575", // Cinza balanceado
  textLight: "#9E9E9E", // Cinza claro consistente
  textWhite: "#FFFFFF",

  // Cores de fundo - Harmonizadas
  background: "#FAFAFA", // Fundo mais limpo
  cardBackground: "#FFFFFF",
  surfaceLight: "#F5F5F5", // Nova cor para superfícies leves

  // Cores de ícones - Coordenadas com o tema
  iconLocation: "#4CAF50", // Verde consistente
  iconTime: "#FF9800", // Laranja para horário
  iconPrimary: "#009900", // Usando a cor principal
  iconSecondary: "#757575", // Consistente com textSecondary
  iconWhite: "#FFFFFF",
  iconActive: "#4CAF50", // Verde para estados ativos

  // Cores de borda - Sutis e elegantes
  border: "#E0E0E0",
  borderLight: "#F0F0F0",
  borderFocus: "#009900", // Verde principal para foco

  // Cores de disponibilidade - Melhor contraste
  available: "#4CAF50", // Verde mais amigável
  unavailable: "#F44336", // Vermelho mais visível
};

export const FONTS = {
  // Fontes nativas do sistema - Modernas e otimizadas para cada plataforma
  light: Platform.select({
    ios: "SF Pro Display", // San Francisco - fonte nativa do iOS
    android: "Roboto-Light", // Roboto Light - fonte nativa do Android
    default: "System",
  }),
  regular: Platform.select({
    ios: "SF Pro Display", // San Francisco Regular
    android: "Roboto", // Roboto Regular
    default: "System",
  }),
  medium: Platform.select({
    ios: "SF Pro Display", // San Francisco Medium
    android: "Roboto-Medium", // Roboto Medium
    default: "System",
  }),
  semiBold: Platform.select({
    ios: "SF Pro Display", // San Francisco Semibold
    android: "Roboto-Medium", // Roboto Medium (mais próximo)
    default: "System",
  }),
  bold: Platform.select({
    ios: "SF Pro Display", // San Francisco Bold
    android: "Roboto-Bold", // Roboto Bold
    default: "System",
  }),

  // Fontes de sistema como fallback universal
  system: Platform.select({
    ios: "System",
    android: "System",
    default: "System",
  }),
};

export const FONT_SIZES = {
  // Sistema de tipografia escalável e moderno
  xs: 10, // Labels pequenos
  sm: 12, // Texto secundário
  base: 14, // Texto padrão (mais legível)
  md: 15, // Texto médio
  lg: 16, // Texto importante
  xl: 18, // Subtítulos
  xxl: 20, // Títulos seção
  h3: 22, // Títulos h3
  h2: 24, // Títulos h2
  h1: 28, // Títulos principais
  display: 32, // Texto de destaque
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
    shadowOpacity: 0.1,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
  medium: {
    elevation: 3,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
  },
  heavy: {
    elevation: 4,
    shadowColor: "#000",
    shadowOpacity: 0.12,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
  },
};

// Estilos de texto padronizados com tipografia moderna
export const TEXT_STYLES = {
  // Headers e títulos principais
  headerTitle: {
    fontSize: FONT_SIZES.h2,
    fontFamily: FONTS.bold,
    color: COLORS.textWhite,
    fontWeight: "700",
    letterSpacing: 0.3,
    lineHeight: FONT_SIZES.h2 * 1.2,
  },
  screenTitle: {
    fontSize: FONT_SIZES.h2,
    fontFamily: FONTS.bold,
    color: COLORS.textWhite,
    fontWeight: "700",
    letterSpacing: 0.3,
  },

  // Títulos de cards e seções
  cardTitle: {
    fontSize: FONT_SIZES.lg,
    fontFamily: FONTS.semiBold,
    color: COLORS.textPrimary,
    fontWeight: "600",
    lineHeight: FONT_SIZES.lg * 1.3,
  },
  sectionTitle: {
    fontSize: FONT_SIZES.xl,
    fontFamily: FONTS.semiBold,
    color: COLORS.primary,
    fontWeight: "600",
    letterSpacing: 0.2,
    lineHeight: FONT_SIZES.xl * 1.25,
  },
  unitName: {
    fontSize: FONT_SIZES.h2,
    fontFamily: FONTS.bold,
    color: COLORS.primary,
    fontWeight: "700",
    letterSpacing: 0.3,
    lineHeight: FONT_SIZES.h2 * 1.2,
  },

  // Textos de conteúdo
  bodyText: {
    fontSize: FONT_SIZES.base,
    fontFamily: FONTS.regular,
    color: COLORS.textPrimary,
    fontWeight: "400",
    lineHeight: FONT_SIZES.base * 1.5, // Melhor espaçamento
    letterSpacing: 0.1,
  },
  bodyTextLarge: {
    fontSize: FONT_SIZES.md,
    fontFamily: FONTS.regular,
    color: COLORS.textPrimary,
    fontWeight: "400",
    lineHeight: FONT_SIZES.md * 1.4,
    letterSpacing: 0.1,
  },

  // Textos informativos
  infoText: {
    fontSize: FONT_SIZES.md,
    fontFamily: FONTS.medium,
    color: COLORS.textPrimary,
    fontWeight: "500",
    lineHeight: FONT_SIZES.md * 1.3,
  },
  importantText: {
    fontSize: FONT_SIZES.lg,
    fontFamily: FONTS.semiBold,
    color: COLORS.textPrimary,
    fontWeight: "600",
    lineHeight: FONT_SIZES.lg * 1.3,
  },

  // Textos de botões
  buttonText: {
    fontSize: FONT_SIZES.md,
    fontFamily: FONTS.semiBold,
    color: COLORS.primary,
    fontWeight: "600",
    letterSpacing: 0.5,
  },
  buttonTextWhite: {
    fontSize: FONT_SIZES.md,
    fontFamily: FONTS.semiBold,
    color: COLORS.textWhite,
    fontWeight: "600",
    letterSpacing: 0.5,
  },
  buttonTextLarge: {
    fontSize: FONT_SIZES.lg,
    fontFamily: FONTS.semiBold,
    color: COLORS.textWhite,
    fontWeight: "600",
    letterSpacing: 0.3,
  },

  // Textos de localização e status
  locationText: {
    fontSize: FONT_SIZES.sm,
    fontFamily: FONTS.medium,
    color: COLORS.textWhite,
    fontWeight: "500",
    opacity: 0.9,
    letterSpacing: 0.2,
  },
  distanceText: {
    fontSize: FONT_SIZES.base,
    fontFamily: FONTS.semiBold,
    color: COLORS.primary,
    fontWeight: "600",
    letterSpacing: 0.1,
  },
  statusText: {
    fontSize: FONT_SIZES.sm,
    fontFamily: FONTS.medium,
    fontWeight: "500",
    letterSpacing: 0.2,
  },

  // Textos de tempo e data
  timeText: {
    fontSize: FONT_SIZES.sm,
    fontFamily: FONTS.regular,
    color: COLORS.textSecondary,
    fontWeight: "400",
    lineHeight: FONT_SIZES.sm * 1.3,
  },
  dateText: {
    fontSize: FONT_SIZES.xs,
    fontFamily: FONTS.regular,
    color: COLORS.textLight,
    fontWeight: "400",
    letterSpacing: 0.1,
  },

  // Textos específicos
  medicineText: {
    fontSize: FONT_SIZES.md,
    fontFamily: FONTS.medium,
    color: COLORS.textPrimary,
    fontWeight: "500",
    lineHeight: FONT_SIZES.md * 1.3,
  },
  descriptionText: {
    fontSize: FONT_SIZES.base,
    fontFamily: FONTS.regular,
    color: COLORS.textSecondary,
    fontWeight: "400",
    lineHeight: FONT_SIZES.base * 1.4,
    letterSpacing: 0.1,
  },
  captionText: {
    fontSize: FONT_SIZES.sm,
    fontFamily: FONTS.regular,
    color: COLORS.textSecondary,
    fontWeight: "400",
    lineHeight: FONT_SIZES.sm * 1.3,
    letterSpacing: 0.1,
  },
  smallText: {
    fontSize: FONT_SIZES.xs,
    fontFamily: FONTS.regular,
    color: COLORS.textLight,
    fontWeight: "400",
    letterSpacing: 0.1,
  },

  // Textos de feedback e notificações
  successText: {
    fontSize: FONT_SIZES.base,
    fontFamily: FONTS.medium,
    color: COLORS.success,
    fontWeight: "500",
  },
  errorText: {
    fontSize: FONT_SIZES.base,
    fontFamily: FONTS.medium,
    color: COLORS.error,
    fontWeight: "500",
  },
  warningText: {
    fontSize: FONT_SIZES.base,
    fontFamily: FONTS.medium,
    color: COLORS.warning,
    fontWeight: "500",
  },
};
