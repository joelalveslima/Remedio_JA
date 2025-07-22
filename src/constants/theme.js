// Tema centralizado do app - modifique aqui para atualizar todo o app
export const COLORS = {
  // Cores principais
  primary: "#009900",
  primaryLight: "#F0F9F7",

  // Cores de status
  success: "#4CAF50",
  error: "#B00020",
  warning: "#FF9800",
  info: "#2196F3",

  // Cores de texto - Ajustadas para melhor visibilidade
  textPrimary: "#1A1A1A", // Preto mais escuro para melhor contraste
  textSecondary: "#444", // Cinza mais escuro
  textLight: "#666", // Menos claro para melhor legibilidade
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

  // Cores de disponibilidade - Melhor contraste
  available: "#2E7D32", // Verde mais escuro
  unavailable: "#C62828", // Vermelho mais escuro

  // Cores do botão OCR
  ocrButtonBackground: "#91ff00ff", // Cor laranja vibrante para mais visibilidade
  ocrButtonDisabled: "#999", // Cor quando desabilitado
  ocrButtonBorder: "rgba(255, 255, 255, 0.5)", // Borda mais visível
  ocrButtonIcon: "#fff", // Cor do ícone
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
    fontWeight: "bold",
  },
  sectionTitle: {
    fontSize: FONT_SIZES.xl,
    fontFamily: FONTS.bold,
    color: COLORS.primary,
    fontWeight: "bold",
  },
  unitName: {
    fontSize: FONT_SIZES.title,
    fontFamily: FONTS.bold,
    color: COLORS.primary,
    fontWeight: "bold",
  },
  bodyText: {
    fontSize: FONT_SIZES.base,
    fontFamily: FONTS.regular,
    color: COLORS.textPrimary,
    lineHeight: 20, // Melhor espaçamento entre linhas
  },
  infoText: {
    fontSize: FONT_SIZES.lg,
    fontFamily: FONTS.semiBold,
    color: COLORS.textPrimary,
    fontWeight: "bold",
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
    fontFamily: FONTS.semiBold,
    color: COLORS.primary,
    fontWeight: "bold",
  },
  statusText: {
    fontSize: FONT_SIZES.md,
    fontFamily: FONTS.semiBold,
    fontWeight: "bold",
  },
  timeText: {
    fontSize: FONT_SIZES.sm,
    fontFamily: FONTS.semiBold,
    color: COLORS.textSecondary,
    fontWeight: "normal",
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
