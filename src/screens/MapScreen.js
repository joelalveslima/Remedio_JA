import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Dimensions,
  FlatList,
  Linking,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import * as Location from "expo-location";

const { width, height } = Dimensions.get("window");

export default function MapScreen({ navigation, route }) {
  const { unidades, remedioFiltro } = route.params;
  const [userLocation, setUserLocation] = useState(null);
  const [locationPermission, setLocationPermission] = useState(null);
  const [isLoadingLocation, setIsLoadingLocation] = useState(false);

  useEffect(() => {
    requestLocationPermission();
  }, []);

  const requestLocationPermission = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      setLocationPermission(status === "granted");

      if (status !== "granted") {
        Alert.alert(
          "Permissão Negada",
          "Precisamos da sua localização para mostrar as unidades mais próximas.",
          [
            { text: "Cancelar", style: "cancel" },
            { text: "Tentar Novamente", onPress: requestLocationPermission },
          ]
        );
        return;
      }
    } catch (error) {
      console.error("Erro ao solicitar permissão de localização:", error);
    }
  };

  const getCurrentLocation = async () => {
    if (!locationPermission) {
      Alert.alert(
        "Permissão Necessária",
        "Permita o acesso à localização para usar esta funcionalidade."
      );
      return;
    }

    setIsLoadingLocation(true);
    try {
      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
        timeout: 10000,
      });

      setUserLocation(location.coords);

      //   Alert.alert(
      //     "Localização Encontrada!",
      //     `Latitude: ${location.coords.latitude.toFixed(
      //       6
      //     )}\nLongitude: ${location.coords.longitude.toFixed(6)}`,
      //     [
      //       { text: "OK" },
      //       {
      //         text: "Ver no Mapa",
      //         onPress: () => openUserLocationInMaps(location.coords),
      //       },
      //     ]
      //   );
    } catch (error) {
      Alert.alert(
        "Erro de Localização",
        "Não foi possível obter sua localização. Verifique se o GPS está ativado.",
        [{ text: "OK" }]
      );
      console.error("Erro ao obter localização:", error);
    } finally {
      setIsLoadingLocation(false);
    }
  };

  const openUserLocationInMaps = (coords) => {
    const url = `https://www.google.com/maps/search/?api=1&query=${coords.latitude},${coords.longitude}`;
    Linking.openURL(url);
  };

  const calculateDistance = (lat1, lon1, lat2, lon2) => {
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
    return distance.toFixed(1);
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
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>
          {remedioFiltro ? `Mapa - ${remedioFiltro}` : "Todas as Unidades"}
        </Text>
      </View>

      {/* Simulação do Mapa com Lista */}
      <View style={styles.mapContainer}>
        <View style={styles.mapPlaceholder}>
          <Ionicons name="map-outline" size={80} color="#21796A" />
          <Text style={styles.mapPlaceholderText}>Visualização do Mapa</Text>
          <Text style={styles.mapSubText}>
            Toque em uma unidade para ver no Google Maps
          </Text>

          {/* Botão de Localização */}
          <TouchableOpacity
            style={styles.locationButton}
            onPress={getCurrentLocation}
            disabled={isLoadingLocation}
          >
            <Ionicons
              name={isLoadingLocation ? "refresh" : "location"}
              size={20}
              color="#fff"
              style={
                isLoadingLocation ? { transform: [{ rotate: "45deg" }] } : {}
              }
            />
            <Text style={styles.locationButtonText}>
              {isLoadingLocation ? "Localizando..." : "Minha Localização"}
            </Text>
          </TouchableOpacity>

          {userLocation && (
            <View style={styles.userLocationInfo}>
              <Ionicons name="checkmark-circle" size={16} color="#21796A" />
              <Text style={styles.userLocationText}>
                Localização obtida! Unidades ordenadas por distância.
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
                  <Text style={styles.unitDistance}>
                    {item.distanciaCalculada
                      ? `${item.distanciaCalculada} km`
                      : item.distancia}
                  </Text>
                  {item.distanciaCalculada && (
                    <Text style={styles.calculatedLabel}>(calculado)</Text>
                  )}
                </View>
                <Text
                  style={[
                    styles.unitStatus,
                    { color: item.disponivel ? "#21796A" : "#B00020" },
                  ]}
                >
                  {item.remedio ? `${item.remedio} - ` : ""}
                  {item.disponivel ? "Disponível" : "Indisponível"}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.mapButton}
                onPress={() => handleOpenMaps(item)}
              >
                <Ionicons name="map" size={20} color="#21796A" />
              </TouchableOpacity>
            </View>
          )}
        />
      </View>

      {/* Info footer */}
      <View style={styles.footer}>
        <Text style={styles.footerText}>
          {unidadesComDistancia.length} unidade
          {unidadesComDistancia.length !== 1 ? "s" : ""} encontrada
          {unidadesComDistancia.length !== 1 ? "s" : ""}
          {userLocation && " (ordenadas por distância)"}
        </Text>
        <View style={styles.legendContainer}>
          <View style={styles.legendItem}>
            <View style={[styles.legendDot, { backgroundColor: "#21796A" }]} />
            <Text style={styles.legendText}>Disponível</Text>
          </View>
          <View style={styles.legendItem}>
            <View style={[styles.legendDot, { backgroundColor: "#B00020" }]} />
            <Text style={styles.legendText}>Indisponível</Text>
          </View>
        </View>
      </View>
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
  map: {
    flex: 1,
    width: width,
    height: height,
  },
  mapContainer: {
    flex: 1,
    backgroundColor: "#F0F9F7",
  },
  mapPlaceholder: {
    backgroundColor: "#fff",
    paddingVertical: 30,
    alignItems: "center",
    marginBottom: 10,
    elevation: 2,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
  mapPlaceholderText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#21796A",
    marginTop: 10,
  },
  mapSubText: {
    fontSize: 14,
    color: "#666",
    marginTop: 5,
    textAlign: "center",
  },
  unitsList: {
    flex: 1,
    paddingHorizontal: 16,
  },
  unitCard: {
    backgroundColor: "#fff",
    borderRadius: 15,
    padding: 16,
    marginBottom: 12,
    flexDirection: "row",
    alignItems: "center",
    elevation: 2,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
  unitInfo: {
    flex: 1,
  },
  unitName: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#21796A",
    marginBottom: 4,
  },
  unitDistance: {
    fontSize: 14,
    color: "#666",
    marginBottom: 2,
  },
  unitStatus: {
    fontSize: 14,
    fontWeight: "500",
  },
  mapButton: {
    backgroundColor: "#F0F9F7",
    padding: 12,
    borderRadius: 10,
    marginLeft: 12,
  },
  locationButton: {
    backgroundColor: "#21796A",
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 25,
    marginTop: 15,
    elevation: 2,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
  locationButtonText: {
    color: "#fff",
    fontWeight: "600",
    marginLeft: 8,
    fontSize: 14,
  },
  userLocationInfo: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 10,
    backgroundColor: "#F0F9F7",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 15,
  },
  userLocationText: {
    color: "#21796A",
    fontSize: 12,
    marginLeft: 6,
    fontWeight: "500",
  },
  distanceContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 2,
  },
  calculatedLabel: {
    fontSize: 12,
    color: "#21796A",
    marginLeft: 6,
    fontStyle: "italic",
  },
  markerContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    elevation: 3,
    shadowColor: "#000",
    shadowOpacity: 0.3,
    shadowRadius: 3,
    shadowOffset: { width: 0, height: 2 },
  },
  footer: {
    backgroundColor: "#fff",
    padding: 16,
    elevation: 4,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: -2 },
  },
  footerText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#21796A",
    textAlign: "center",
    marginBottom: 8,
  },
  legendContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  legendItem: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: 12,
  },
  legendDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 6,
  },
  legendText: {
    fontSize: 14,
    color: "#666",
  },
});
