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
import { Ionicons } from "@expo/vector-icons";
import * as Location from "expo-location";
import texts from "../localization";
import {
  COLORS,
  FONT_SIZES,
  SPACING,
  SHADOWS,
  TEXT_STYLES,
} from "../constants/theme";
import { calculateDistance } from "../utils/locationUtils";

export default function MapScreen({ navigation, route }) {
  const { unidades, remedioFiltro, showAllUnits = false } = route.params;
  const [userLocation, setUserLocation] = useState(null);
  const [locationStatus, setLocationStatus] = useState("verificando"); // verificando, ativa, inativa, negada
  const [locationWatcher, setLocationWatcher] = useState(null);

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
          // Localização obtida com sucesso - GPS está ativo
          setUserLocation(location.coords);
          if (locationStatus !== "ativa") {
            setLocationStatus("ativa");
          }
        }
      );

      setLocationWatcher(watcher);

      // Tentar obter localização inicial
      getCurrentLocation();
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

  const requestLocationPermission = async () => {
    try {
      setLocationStatus("verificando");
      const { status } = await Location.requestForegroundPermissionsAsync();

      if (status === "granted") {
        setupLocationWatcher(); // Configurar watcher após obter permissão
      } else {
        setLocationStatus("negada");
      }
    } catch (error) {
      setLocationStatus("inativa");
    }
  };

  const getCurrentLocation = async () => {
    try {
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
        timeout: 10000,
      });
      setUserLocation(location.coords);
      setLocationStatus("ativa");
    } catch (error) {
      setLocationStatus("inativa");
      // Parar o watcher se houver erro
      if (locationWatcher) {
        locationWatcher.remove();
        setLocationWatcher(null);
      }
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
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={{ marginRight: 16 }}
        >
          <Ionicons name="chevron-back" size={24} color={COLORS.iconWhite} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>
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
                      { color: item.disponivel ? "#21796A" : "#B00020" },
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
                style={[styles.legendDot, { backgroundColor: "#21796A" }]}
              />
              <Text style={styles.legendText}>{texts.available}</Text>
            </View>
            <View style={styles.legendItem}>
              <View
                style={[styles.legendDot, { backgroundColor: "#B00020" }]}
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
          <Ionicons name="chevron-back" size={24} color={COLORS.iconWhite} />
          <Text style={styles.bottomButtonText}>{texts.back}</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.bottomButton}
          onPress={() => navigation.navigate("Home")}
        >
          <Ionicons name="home" size={24} color={COLORS.iconWhite} />
          <Text style={styles.bottomButtonText}>{texts.home}</Text>
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
    paddingTop: Platform.OS === "ios" ? 60 : 50,
    paddingBottom: SPACING.xl,
    paddingHorizontal: SPACING.xl,
    ...SHADOWS.heavy,
  },
  headerTitle: {
    ...TEXT_STYLES.headerTitle,
    flex: 1,
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
    paddingVertical: Platform.OS === "ios" ? SPACING.lg + 4 : SPACING.lg,
    paddingHorizontal: SPACING.xl,
    paddingBottom: Platform.OS === "ios" ? SPACING.xxxl : SPACING.lg,
    ...SHADOWS.heavy,
  },
  bottomButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.lg,
    marginHorizontal: SPACING.sm,
    borderRadius: Platform.OS === "ios" ? 12 : 8,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
  },
  bottomButtonText: {
    ...TEXT_STYLES.buttonText,
    color: COLORS.iconWhite,
    marginLeft: SPACING.sm,
    fontSize: FONT_SIZES.base,
    fontWeight: Platform.OS === "ios" ? "600" : "bold",
  },
});
