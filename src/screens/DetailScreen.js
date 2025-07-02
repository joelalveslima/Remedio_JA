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

export default function DetailScreen({ navigation, route }) {
  const { unidade } = route.params;
  const [userLocation, setUserLocation] = useState(null);
  const [distanciaCalculada, setDistanciaCalculada] = useState(null);
  const [locationStatus, setLocationStatus] = useState("verificando"); // verificando, ativa, inativa, negada

  useEffect(() => {
    getCurrentLocation();
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

  const getCurrentLocation = async () => {
    try {
      setLocationStatus("verificando");
      const { status } = await Location.requestForegroundPermissionsAsync();

      if (status === "granted") {
        const location = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.Balanced,
          timeout: 15000,
        });
        setUserLocation(location.coords);
        setLocationStatus("ativa");
      } else {
        setLocationStatus("negada");
      }
    } catch (error) {
      console.error("Erro ao obter localização:", error);
      setLocationStatus("inativa");
      // Mantém a distância padrão se não conseguir obter a localização
    }
  };

  // Função para obter status da localização
  const getLocationStatus = () => {
    switch (locationStatus) {
      case "verificando":
        return "(verificando...)";
      case "ativa":
        return "(calculado)";
      case "inativa":
        return "(GPS desativado)";
      case "negada":
        return "(permissão negada)";
      default:
        return "(estimado)";
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
          {item.disponivel ? "Disponível" : "Indisponível"}
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
      <Ionicons name="medical-outline" size={20} color="#21796A" /> Remédios
      Disponíveis
    </Text>
  );

  // Função para renderizar as informações principais
  const renderMainInfo = () => (
    <>
      {/* Informações principais */}
      <View style={styles.mainCard}>
        <Text style={styles.unitName}>{unidade.nome}</Text>

        <View style={styles.infoRow}>
          <Ionicons name="location-outline" size={20} color="#21796A" />
          <Text style={styles.infoText}>
            {distanciaCalculada !== null
              ? `${distanciaCalculada} km ${getLocationStatus()}`
              : unidade.distanciaCalculada
              ? `${unidade.distanciaCalculada} km (calculado)`
              : `${unidade.distancia} km (estimado)`}
          </Text>
        </View>

        <View style={styles.infoRow}>
          <Ionicons name="time-outline" size={20} color="#21796A" />
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
            <Ionicons name="map-outline" size={20} color="#21796A" />
            <Text style={styles.actionButtonText}>Ver no Mapa</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionButton} onPress={handleCall}>
            <Ionicons name="call-outline" size={20} color="#21796A" />
            <Text style={styles.actionButtonText}>Ligar</Text>
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
            name="information-circle-outline"
            size={20}
            color="#21796A"
          />{" "}
          Informações Importantes
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
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Detalhes da Unidade</Text>
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
  container: {
    flex: 1,
    backgroundColor: "#F6F8F9",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#21796A",
    paddingTop: 50,
    paddingBottom: 20,
    paddingHorizontal: 24,
    elevation: 4,
    shadowColor: "#21796A",
    shadowOpacity: 0.12,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
  },
  headerTitle: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "bold",
    flex: 1,
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    padding: 20,
    paddingBottom: 40, // Espaçamento extra para garantir que o footer seja visível
  },
  mainCard: {
    backgroundColor: "#fff",
    borderRadius: 0,
    padding: 24,
    marginBottom: 16,
    elevation: 3,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
  },
  unitName: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#21796A",
    marginBottom: 16,
    textAlign: "center",
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  infoText: {
    fontSize: 16,
    color: "#333",
    marginLeft: 8,
    fontWeight: "500",
  },
  actionButtons: {
    flexDirection: "row",
    marginTop: 20,
    justifyContent: "space-around",
  },
  actionButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F0F9F7",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: "#21796A",
  },
  actionButtonText: {
    color: "#21796A",
    fontWeight: "600",
    marginLeft: 8,
  },
  medicineCard: {
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 20,
    marginBottom: 16,
    elevation: 3,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#21796A",
    marginBottom: 16,
  },
  medicineItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#F0F0F0",
  },
  medicineInfo: {
    flex: 1,
  },
  medicineName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
  },
  medicineStatus: {
    fontSize: 14,
    fontWeight: "500",
    marginTop: 2,
  },
  infoCard: {
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 20,
    elevation: 3,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
  },
  footerContainer: {
    marginTop: 16,
    marginBottom: 20,
  },
  infoDescription: {
    fontSize: 14,
    color: "#666",
    lineHeight: 20,
  },
});
