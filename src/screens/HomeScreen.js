import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  FlatList,
  Platform,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import * as Location from "expo-location";
import texts from "../localization";
import {
  COLORS,
  FONTS,
  FONT_SIZES,
  ICON_SIZES,
  SPACING,
  SHADOWS,
  TEXT_STYLES,
} from "../constants/theme";
import { unidades } from "../data/unidades";
import { calculateDistance } from "../utils/locationUtils";

export default function HomeScreen({ navigation }) {
  const [busca, setBusca] = useState("");
  const [userLocation, setUserLocation] = useState(null);
  const [locationStatus, setLocationStatus] = useState("verificando"); // verificando, ativa, inativa, negada
  const [locationWatcher, setLocationWatcher] = useState(null);

  useEffect(() => {
    requestLocationPermission();
    // Listener para mudanças de permissão de localização
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

  // Função para obter status da localização
  const getLocationStatus = () => {
    switch (locationStatus) {
      case "verificando":
        return {
          text: texts.verifyingLocation,
          icon: "radio-button-on",
          color: "#21796A",
        };
      case "ativa":
        return {
          text: texts.gpsActive,
          icon: "checkmark-circle",
          color: "#4CAF50",
        };
      case "inativa":
        return {
          text: texts.gpsDeactivated,
          icon: "close-circle",
          color: "#FF9800",
        };
      case "negada":
        return {
          text: texts.gpsDeactivated,
          icon: "alert-circle",
          color: "#FF9800",
        };
      default:
        return {
          text: texts.gpsDeactivated,
          icon: "help-circle",
          color: "#888",
        };
    }
  };

  // Calcula distâncias reais se a localização estiver disponível
  const unidadesComDistancia = userLocation
    ? unidades.map((unidade) => {
        const distanciaReal = calculateDistance(
          userLocation.latitude,
          userLocation.longitude,
          unidade.latitude,
          unidade.longitude
        );

        // Se não conseguiu calcular, usa a distância estimada do array
        return {
          ...unidade,
          distancia: distanciaReal !== null ? distanciaReal : unidade.distancia,
          distanciaCalculada: distanciaReal,
          isDistanciaReal: distanciaReal !== null, // Só marca como real se conseguiu calcular
        };
      })
    : unidades.map((unidade) => ({
        ...unidade,
        isDistanciaReal: false, // Flag para indicar que é distância estimada
      }));

  // Função para normalizar strings para busca segura
  const normalizeSearchString = (str) => {
    return str
      .toLowerCase()
      .normalize("NFD") // Decompor caracteres acentuados
      .replace(/[\u0300-\u036f]/g, "") // Remover acentos
      .replace(/[^\w\s]/g, "") // Manter apenas letras, números e espaços
      .trim();
  };

  // Filtra as unidades conforme o remédio pesquisado - apenas unidades com o remédio DISPONÍVEL
  const unidadesFiltradas =
    busca.trim().length === 0
      ? []
      : unidadesComDistancia
          .map((u) => {
            const searchTerm = normalizeSearchString(busca);
            const info = u.disponibilidade.find((d) => {
              const medicineName = normalizeSearchString(d.remedio);
              // Só inclui se o remédio existe E está disponível
              return medicineName.includes(searchTerm) && d.disponivel === true;
            });
            if (info) {
              return {
                ...u,
                remedio: info.remedio,
                disponivel: info.disponivel,
              };
            }
            return null;
          })
          .filter(Boolean)
          .sort((a, b) => {
            // Ordena pela distância (seja calculada ou estimada)
            return parseFloat(a.distancia) - parseFloat(b.distancia);
          });

  const handleVerNoMapa = () => {
    // Se não há busca, envia todas as unidades ordenadas por distância (usando GPS se disponível)
    if (busca.trim().length === 0) {
      const unidadesOrdenadas = [...unidadesComDistancia].sort((a, b) => {
        return parseFloat(a.distancia) - parseFloat(b.distancia);
      });

      navigation.navigate("Mapa", {
        unidades: unidadesOrdenadas,
        remedioFiltro: "",
        showAllUnits: true, // Flag para indicar que deve mostrar todas as unidades
      });
    } else {
      // Se há busca, envia apenas as unidades filtradas
      navigation.navigate("Mapa", {
        unidades: unidadesFiltradas,
        remedioFiltro: busca,
        showAllUnits: false,
      });
    }
  };

  const handleCardPress = (unidade) => {
    navigation.navigate("Detalhes", { unidade });
  };

  // Função para validar e sanitizar o input de busca
  const handleBuscaChange = (text) => {
    // Regex para permitir apenas letras, números, espaços e alguns caracteres especiais comuns em nomes de medicamentos
    const allowedCharsRegex = /^[a-zA-ZÀ-ÿ0-9\s\+\-\(\)\.]*$/;

    // Lista de padrões perigosos para prevenir ataques
    const dangerousPatterns = [
      /<script/i, // Tags script
      /javascript:/i, // Javascript protocol
      /on\w+=/i, // Event handlers
      /style\s*=/i, // Style injection
      /expr\w*\(/i, // Expression functions
      /data:/i, // Data URLs
      /vb\w*script/i, // VBScript
    ];

    // Remove caracteres potencialmente perigosos
    const sanitizedText = text
      .replace(/[<>\"'&\\\/\{\}\[\]]/g, "") // Remove caracteres HTML perigosos
      .replace(/;/g, "") // Remove ponto e vírgula
      .substring(0, 50); // Limita a 50 caracteres

    // Verifica se contém padrões perigosos
    const hasDangerousPattern = dangerousPatterns.some((pattern) =>
      pattern.test(sanitizedText)
    );

    // Só atualiza se passar na validação regex e não contiver padrões perigosos
    if (allowedCharsRegex.test(sanitizedText) && !hasDangerousPattern) {
      setBusca(sanitizedText);
    }
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Ionicons
          name="medical"
          size={40}
          color={COLORS.iconWhite}
          style={{ marginRight: 10 }}
        />
        <View style={{ flex: 1 }}>
          <Text style={styles.headerTitle}>{texts.appName}</Text>
          <View style={styles.locationIndicator}>
            <Ionicons
              name={getLocationStatus().icon}
              size={12}
              color={getLocationStatus().color}
            />
            <Text
              style={[
                styles.locationText,
                { color: getLocationStatus().color },
              ]}
            >
              {getLocationStatus().text}
            </Text>
          </View>
        </View>
      </View>

      {/* Busca com ícone */}
      <View style={styles.searchContainer}>
        <Ionicons
          name="search"
          size={ICON_SIZES.xl}
          color={COLORS.textLight}
          style={styles.searchIcon}
        />
        <TextInput
          style={styles.input}
          placeholder={texts.searchPlaceholder}
          placeholderTextColor={COLORS.textLight}
          value={busca}
          onChangeText={handleBuscaChange}
          maxLength={50}
          autoCapitalize="words"
          autoCorrect={false}
          textContentType="none"
          autoComplete="off"
        />
        {busca.length > 0 && (
          <TouchableOpacity
            style={styles.clearButton}
            onPress={() => setBusca("")}
          >
            <Ionicons
              name="close-circle"
              size={ICON_SIZES.lg}
              color={COLORS.textLight}
            />
          </TouchableOpacity>
        )}
      </View>

      {/* Botões de ação */}
      <View style={styles.actionButtonsContainer}>
        <TouchableOpacity style={styles.mapButton} onPress={handleVerNoMapa}>
          <Ionicons
            name="map-outline"
            size={18}
            color={COLORS.iconPrimary}
            style={{ marginRight: 6 }}
          />
          <Text style={styles.mapButtonText}>{texts.viewOnMap}</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.newsButton}
          onPress={() => navigation.navigate("Noticias")}
        >
          <Ionicons
            name="newspaper-outline"
            size={18}
            color={COLORS.iconWhite}
            style={{ marginRight: 6 }}
          />
          <Text style={styles.newsButtonText}>{texts.healthNews}</Text>
        </TouchableOpacity>
      </View>

      {/* Lista de unidades filtradas */}
      <FlatList
        showsVerticalScrollIndicator={false}
        data={unidadesFiltradas}
        keyExtractor={(item) => item.id}
        style={{ width: "100%" }}
        contentContainerStyle={{ alignItems: "center" }}
        ListEmptyComponent={
          busca.trim().length > 0 ? (
            <View style={styles.emptyStateContainer}>
              <Ionicons
                name="medical-outline"
                size={60}
                color={COLORS.textLight}
                style={styles.emptyStateIcon}
              />
              <Text style={styles.emptyStateTitle}>{texts.noUnitsFound}</Text>
              <Text style={styles.emptyStateSubtitle}>
                {texts.noUnitsFoundSubtitle.replace("{search}", busca)}
              </Text>
            </View>
          ) : (
            <View style={styles.emptyStateContainer}>
              <Ionicons
                name="search-outline"
                size={60}
                color={COLORS.textLight}
                style={styles.emptyStateIcon}
              />
              <Text style={styles.emptyStateTitle}>{texts.searchMedicine}</Text>
              <Text style={styles.emptyStateSubtitle}>
                {texts.searchInstructions}
              </Text>
            </View>
          )
        }
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.card}
            onPress={() => handleCardPress(item)}
            activeOpacity={0.7}
          >
            <View style={styles.cardContent}>
              <Text
                style={styles.cardTitle}
                numberOfLines={2}
                ellipsizeMode="tail"
              >
                {item.nome}
              </Text>

              <View style={styles.cardInfoRow}>
                <Ionicons
                  name="location"
                  size={ICON_SIZES.sm}
                  color={COLORS.iconLocation}
                />
                <Text style={styles.cardDistance}>{item.distancia} km</Text>
              </View>

              <View style={styles.cardInfoRow}>
                <Ionicons
                  name="time"
                  size={ICON_SIZES.sm}
                  color={COLORS.iconTime}
                />
                <Text
                  style={styles.cardHorario}
                  numberOfLines={1}
                  ellipsizeMode="tail"
                >
                  {typeof item.horario === "object"
                    ? `${item.horario.semana.inicio} ${texts.to} ${item.horario.semana.fim}`
                    : item.horario}
                </Text>
              </View>
            </View>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  // Container principal
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    alignItems: "center",
    paddingTop: Platform.OS === "ios" ? 80 : 60,
  },

  // Header
  header: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.primary,
    width: "100%",
    paddingVertical: SPACING.xxxl,
    paddingHorizontal: SPACING.xl,
    borderBottomLeftRadius: SPACING.xxxl,
    borderBottomRightRadius: SPACING.xxxl,
    marginBottom: SPACING.lg,
    ...SHADOWS.heavy,
  },
  headerTitle: {
    ...TEXT_STYLES.headerTitle,
  },
  locationIndicator: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: SPACING.xs,
  },
  locationText: {
    ...TEXT_STYLES.locationText,
    marginLeft: SPACING.xs,
  },

  // Busca
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    width: "85%",
    backgroundColor: COLORS.cardBackground,
    borderRadius: Platform.OS === "ios" ? 22 : 18,
    marginTop: -30,
    marginBottom: SPACING.base,
    ...SHADOWS.light,
    borderWidth: Platform.OS === "ios" ? 0 : 1,
    borderColor: COLORS.border,
    paddingHorizontal: SPACING.lg,
  },
  searchIcon: {
    marginRight: SPACING.base,
  },
  input: {
    flex: 1,
    paddingVertical: Platform.OS === "ios" ? SPACING.lg + 2 : SPACING.lg,
    fontSize: FONT_SIZES.lg,
    fontFamily: Platform.OS === "ios" ? FONTS.semiBold : FONTS.regular,
    color: COLORS.textPrimary,
    fontWeight: Platform.OS === "ios" ? "500" : "400",
  },
  clearButton: {
    padding: SPACING.xs,
    marginLeft: SPACING.sm,
  },

  // Botões de ação
  actionButtonsContainer: {
    flexDirection: "row",
    marginBottom: SPACING.lg,
    paddingHorizontal: SPACING.md,
    gap: SPACING.md,
  },
  mapButton: {
    flex: 1,
    borderWidth: 1,
    borderColor: COLORS.primary,
    borderRadius: 22,
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.lg,
    backgroundColor: COLORS.cardBackground,
    elevation: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  mapButtonText: {
    ...TEXT_STYLES.buttonText,
  },
  newsButton: {
    flex: 1,
    backgroundColor: COLORS.primary,
    borderRadius: 22,
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.lg,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    ...SHADOWS.light,
  },
  newsButtonText: {
    ...TEXT_STYLES.buttonText,
    color: COLORS.iconWhite,
    fontWeight: Platform.OS === "ios" ? "600" : "bold",
  },

  // Cards das unidades
  card: {
    backgroundColor: COLORS.cardBackground,
    width: 350,
    height: 100,
    borderRadius: Platform.OS === "ios" ? SPACING.lg : SPACING.base,
    padding: SPACING.lg,
    marginBottom: SPACING.base,
    ...SHADOWS.light,
    borderWidth: Platform.OS === "ios" ? 0 : 1,
    borderColor: COLORS.border,
  },
  cardContent: {
    flex: 1,
  },
  cardTitle: {
    ...TEXT_STYLES.cardTitle,
    fontSize: FONT_SIZES.lg,
    marginBottom: SPACING.md,
    fontWeight: Platform.OS === "ios" ? "600" : "bold",
  },
  cardInfoRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: SPACING.xs,
  },
  cardDistance: {
    ...TEXT_STYLES.distanceText,
    fontSize: FONT_SIZES.base,
    color: COLORS.textSecondary,
    marginLeft: SPACING.xs,
  },
  cardHorario: {
    ...TEXT_STYLES.timeText,
    marginLeft: SPACING.xs,
  },

  // Estado vazio
  emptyStateContainer: {
    alignItems: "center",
    paddingHorizontal: SPACING.xl,
    paddingVertical: SPACING.xxxl,
    marginTop: SPACING.xl,
  },
  emptyStateIcon: {
    marginBottom: SPACING.lg,
    opacity: 0.6,
  },
  emptyStateTitle: {
    ...TEXT_STYLES.sectionTitle,
    fontSize: FONT_SIZES.xl,
    textAlign: "center",
    marginBottom: SPACING.md,
  },
  emptyStateSubtitle: {
    ...TEXT_STYLES.descriptionText,
    textAlign: "center",
    lineHeight: 20,
  },
});
