import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  FlatList,
  Linking,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import * as Location from "expo-location";
import texts from "../localization";
import {
  COLORS,
  FONTS,
  FONT_SIZES,
  SPACING,
  SHADOWS,
  TEXT_STYLES,
} from "../constants/theme";

export default function DetailScreen({ navigation, route }) {
  const { unidade } = route.params;
  const [userLocation, setUserLocation] = useState(null);
  const [distanciaCalculada, setDistanciaCalculada] = useState(null);
  const [locationStatus, setLocationStatus] = useState("verificando"); // verificando, ativa, inativa, negada
  const [locationWatcher, setLocationWatcher] = useState(null);

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

  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    try {
      // Validação dos parâmetros
      if (!lat1 || !lon1 || !lat2 || !lon2) {
        return null;
      }

      const R = 6371; // Raio da Terra em km
      const dLat = ((lat2 - lat1) * Math.PI) / 180;
      const dLon = ((lon2 - lon1) * Math.PI) / 180;

      const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos((lat1 * Math.PI) / 180) *
          Math.cos((lat2 * Math.PI) / 180) *
          Math.sin(dLon / 2) *
          Math.sin(dLon / 2);

      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
      const distance = R * c;

      // Retorna a distância formatada com 1 casa decimal
      return parseFloat(distance.toFixed(1));
    } catch (error) {
      console.error("Erro ao calcular distância:", error);
      return null;
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

  // Função para renderizar cada item de remédio
  const renderMedicineItem = ({ item, index }) => (
    <View style={styles.medicineItem}>
      <View style={styles.medicineInfo}>
        <Text style={styles.medicineName}>{item.remedio}</Text>
        <Text
          style={[
            styles.medicineStatus,
            { color: item.disponivel ? "#21796A" : "#B00020" },
          ]}
        >
          {item.disponivel ? texts.available : texts.unavailable}
        </Text>
      </View>
      <Ionicons
        name={item.disponivel ? "checkmark-circle" : "close-circle"}
        size={24}
        color={item.disponivel ? "#21796A" : "#B00020"}
      />
    </View>
  );

  // Função para renderizar o header da lista de medicamentos
  const renderMedicineHeader = () => (
    <Text style={styles.sectionTitle}>
      <Ionicons name="medical" size={20} color={COLORS.iconPrimary} />{" "}
      {texts.medicines}
    </Text>
  );

  // Função para renderizar as informações principais
  const renderMainInfo = () => (
    <>
      {/* Informações principais */}
      <View style={styles.mainCard}>
        <Text style={styles.unitName}>{unidade.nome}</Text>

        <View style={styles.infoRow}>
          <Ionicons name="location" size={20} color={COLORS.iconLocation} />
          <Text style={styles.infoText}>
            {distanciaCalculada !== null
              ? `${distanciaCalculada} km`
              : unidade.distanciaCalculada
              ? `${unidade.distanciaCalculada} km`
              : `${unidade.distancia} km`}
          </Text>
        </View>

        <View style={styles.infoRow}>
          <Ionicons name="time" size={20} color={COLORS.iconTime} />
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
            <Ionicons name="navigate" size={20} color={COLORS.iconPrimary} />
            <Text style={styles.actionButtonText}>{texts.viewOnMap}</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionButton} onPress={handleCall}>
            <Ionicons name="call" size={20} color={COLORS.iconPrimary} />
            <Text style={styles.actionButtonText}>{texts.call}</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Disponibilidade de remédios */}
      <View style={styles.medicineCard}>{renderMedicineHeader()}</View>
    </>
  );

  // Função para renderizar o footer com informações adicionais
  const renderFooter = () => (
    <View style={styles.footerContainer}>
      <View style={styles.infoCard}>
        <Text style={styles.sectionTitle}>
          <Ionicons
            name="information-circle"
            size={20}
            color={COLORS.iconPrimary}
          />{" "}
          {texts.importantInfo}
        </Text>

        <Text style={styles.infoDescription}>
          • Leve um documento de identidade com foto{"\n"}• Cartão SUS é
          obrigatório{"\n"}• Receita médica necessária para medicamentos
          controlados{"\n"}• Disponibilidade sujeita a alterações
        </Text>
      </View>
    </View>
  );

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
        <Text style={styles.headerTitle}>{texts.unitDetails}</Text>
      </View>

      <FlatList
        data={unidade.disponibilidade}
        keyExtractor={(item, index) => `${item.remedio}-${index}`}
        renderItem={renderMedicineItem}
        ListHeaderComponent={renderMainInfo}
        ListFooterComponent={renderFooter}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.contentContainer}
        style={styles.content}
        ItemSeparatorComponent={() => <View style={{ height: 1 }} />}
        bounces={true}
        scrollEnabled={true}
        nestedScrollEnabled={true}
      />
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
    paddingTop: 50,
    paddingBottom: SPACING.xl,
    paddingHorizontal: SPACING.xl,
    ...SHADOWS.heavy,
  },
  headerTitle: {
    ...TEXT_STYLES.headerTitle,
    flex: 1,
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
    ...TEXT_STYLES.sectionTitle,
    fontSize: FONT_SIZES.xxl,
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
    lineHeight: 20,
  },
});
