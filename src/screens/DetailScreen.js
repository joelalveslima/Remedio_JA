import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  FlatList,
  Linking,
  Platform,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { Ionicons } from "@expo/vector-icons";
import * as Location from "expo-location";
import texts from "../localization";
import { COLORS, SPACING, SHADOWS, TEXT_STYLES } from "../constants/theme";
import { calculateDistance } from "../utils/locationUtils";
import { getResponsiveConfig } from "../utils/safeAreaUtils";

export default function DetailScreen({ navigation, route }) {
  const { unidade, medicamentoPesquisado } = route.params;
  const [userLocation, setUserLocation] = useState(null);
  const [distanciaCalculada, setDistanciaCalculada] = useState(null);
  const [locationStatus, setLocationStatus] = useState("verificando"); // verificando, ativa, inativa, negada
  const [locationWatcher, setLocationWatcher] = useState(null);

  // Configuração responsiva para safe area
  const safeAreaConfig = getResponsiveConfig();

  useEffect(() => {
    getCurrentLocation();
    setupLocationWatcher();

    return () => {
      // Limpar o watcher quando o componente for desmontado
      if (locationWatcher) {
        locationWatcher.remove();
      }
    };
  }, []);

  useEffect(() => {
    if (userLocation && unidade.latitude && unidade.longitude) {
      const distancia = calculateDistance(
        userLocation.latitude,
        userLocation.longitude,
        unidade.latitude,
        unidade.longitude
      );
      setDistanciaCalculada(distancia);
    }
  }, [userLocation]);
  const setupLocationWatcher = async () => {
    try {
      // Verificar se já tem permissão
      const { status } = await Location.getForegroundPermissionsAsync();
      if (status !== "granted") {
        return;
      }

      // Configurar watcher para mudanças de localização
      const watcher = await Location.watchPositionAsync(
        {
          accuracy: Location.Accuracy.Balanced,
          timeInterval: 5000, // Verificar a cada 5 segundos apenas se houver mudança
          distanceInterval: 10, // Só disparar se mover mais de 10 metros
        },
        (location) => {
          // Localização obtida com sucesso - GPS está ativo
          setUserLocation(location.coords);
          if (locationStatus !== "ativa") {
            setLocationStatus("ativa");
          }
        }
      );

      setLocationWatcher(watcher);
    } catch (error) {
      // Se falhou, verificar status manualmente uma vez
      checkLocationStatus();
    }
  };

  const checkLocationStatus = async () => {
    try {
      const isLocationEnabled = await Location.hasServicesEnabledAsync();
      const { status } = await Location.getForegroundPermissionsAsync();

      if (status !== "granted") {
        setLocationStatus("negada");
        return;
      }

      if (!isLocationEnabled) {
        setLocationStatus("inativa");
        return;
      }

      // Se chegou aqui, GPS está ativo e permissão concedida
      setLocationStatus("ativa");
      getCurrentLocation();
    } catch (error) {
      // Silenciosamente define como inativo
      setLocationStatus("inativa");
    }
  };

  const getCurrentLocation = async () => {
    try {
      setLocationStatus("verificando");
      const { status } = await Location.requestForegroundPermissionsAsync();

      if (status === "granted") {
        const isLocationEnabled = await Location.hasServicesEnabledAsync();

        if (!isLocationEnabled) {
          setLocationStatus("inativa");
          // Parar o watcher se GPS foi desativado
          if (locationWatcher) {
            locationWatcher.remove();
            setLocationWatcher(null);
          }
          return;
        }

        const location = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.Balanced,
          timeout: 15000,
        });
        setUserLocation(location.coords);
        setLocationStatus("ativa");

        // Configurar watcher após obter localização inicial com sucesso
        if (!locationWatcher) {
          setupLocationWatcher();
        }
      } else {
        setLocationStatus("negada");
      }
    } catch (error) {
      setLocationStatus("inativa");
      // Parar o watcher se houver erro
      if (locationWatcher) {
        locationWatcher.remove();
        setLocationWatcher(null);
      }
    }
  };

  const handleOpenMaps = () => {
    const url = `https://www.google.com/maps/search/?api=1&query=${unidade.latitude},${unidade.longitude}`;
    Linking.openURL(url);
  };

  const handleCall = () => {
    // Simula um número de telefone
    Linking.openURL("tel:+551133334444");
  };

  // Função para renderizar informações sobre documentos necessários
  const renderInformacoesDocumentos = () => {
    return (
      <View style={styles.infoCardDestaque}>
        <Text style={styles.sectionTitleDestaque}>
          <Ionicons
            name="document-text-outline"
            size={24}
            color={COLORS.primary}
          />{" "}
          Documentos Necessários
        </Text>

        <Text style={styles.infoDescriptionDestaque}>
          <Ionicons name="card-outline" size={18} color={COLORS.primary} />{" "}
          <Text style={styles.documentoTitulo}>Documentos obrigatórios:</Text>
          {"\n"}• Documento de identidade com foto (RG, CNH ou Passaporte){"\n"}
          • Cartão SUS (Sistema Único de Saúde){"\n"}• CPF (pode estar no RG)
          {"\n\n"}
          <Ionicons name="medkit-outline" size={18} color={COLORS.primary} />{" "}
          <Text style={styles.documentoTitulo}>Para medicamentos:</Text>
          {"\n"}• Receita médica (original e dentro da validade){"\n"}• Receita
          especial para medicamentos controlados{"\n\n"}
          <Ionicons
            name="alert-circle-outline"
            size={18}
            color={COLORS.warning}
          />{" "}
          <Text style={styles.documentoTitulo}>Informações importantes:</Text>
          {"\n"}• Disponibilidade sujeita a alterações{"\n"}• Consulte horário
          de funcionamento{"\n"}• Ligue antes de se deslocar para confirmar
          estoque
        </Text>
      </View>
    );
  };

  // Função para renderizar as informações principais
  const renderMainInfo = () => (
    <>
      {/* Informações principais */}
      <View style={styles.mainCard}>
        <Text style={styles.unitName}>{unidade.nome}</Text>

        <View style={styles.infoRow}>
          <Ionicons
            name="location-outline"
            size={20}
            color={COLORS.iconLocation}
          />
          <Text style={styles.infoText}>
            {distanciaCalculada !== null
              ? `${distanciaCalculada} km`
              : unidade.distanciaCalculada
              ? `${unidade.distanciaCalculada} km`
              : `${unidade.distancia} km`}
          </Text>
        </View>

        <View style={styles.infoRow}>
          <Ionicons name="time-outline" size={20} color={COLORS.iconTime} />
          <Text style={styles.infoText}>
            {typeof unidade.horario === "object"
              ? `${unidade.horario.semana.inicio} às ${unidade.horario.semana.fim}`
              : unidade.horario}
          </Text>
        </View>

        <View style={styles.actionButtons}>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={handleOpenMaps}
          >
            <Ionicons
              name="navigate-outline"
              size={20}
              color={COLORS.iconPrimary}
            />
            <Text style={styles.actionButtonText}>{texts.map}</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionButton} onPress={handleCall}>
            <Ionicons
              name="call-outline"
              size={20}
              color={COLORS.iconPrimary}
            />
            <Text style={styles.actionButtonText}>{texts.call}</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Informações sobre documentos necessários */}
      {renderInformacoesDocumentos()}
    </>
  );

  // Função para renderizar o footer (apenas se veio de pesquisa)
  const renderFooter = () => {
    return (
      <View style={styles.footerContainer}>
        <View style={styles.infoCard}>
          <View style={styles.footerInfoContent}>
            <Ionicons
              name="information-circle-outline"
              size={22}
              color={COLORS.info}
              style={styles.footerInfoIcon}
            />
            <Text style={styles.infoDescription}>
              Para informações sobre medicamentos específicos disponíveis,
              entre em contato diretamente com a unidade.
            </Text>
          </View>
        </View>
      </View>
    );
  };

  return (
    <View
      style={[styles.container, { paddingTop: safeAreaConfig.safeAreaTop }]}
    >
      <StatusBar
        style="light"
        backgroundColor={COLORS.primary}
        translucent={safeAreaConfig.isTranslucent}
      />

      {/* Header melhorado */}
      <View
        style={[
          styles.header,
          {
            marginTop:
              Platform.OS === "android" ? -safeAreaConfig.safeAreaTop : 0,
          },
        ]}
      >
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.headerBackButton}
          activeOpacity={0.7}
        >
          <Ionicons name="chevron-back" size={22} color={COLORS.iconWhite} />
          <Text style={styles.headerBackText}>{texts.back}</Text>
        </TouchableOpacity>
        <View style={styles.headerTitleContainer}>
          <Text
            style={styles.headerTitle}
            numberOfLines={1}
            adjustsFontSizeToFit={true}
            minimumFontScale={0.8}
          >
            {texts.unitDetails}
          </Text>
        </View>
        <View style={styles.headerSpacer} />
      </View>

      <FlatList
        data={[]} // Lista vazia - não mostra mais medicamentos
        keyExtractor={(item, index) => index.toString()}
        renderItem={() => null}
        ListHeaderComponent={renderMainInfo}
        ListFooterComponent={renderFooter}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.contentContainer}
        style={styles.content}
        bounces={true}
        scrollEnabled={true}
        nestedScrollEnabled={true}
      />

      {/* Botões de navegação inferior melhorados */}
      <View style={styles.bottomNavigation}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
          activeOpacity={0.8}
        >
          <View style={styles.buttonContent}>
            <Ionicons name="chevron-back" size={24} color={COLORS.iconWhite} />
            <Text style={styles.buttonText}>{texts.back}</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.homeButton}
          onPress={() => navigation.navigate("Home")}
          activeOpacity={0.8}
        >
          <View style={styles.buttonContent}>
            <Ionicons name="home-outline" size={22} color={COLORS.iconWhite} />
            <Text style={styles.buttonText}>{texts.home}</Text>
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  // Container principal
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },

  // Header melhorado
  header: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.primary,
    paddingVertical: SPACING.xxxl,
    paddingHorizontal: SPACING.xl,
    borderBottomLeftRadius: SPACING.xxxl,
    borderBottomRightRadius: SPACING.xxxl,
    marginBottom: SPACING.lg,
    ...SHADOWS.heavy,
    // Margem top negativa para sobrepor a safe area quando necessário
    marginTop: Platform.OS === "android" ? -26 : 0,
  },
  headerBackButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: SPACING.sm,
    paddingHorizontal: SPACING.sm,
    borderRadius: 20,
    backgroundColor: "rgba(255, 255, 255, 0.15)",
    minWidth: 80,
  },
  headerBackText: {
    ...TEXT_STYLES.captionText,
    color: COLORS.iconWhite,
    marginLeft: SPACING.xs,
  },
  headerTitleContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  headerTitle: {
    ...TEXT_STYLES.headerTitle,
    textAlign: "center",
    numberOfLines: 1,
    adjustsFontSizeToFit: true,
    minimumFontScale: 0.8,
  },
  headerSpacer: {
    width: 80, // Mesmo tamanho do botão back para centralizar o título
  },

  // Conteúdo
  content: {
    flex: 1,
  },
  contentContainer: {
    padding: SPACING.xl,
    paddingBottom: 40,
  },

  // Card principal
  mainCard: {
    backgroundColor: COLORS.cardBackground,
    borderRadius: SPACING.xl,
    padding: SPACING.xl,
    marginBottom: SPACING.lg,
    ...SHADOWS.light,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  unitName: {
    ...TEXT_STYLES.unitName,
    textAlign: "center",
    marginBottom: SPACING.lg,
  },

  // Informações
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: SPACING.md,
  },
  infoText: {
    ...TEXT_STYLES.bodyText,
    marginLeft: SPACING.sm,
    fontWeight: "500",
  },

  // Botões de ação
  actionButtons: {
    flexDirection: "row",
    marginTop: SPACING.xl,
    justifyContent: "space-around",
  },
  actionButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.cardBackground,
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.xl,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: COLORS.primary,
  },
  actionButtonText: {
    ...TEXT_STYLES.buttonText,
    marginLeft: SPACING.sm,
  },

  // Card de medicamentos
  medicineCard: {
    backgroundColor: COLORS.cardBackground,
    borderRadius: SPACING.xl,
    padding: SPACING.xl,
    marginBottom: SPACING.lg,
    ...SHADOWS.light,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  sectionTitle: {
    ...TEXT_STYLES.sectionTitle,
    marginBottom: SPACING.lg,
    fontWeight: "bold",
  },

  // Lista de medicamentos
  medicineItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  medicineInfo: {
    flex: 1,
  },
  medicineName: {
    ...TEXT_STYLES.cardTitle,
    color: COLORS.textPrimary,
  },
  medicineStatus: {
    ...TEXT_STYLES.captionText,
    marginTop: 2,
  },

  // Footer
  footerContainer: {
    marginTop: SPACING.lg,
    marginBottom: SPACING.xl,
  },
  infoCard: {
    backgroundColor: COLORS.cardBackground,
    borderRadius: SPACING.xl,
    padding: SPACING.xl,
    ...SHADOWS.light,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  infoDescription: {
    ...TEXT_STYLES.descriptionText,
    flex: 1,
    lineHeight: 20,
  },
  footerInfoContent: {
    alignItems: "flex-start",
    flexDirection: "row",
  },
  footerInfoIcon: {
    marginRight: SPACING.sm,
  },

  // Card de informações importantes em destaque
  infoCardDestaque: {
    backgroundColor: COLORS.primaryLight,
    borderRadius: SPACING.xl,
    padding: SPACING.xl,
    margin: SPACING.md,
    ...SHADOWS.medium,
    borderWidth: 2,
    borderColor: COLORS.primary,
  },
  sectionTitleDestaque: {
    ...TEXT_STYLES.sectionTitle,
    color: COLORS.primary,
    marginBottom: SPACING.lg,
  },
  infoDescriptionDestaque: {
    ...TEXT_STYLES.bodyText,
    color: COLORS.textPrimary,
  },
  documentoTitulo: {
    fontWeight: "bold",
    color: COLORS.primary,
  },

  // Navegação inferior melhorada
  bottomNavigation: {
    flexDirection: "row",
    backgroundColor: COLORS.primary,
    paddingVertical: SPACING.lg,
    paddingHorizontal: SPACING.xl,
    paddingBottom: SPACING.lg + (Platform.OS === "ios" ? 34 : 16), // Safe area bottom dinâmico
    justifyContent: "space-between",
    ...SHADOWS.heavy,
    gap: SPACING.md,
  },
  backButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.lg,
    borderRadius: 25,
    backgroundColor: "rgba(255, 255, 255, 0.15)",
    ...SHADOWS.light,
  },
  homeButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.lg,
    borderRadius: 25,
    backgroundColor: "rgba(255, 255, 255, 0.25)",
    ...SHADOWS.light,
  },
  buttonContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  buttonText: {
    ...TEXT_STYLES.buttonTextWhite,
    color: COLORS.iconWhite,
    marginLeft: SPACING.sm,
    textTransform: "uppercase",
  },
});
