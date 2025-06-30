import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  FlatList,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import * as Location from "expo-location";

const unidades = [
  {
    id: "1",
    nome: "Centro de Saúde Ary Rodrigues",
    distancia: 2.1,
    latitude: -9.978540834183534,
    longitude: -67.80469431534507,
    horario: {
      semana: { inicio: "07:00", fim: "17:00" },
    },
    disponibilidade: [
      { remedio: "Dipirona", disponivel: true },
      { remedio: "Amoxicilina", disponivel: true },
      { remedio: "Losartana", disponivel: false },
      { remedio: "Captopril", disponivel: true },
      { remedio: "Cetoconazol", disponivel: false },
    ],
  },
  {
    id: "2",
    nome: "Centro de Saúde Barral y Barral",
    distancia: 3.5,
    latitude: -9.9701,
    longitude: -67.825,
    horario: {
      semana: { inicio: "07:00", fim: "17:00" },
    },
    disponibilidade: [
      { remedio: "Paracetamol", disponivel: true },
      { remedio: "Metformina", disponivel: true },
      { remedio: "Omeprazol", disponivel: false },
      { remedio: "Ibuprofeno", disponivel: true },
      { remedio: "Prednisona", disponivel: false },
    ],
  },
  {
    id: "3",
    nome: "Centro de Saúde Dr. Mário Maia",
    distancia: 4.0,
    latitude: -9.9512,
    longitude: -67.8043,
    horario: {
      semana: { inicio: "07:00", fim: "17:00" },
    },
    disponibilidade: [
      { remedio: "Ibuprofeno", disponivel: true },
      { remedio: "Enalapril", disponivel: false },
      { remedio: "Simeticona", disponivel: true },
      { remedio: "Ranitidina", disponivel: true },
      { remedio: "Loratadina", disponivel: false },
    ],
  },
  {
    id: "4",
    nome: "Centro de Saúde Gentil Perdomo da Rocha",
    distancia: 3.2,
    latitude: -9.96,
    longitude: -67.8087,
    horario: {
      semana: { inicio: "07:00", fim: "17:00" },
    },
    disponibilidade: [
      { remedio: "Cetoconazol", disponivel: true },
      { remedio: "Salbutamol", disponivel: true },
      { remedio: "Dipirona", disponivel: false },
      { remedio: "Fluconazol", disponivel: true },
      { remedio: "Nistatina", disponivel: false },
    ],
  },
  {
    id: "5",
    nome: "Centro de Saúde Souza Araújo",
    distancia: 8.7,
    latitude: -9.9,
    longitude: -67.86,
    horario: {
      semana: { inicio: "07:00", fim: "17:00" },
    },
    disponibilidade: [
      { remedio: "Azitromicina", disponivel: false },
      { remedio: "Ibuprofeno", disponivel: true },
      { remedio: "Hidroclorotiazida", disponivel: true },
      { remedio: "Clonazepam", disponivel: false },
      { remedio: "Simeticona", disponivel: true },
    ],
  },
  {
    id: "6",
    nome: "Centro de Saúde Vila Ivonete",
    distancia: 2.8,
    latitude: -9.982,
    longitude: -67.8305,
    horario: {
      semana: { inicio: "07:00", fim: "17:00" },
    },
    disponibilidade: [
      { remedio: "Paracetamol", disponivel: true },
      { remedio: "Loratadina", disponivel: false },
      { remedio: "Clorfeniramina", disponivel: true },
      { remedio: "Losartana", disponivel: true },
      { remedio: "Sulfametoxazol + Trimetoprim", disponivel: false },
    ],
  },
  {
    id: "7",
    nome: "USF Luana Freitas II",
    distancia: 3.9,
    latitude: -9.949358367090992,
    longitude: -67.83444849295196,
    horario: {
      semana: { inicio: "07:00", fim: "17:00" },
    },
    disponibilidade: [
      { remedio: "Omeprazol", disponivel: true },
      { remedio: "Furosemida", disponivel: false },
      { remedio: "Amoxicilina", disponivel: true },
      { remedio: "Nimesulida", disponivel: false },
      { remedio: "Cefalexina", disponivel: true },
    ],
  },
  {
    id: "8",
    nome: "URAP Francisco Roney Rodrigues Meireles",
    distancia: 5.5,
    latitude: -9.98,
    longitude: -67.845,
    horario: {
      semana: { inicio: "07:00", fim: "17:00" },
      sabado: { inicio: "07:00", fim: "17:00" },
      domingo: "fechado",
    },
    disponibilidade: [
      { remedio: "Losartana", disponivel: true },
      { remedio: "Dipirona", disponivel: false },
      { remedio: "Ranitidina", disponivel: true },
      { remedio: "Paracetamol", disponivel: false },
      { remedio: "Benzetacil", disponivel: true },
    ],
  },
  {
    id: "9",
    nome: "URAP Augusto Hidalgo de Lima",
    distancia: 4.3,
    latitude: -9.9705,
    longitude: -67.8005,
    horario: {
      semana: { inicio: "07:00", fim: "17:00" },
      sabado: { inicio: "07:00", fim: "17:00" },
      domingo: "fechado",
    },
    disponibilidade: [
      { remedio: "Metformina", disponivel: true },
      { remedio: "Simeticona", disponivel: true },
      { remedio: "Nistatina", disponivel: false },
      { remedio: "Ibuprofeno", disponivel: true },
      { remedio: "Prednisona", disponivel: false },
    ],
  },
  {
    id: "10",
    nome: "USF Mocinha Magalhães",
    distancia: 3.7,
    latitude: -9.9607,
    longitude: -67.8252,
    horario: {
      semana: { inicio: "07:00", fim: "17:00" },
      sabado: { inicio: "07:00", fim: "17:00" },
      domingo: "fechado",
    },
    disponibilidade: [
      { remedio: "Salbutamol", disponivel: false },
      { remedio: "Clorfeniramina", disponivel: true },
      { remedio: "Azitromicina", disponivel: true },
      { remedio: "Captopril", disponivel: true },
      { remedio: "Nimesulida", disponivel: false },
    ],
  },
];

