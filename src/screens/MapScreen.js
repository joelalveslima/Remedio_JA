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

export default function MapScreen({ navigation, route }) {
  // Configuração responsiva para safe area
  const safeAreaConfig = getResponsiveConfig();

  // Verificação de segurança para parâmetros da rota
  if (!route.params) {
    console.error("❌ MapScreen: Parâmetros de rota não encontrados");
    return (
      <View
        style={[
          styles.container,
          { justifyContent: "center", alignItems: "center" },
        ]}
      >
        <Text style={TEXT_STYLES.errorText}>Erro: Dados não encontrados</Text>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={TEXT_STYLES.buttonText}>Voltar</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const {
    unidades = [],
    remedioFiltro = "",
    showAllUnits = false,
  } = route.params;

  // Verificação se as unidades foram recebidas
  if (!unidades || unidades.length === 0) {
    console.warn("⚠️ MapScreen: Nenhuma unidade recebida");
  }

  const [userLocation, setUserLocation] = useState(null);
  const [locationWatcher, setLocationWatcher] = useState(null);
  const [isLoadingLocation, setIsLoadingLocation] = useState(false);

  useEffect(() => {
    requestLocationPermission();
    setupLocationWatcher();

    return () => {
      // Limpar o watcher quando o componente for desmontado
      if (locationWatcher) {
        locationWatcher.remove();
      }
    };
  }, []);

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
          // Localização obtida com sucesso
          setUserLocation(location.coords);
        }
      );

      setLocationWatcher(watcher);

      // Tentar obter localização inicial
      getCurrentLocation();
    } catch (error) {
      console.warn("Erro ao configurar watcher de localização:", error);
    }
  };

  const requestLocationPermission = async () => {
    try {
      setIsLoadingLocation(true);
      const { status } = await Location.requestForegroundPermissionsAsync();

      if (status === "granted") {
        setupLocationWatcher(); // Configurar watcher após obter permissão
      }
    } catch (error) {
      console.warn("Erro ao solicitar permissão de localização:", error);
    } finally {
      setIsLoadingLocation(false);
    }
  };

  const getCurrentLocation = async () => {
    try {
      setIsLoadingLocation(true);
      const isLocationEnabled = await Location.hasServicesEnabledAsync();

      if (!isLocationEnabled) {
        // Parar o watcher se GPS foi desativado
        if (locationWatcher) {
          locationWatcher.remove();
          setLocationWatcher(null);
        }
        return;
      }

      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
        timeout: 10000,
      });
      setUserLocation(location.coords);
    } catch (error) {
      console.warn("Erro ao obter localização:", error);
      // Parar o watcher se houver erro
      if (locationWatcher) {
        locationWatcher.remove();
        setLocationWatcher(null);
      }
    } finally {
      setIsLoadingLocation(false);
    }
  };

  const unidadesComDistancia = userLocation
    ? unidades
        .map((unidade) => ({
          ...unidade,
          distanciaCalculada: calculateDistance(
            userLocation.latitude,
            userLocation.longitude,
            unidade.latitude,
            unidade.longitude
          ),
        }))
        .sort(
          (a, b) =>
            parseFloat(a.distanciaCalculada) - parseFloat(b.distanciaCalculada)
        )
    : unidades;

  const handleOpenMaps = (unidade) => {
    const url = `https://www.google.com/maps/search/?api=1&query=${unidade.latitude},${unidade.longitude}`;
    Linking.openURL(url);
  };

  const handleUnitPress = (unidade) => {
    navigation.navigate("Detalhes", { unidade });
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

      {/* Header */}
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
          style={{ marginRight: 16 }}
        >
          <Ionicons name="chevron-back" size={22} color={COLORS.iconWhite} />
        </TouchableOpacity>
        <Text
          style={styles.headerTitle}
          numberOfLines={1}
          adjustsFontSizeToFit={true}
          minimumFontScale={0.8}
        >
          {remedioFiltro ? `Mapa - ${remedioFiltro}` : "Todas as Unidades"}
        </Text>
      </View>

      {/* Simulação do Mapa com Lista */}
      <View style={styles.mapContainer}>
        <View style={styles.mapPlaceholder}>
          <Ionicons name="map" size={80} color={COLORS.iconPrimary} />
          <Text style={styles.mapPlaceholderText}>
            {texts.mapVisualization}
          </Text>
          <Text style={styles.mapSubText}>{texts.mapSubText}</Text>

          {/* Botão de Localização - só mostra se não for visualização de todas as unidades */}
          {!showAllUnits && (
            <TouchableOpacity
              style={styles.locationButton}
              onPress={getCurrentLocation}
              disabled={isLoadingLocation}
            >
              <Ionicons
                name={isLoadingLocation ? "refresh" : "locate"}
                size={20}
                color={COLORS.iconWhite}
                style={
                  isLoadingLocation ? { transform: [{ rotate: "45deg" }] } : {}
                }
              />
              <Text style={styles.locationButtonText}>
                {isLoadingLocation ? texts.locating : texts.myLocation}
              </Text>
            </TouchableOpacity>
          )}

          {userLocation && !showAllUnits && (
            <View style={styles.userLocationInfo}>
              <Ionicons
                name="checkmark-circle"
                size={16}
                color={COLORS.iconPrimary}
              />
              <Text style={styles.userLocationText}>
                {texts.orderedByDistance}
              </Text>
            </View>
          )}
        </View>

        <FlatList
          showsVerticalScrollIndicator={false}
          data={unidadesComDistancia}
          keyExtractor={(item) => item.id}
          style={styles.unitsList}
          renderItem={({ item }) => (
            <View style={styles.unitCard}>
              <TouchableOpacity
                style={styles.unitInfo}
                onPress={() => handleUnitPress(item)}
              >
                <Text style={styles.unitName}>{item.nome}</Text>
                <View style={styles.distanceContainer}>
                  <Ionicons
                    name="location"
                    size={14}
                    color={COLORS.iconLocation}
                  />
                  <Text style={styles.unitDistance}>
                    {item.distanciaCalculada
                      ? `${item.distanciaCalculada} km`
                      : `${item.distancia} km`}
                  </Text>
                </View>

                {/* Mostra horário sempre, status só se não for showAllUnits */}
                <View style={styles.scheduleContainer}>
                  <Ionicons name="time" size={14} color={COLORS.iconTime} />
                  <Text style={styles.unitSchedule}>
                    {typeof item.horario === "object"
                      ? `${item.horario.semana.inicio} às ${item.horario.semana.fim}`
                      : item.horario}
                  </Text>
                </View>

                {!showAllUnits && (
                  <Text
                    style={[
                      styles.unitStatus,
                      {
                        color: item.disponivel
                          ? COLORS.available
                          : COLORS.unavailable,
                      },
                    ]}
                  >
                    {item.remedio ? `${item.remedio} - ` : ""}
                    {item.disponivel ? texts.available : texts.unavailable}
                  </Text>
                )}
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.mapButton}
                onPress={() => handleOpenMaps(item)}
              >
                <Ionicons
                  name="navigate"
                  size={20}
                  color={COLORS.iconPrimary}
                />
              </TouchableOpacity>
            </View>
          )}
        />
      </View>

      {/* Info footer */}
      <View style={styles.footer}>
        <Text style={styles.footerText}>
          {unidadesComDistancia.length}{" "}
          {unidadesComDistancia.length === 1
            ? texts.unitSingular
            : texts.unitPlural}
          {userLocation && ` ${texts.orderedByDistanceFooter}`}
        </Text>

        {/* Legenda só aparece quando há busca por remédio específico */}
        {!showAllUnits && (
          <View style={styles.legendContainer}>
            <View style={styles.legendItem}>
              <View
                style={[
                  styles.legendDot,
                  { backgroundColor: COLORS.available },
                ]}
              />
              <Text style={styles.legendText}>{texts.available}</Text>
            </View>
            <View style={styles.legendItem}>
              <View
                style={[
                  styles.legendDot,
                  { backgroundColor: COLORS.unavailable },
                ]}
              />
              <Text style={styles.legendText}>{texts.unavailable}</Text>
            </View>
          </View>
        )}
      </View>

      {/* Botões de navegação inferior */}
      <View style={styles.bottomNavigation}>
        <TouchableOpacity
          style={styles.bottomButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="chevron-back" size={28} color={COLORS.iconWhite} />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.bottomButton}
          onPress={() => navigation.navigate("Home")}
        >
          <Ionicons name="home" size={24} color={COLORS.iconWhite} />
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

  // Header
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
  },
  headerTitle: {
    ...TEXT_STYLES.headerTitle,
    flex: 1,
    textAlign: "center",
  },

  // Mapa
  mapContainer: {
    flex: 1,
    backgroundColor: COLORS.primaryLight,
  },
  mapPlaceholder: {
    backgroundColor: COLORS.cardBackground,
    paddingVertical: 30,
    alignItems: "center",
    marginBottom: 10,
    ...SHADOWS.light,
  },
  mapPlaceholderText: {
    ...TEXT_STYLES.sectionTitle,
    marginTop: 10,
  },
  mapSubText: {
    ...TEXT_STYLES.descriptionText,
    marginTop: 5,
    textAlign: "center",
  },

  // Botões e localização
  locationButton: {
    backgroundColor: COLORS.primary,
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.xl,
    borderRadius: 25,
    marginTop: 15,
    ...SHADOWS.light,
  },
  locationButtonText: {
    ...TEXT_STYLES.buttonText,
    color: COLORS.iconWhite,
    marginLeft: SPACING.sm,
  },
  userLocationInfo: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 10,
    backgroundColor: COLORS.primaryLight,
    paddingVertical: SPACING.sm,
    paddingHorizontal: SPACING.md,
    borderRadius: 15,
  },
  userLocationText: {
    ...TEXT_STYLES.captionText,
    color: COLORS.primary,
    marginLeft: 6,
    fontWeight: "500",
  },

  // Lista de unidades
  unitsList: {
    flex: 1,
    paddingHorizontal: SPACING.lg,
  },
  unitCard: {
    backgroundColor: COLORS.cardBackground,
    borderRadius: 15,
    padding: SPACING.lg,
    marginBottom: SPACING.base,
    flexDirection: "row",
    alignItems: "center",
    ...SHADOWS.light,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  unitInfo: {
    flex: 1,
  },
  unitName: {
    ...TEXT_STYLES.cardTitle,
    marginBottom: 4,
  },
  unitDistance: {
    ...TEXT_STYLES.captionText,
    marginLeft: 4,
  },
  unitSchedule: {
    ...TEXT_STYLES.captionText,
    marginLeft: 4,
    fontStyle: "italic",
  },
  unitStatus: {
    ...TEXT_STYLES.captionText,
    fontWeight: "500",
  },

  // Containers de informações
  distanceContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 4,
  },
  scheduleContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 4,
  },

  // Botão do mapa
  mapButton: {
    backgroundColor: COLORS.primaryLight,
    padding: SPACING.md,
    borderRadius: 10,
    marginLeft: SPACING.md,
  },

  // Footer
  footer: {
    backgroundColor: COLORS.cardBackground,
    padding: SPACING.lg,
    ...SHADOWS.light,
  },
  footerText: {
    ...TEXT_STYLES.cardTitle,
    textAlign: "center",
    marginBottom: SPACING.sm,
  },

  // Legenda
  legendContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  legendItem: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: SPACING.md,
  },
  legendDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 6,
  },
  legendText: {
    ...TEXT_STYLES.captionText,
  },

  // Navegação inferior
  bottomNavigation: {
    flexDirection: "row",
    backgroundColor: COLORS.primary,
    paddingVertical: SPACING.sm,
    paddingHorizontal: SPACING.xxxl + 8,
    paddingBottom: SPACING.sm,
    justifyContent: "space-around",
    ...SHADOWS.medium,
  },
  bottomButton: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: SPACING.sm,
    paddingHorizontal: SPACING.sm,
    borderRadius: 10,
    backgroundColor: "rgba(255, 255, 255, 0.12)",
    minWidth: 44,
    minHeight: 44,
  },
});
