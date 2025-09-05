import Constants from "expo-constants";
import { Platform, Dimensions } from "react-native";

// Função para obter a altura da status bar de forma consistente
export const getStatusBarHeight = () => {
  if (Platform.OS === "android") {
    // No Android com translucent=true, usamos a altura da status bar
    return Constants.statusBarHeight || 30;
  }

  // No iOS, a status bar é gerenciada automaticamente
  return 0;
};

// Função para obter padding top seguro para headers
export const getSafeAreaPaddingTop = () => {
  const statusBarHeight = getStatusBarHeight();
  const deviceHasNotch = hasNotch();

  if (Platform.OS === "android") {
    // No Android, adicionamos padding extra além da status bar
    // Mais espaço para dispositivos com notch/câmera
    return deviceHasNotch ? statusBarHeight + 35 : statusBarHeight + 20;
  }

  // No iOS, mais espaço para dispositivos com notch
  return deviceHasNotch ? 65 : 50;
};

// Função para obter padding bottom seguro para navegação inferior
export const getSafeAreaPaddingBottom = () => {
  const { height } = Dimensions.get("window");

  // Detectar se é um device com notch/home indicator
  // Esta é uma aproximação baseada em altura da tela
  const hasHomeIndicator = Platform.OS === "ios" && height >= 812;

  if (hasHomeIndicator) {
    return 50; // Altura típica do home indicator
  }

  return 20; // Padding padrão
};

// Função para verificar se o device tem notch
export const hasNotch = () => {
  const { height } = Dimensions.get("window");

  if (Platform.OS === "ios") {
    // iPhones com notch têm altura >= 812
    return height >= 812;
  }

  if (Platform.OS === "android") {
    // Para Android, verificamos se a status bar é maior que o padrão
    return Constants.statusBarHeight > 24;
  }

  return false;
};

// Configurações responsivas baseadas no dispositivo
export const getResponsiveConfig = () => {
  const statusBarHeight = getStatusBarHeight();
  const safeAreaTop = getSafeAreaPaddingTop();
  const safeAreaBottom = getSafeAreaPaddingBottom();
  const deviceHasNotch = hasNotch();

  return {
    statusBarHeight,
    safeAreaTop,
    safeAreaBottom,
    hasNotch: deviceHasNotch,
    isTranslucent: Platform.OS === "android",
  };
};