export default function HomeScreen({ navigation }) {
  const [busca, setBusca] = useState("");
  const [userLocation, setUserLocation] = useState(null);
  const [locationPermission, setLocationPermission] = useState(null);

  useEffect(() => {
    requestLocationPermission();
  }, []);

  const requestLocationPermission = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      setLocationPermission(status === "granted");

      if (status === "granted") {
        getCurrentLocation();
      }
    } catch (error) {
      console.error("Erro ao solicitar permissão de localização:", error);
    }
  };

  const getCurrentLocation = async () => {
    try {
      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
        timeout: 15000,
      });
      setUserLocation(location.coords);
    } catch (error) {
      console.error("Erro ao obter localização:", error);
      // Mantém as distâncias padrão se não conseguir obter a localização
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

  // Filtra as unidades conforme o remédio pesquisado
  const unidadesFiltradas =
    busca.trim().length === 0
      ? []
      : unidadesComDistancia
          .map((u) => {
            const searchTerm = normalizeSearchString(busca);
            const info = u.disponibilidade.find((d) => {
              const medicineName = normalizeSearchString(d.remedio);
              return medicineName.includes(searchTerm);
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
    navigation.navigate("Mapa", {
      unidades:
        unidadesFiltradas.length > 0 ? unidadesFiltradas : unidadesComDistancia,
      remedioFiltro: busca,
    });
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
          name="medkit"
          size={40}
          color="#fff"
          style={{ marginRight: 10 }}
        />
        <View style={{ flex: 1 }}>
          <Text style={styles.headerTitle}>REMÉDIO JÁ</Text>
          {userLocation && (
            <View style={styles.locationIndicator}>
              <Ionicons name="location" size={12} color="#fff" />
              <Text style={styles.locationText}>Localização ativa</Text>
            </View>
          )}
        </View>
      </View>

      {/* Busca */}
      <TextInput
        style={styles.input}
        placeholder="Digite o nome do remédio"
        placeholderTextColor="#888"
        value={busca}
        onChangeText={handleBuscaChange}
        maxLength={50}
        autoCapitalize="words"
        autoCorrect={false}
        textContentType="none"
        autoComplete="off"
      />

      {/* Botão ver no mapa */}
      <TouchableOpacity style={styles.mapButton} onPress={handleVerNoMapa}>
        <Ionicons
          name="map-outline"
          size={18}
          color="#21796A"
          style={{ marginRight: 6 }}
        />
        <Text style={styles.mapButtonText}>Ver no mapa</Text>
      </TouchableOpacity>

      {/* Lista de unidades filtradas */}
      <FlatList
        showsVerticalScrollIndicator={false}
        data={unidadesFiltradas}
        keyExtractor={(item) => item.id}
        style={{ width: "100%" }}
        contentContainerStyle={{ alignItems: "center" }}
        ListEmptyComponent={
          busca.trim().length > 0 ? (
            <Text style={{ color: "#888", marginTop: 40 }}>
              Nenhuma unidade encontrada para "{busca}"
            </Text>
          ) : (
            <Text style={{ color: "#888", marginTop: 40 }}>
              Pesquise um remédio
            </Text>
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

              <View style={styles.infoRow}>
                <Ionicons
                  name="location-outline"
                  size={14}
                  color="#21796A"
                  style={{ marginRight: 4 }}
                />
                <Text style={styles.cardDistance}>{item.distancia} km</Text>
                {item.isDistanciaReal && (
                  <Ionicons
                    name="navigate-circle"
                    size={12}
                    color="#21796A"
                    style={{ marginLeft: 4 }}
                  />
                )}
                {!item.isDistanciaReal && (
                  <Text
                    style={[
                      styles.cardDistance,
                      { fontSize: 11, color: "#888", marginLeft: 4 },
                    ]}
                  >
                    (estimada)
                  </Text>
                )}
              </View>

              <Text
                style={[
                  styles.cardDisponibilidade,
                  { color: item.disponivel ? "#21796A" : "#B00020" },
                ]}
                numberOfLines={1}
                ellipsizeMode="tail"
              >
                {item.remedio} {item.disponivel ? "disponível" : "indisponível"}
              </Text>

              <Text
                style={styles.cardHorario}
                numberOfLines={1}
                ellipsizeMode="tail"
              >
                {typeof item.horario === "object"
                  ? `${item.horario.semana.inicio} às ${item.horario.semana.fim}`
                  : item.horario}
              </Text>
            </View>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F6F8F9",
    alignItems: "center",
    paddingTop: 60,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#21796A",
    width: "100%",
    paddingVertical: 32,
    paddingHorizontal: 24,
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
    marginBottom: 18,
    elevation: 4,
    shadowColor: "#21796A",
    shadowOpacity: 0.12,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
  },
  headerTitle: {
    color: "#fff",
    fontSize: 28,
    fontWeight: "bold",
    letterSpacing: 1,
  },
  locationIndicator: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 4,
  },
  locationText: {
    color: "#fff",
    fontSize: 12,
    marginLeft: 4,
    opacity: 0.9,
  },
  input: {
    width: "85%",
    backgroundColor: "#fff",
    borderRadius: 18,
    padding: 16,
    fontSize: 16,
    marginTop: -30,
    marginBottom: 14,
    elevation: 2,
    borderWidth: 1,
    borderColor: "#E0E0E0",
  },
  mapButton: {
    borderWidth: 1,
    borderColor: "#21796A",
    borderRadius: 22,
    paddingVertical: 8,
    paddingHorizontal: 32,
    marginBottom: 18,
    backgroundColor: "#fff",
    elevation: 1,
    flexDirection: "row",
    alignItems: "center",
  },
  mapButtonText: {
    color: "#21796A",
    fontSize: 16,
    fontWeight: "600",
    letterSpacing: 0.5,
  },
  card: {
    backgroundColor: "#fff",
    width: "90%",
    height: 130,
    borderRadius: 20,
    padding: 16,
    marginBottom: 18,
    elevation: 3,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    borderWidth: 1,
    borderColor: "#E0E0E0",
  },
  cardContent: {
    flex: 1,
    justifyContent: "space-between",
    height: "100%",
  },
  cardTitle: {
    fontSize: 15,
    fontWeight: "bold",
    color: "#21796A",
    lineHeight: 18,
    height: 36,
    textAlignVertical: "top",
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    height: 20,
    marginVertical: 2,
  },
  cardDistance: {
    fontSize: 13,
    color: "#21796A",
    fontWeight: "500",
  },
  cardDisponibilidade: {
    fontSize: 13,
    fontWeight: "600",
    lineHeight: 16,
    height: 16,
    textAlignVertical: "center",
  },
  cardHorario: {
    fontSize: 12,
    color: "#666",
    fontWeight: "400",
    lineHeight: 14,
    height: 14,
    textAlignVertical: "center",
  },
});
