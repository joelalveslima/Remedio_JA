import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  FlatList,
  Alert,
  ActivityIndicator,
} from "react-native";
import { StatusBar } from "expo-status-bar";
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
import { OCRUtils } from "../utils/ocrUtils";
import { OCRDataManager } from "../utils/ocrDataManager";

export default function HomeScreen({ navigation }) {
  const [busca, setBusca] = useState("");
  const [userLocation, setUserLocation] = useState(null);
  const [locationStatus, setLocationStatus] = useState("verificando"); // verificando, ativa, inativa, negada
  const [locationWatcher, setLocationWatcher] = useState(null);
  const [isOCRProcessing, setIsOCRProcessing] = useState(false);

  useEffect(() => {
    console.log("🚀 Inicializando HomeScreen...");
    initializeLocation();

    return () => {
      // Limpar o watcher quando o componente for desmontado
      if (locationWatcher) {
        console.log("🧹 Limpando watcher de localização...");
        locationWatcher.remove();
      }
    };
  }, []);

  const initializeLocation = async () => {
    try {
      console.log("🔄 Inicializando sistema de localização...");

      // Primeiro verificar se já temos permissão
      const { status } = await Location.getForegroundPermissionsAsync();
      console.log("🗺️ Status inicial da permissão:", status);

      if (status === "granted") {
        // Já temos permissão, configurar watcher diretamente
        await setupLocationWatcher();
      } else {
        // Não temos permissão, solicitar
        await requestLocationPermission();
      }
    } catch (error) {
      console.error("❌ Erro na inicialização de localização:", error);
      setLocationStatus("inativa");
    }
  };

  const setupLocationWatcher = async () => {
    try {
      console.log("🔧 Configurando watcher de localização...");
      // Verificar se já tem permissão
      const { status } = await Location.getForegroundPermissionsAsync();
      if (status !== "granted") {
        console.log("⚠️ Sem permissão para configurar watcher");
        return;
      }

      console.log("✅ Permissão OK, criando watcher...");
      // Configurar watcher para mudanças de localização
      const watcher = await Location.watchPositionAsync(
        {
          accuracy: Location.Accuracy.Balanced,
          timeInterval: 5000, // Verificar a cada 5 segundos apenas se houver mudança
          distanceInterval: 10, // Só disparar se mover mais de 10 metros
        },
        (location) => {
          console.log("📍 Nova localização obtida:", location.coords);
          // Localização obtida com sucesso - GPS está ativo
          setUserLocation(location.coords);
          if (locationStatus !== "ativa") {
            setLocationStatus("ativa");
          }
        }
      );

      setLocationWatcher(watcher);
      console.log("✅ Watcher configurado com sucesso");

      // Tentar obter localização inicial
      getCurrentLocation();
    } catch (error) {
      console.error("❌ Erro ao configurar watcher:", error);
      // Se falhou, verificar status manualmente uma vez
      checkLocationStatus();
    }
  };

  const checkLocationStatus = async () => {
    try {
      console.log("🔍 Verificando status de localização...");
      const isLocationEnabled = await Location.hasServicesEnabledAsync();
      const { status } = await Location.getForegroundPermissionsAsync();

      console.log("🗺️ GPS habilitado:", isLocationEnabled);
      console.log("🗺️ Permissão atual:", status);

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
      console.error("Erro ao verificar status de localização:", error);
      setLocationStatus("inativa");
    }
  };

  const requestLocationPermission = async () => {
    try {
      setLocationStatus("verificando");
      console.log("🗺️ Solicitando permissão de localização...");
      const { status } = await Location.requestForegroundPermissionsAsync();
      console.log("🗺️ Status da permissão de localização:", status);

      if (status === "granted") {
        setupLocationWatcher(); // Configurar watcher após obter permissão
      } else {
        setLocationStatus("negada");
        console.log("⚠️ Permissão de localização negada");
      }
    } catch (error) {
      setLocationStatus("inativa");
      console.error("Erro ao solicitar permissão de localização:", error);
    }
  };

  const getCurrentLocation = async () => {
    try {
      console.log("📍 Tentando obter localização atual...");
      const isLocationEnabled = await Location.hasServicesEnabledAsync();

      if (!isLocationEnabled) {
        console.log("❌ GPS desabilitado pelo usuário");
        setLocationStatus("inativa");
        // Parar o watcher se GPS foi desativado
        if (locationWatcher) {
          locationWatcher.remove();
          setLocationWatcher(null);
        }
        return;
      }

      console.log("✅ GPS habilitado, obtendo posição...");
      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
        timeout: 10000,
      });

      console.log("✅ Localização obtida:", location.coords);
      setUserLocation(location.coords);
      setLocationStatus("ativa");
    } catch (error) {
      console.error("❌ Erro ao obter localização:", error);
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

  // Função para lidar com OCR
  const handleOCRScan = async () => {
    if (isOCRProcessing) return;

    setIsOCRProcessing(true);

    try {
      const result = await OCRUtils.scanMedicineFromImage();

      // Salvar resultado no storage para análise posterior
      await OCRDataManager.saveOCRResult(result);

      if (result.success) {
        // Usar o termo estruturado para pesquisa
        const searchTerm = result.searchTerm || result.medicineName;
        setBusca(searchTerm);

        // Log do JSON estruturado para debugging
        if (result.json) {
          console.log(
            "📊 OCR JSON Result:",
            JSON.stringify(result.json, null, 2)
          );
        }

        // Criar mensagem detalhada baseada nos dados estruturados
        let alertMessage = `Medicamento detectado: ${searchTerm}`;
        alertMessage += `\nConfiança: ${Math.round(result.confidence * 100)}%`;

        if (result.medicine?.dosage?.full) {
          alertMessage += `\nDosagem: ${result.medicine.dosage.full}`;
        }

        if (
          result.medicine?.category &&
          result.medicine.category !== "medicamento"
        ) {
          alertMessage += `\nCategoria: ${result.medicine.category}`;
        }

        if (result.medicine?.manufacturer?.name) {
          alertMessage += `\nFabricante: ${result.medicine.manufacturer.name}`;
        }

        if (result.isSimulation) {
          alertMessage += "\n\n⚠️ Modo simulação ativo";
        }

        Alert.alert(texts.ocrSuccess, alertMessage, [{ text: "OK" }]);

        // Log adicional das informações estruturadas
        if (result.medicine) {
          console.log("💊 Medicamento detectado:", {
            nome: result.medicine.name,
            categoria: result.medicine.category,
            dosagem: result.medicine.dosage,
            fabricante: result.medicine.manufacturer,
            confianca: result.medicine.confidence,
            tipo_match: result.medicine.matchType,
          });
        }

        if (result.ocr) {
          console.log("🔍 Dados OCR:", {
            texto_completo: result.ocr.fullText,
            palavras_detectadas: result.ocr.wordCount,
            linhas_detectadas: result.ocr.lines?.length || 0,
            idioma: result.ocr.language,
          });
        }
      } else {
        if (result.error !== "Captura cancelada") {
          let errorMessage = result.error || texts.ocrNoTextFound;

          // Mostrar sugestões se disponíveis
          if (result.searchSuggestions && result.searchSuggestions.length > 0) {
            errorMessage += "\n\nSugestões encontradas:";
            result.searchSuggestions.forEach((suggestion, index) => {
              errorMessage += `\n${index + 1}. ${suggestion.term}`;
            });
            errorMessage +=
              "\n\nTente pesquisar manualmente por um destes termos.";
          }

          Alert.alert(texts.ocrError, errorMessage, [{ text: "OK" }]);

          // Log do JSON de erro para debugging
          if (result.json) {
            console.log(
              "❌ Erro OCR JSON:",
              JSON.stringify(result.json, null, 2)
            );
          }
        }
      }
    } catch (error) {
      console.error("Erro no OCR:", error);
      Alert.alert(texts.ocrError, "Erro interno no processamento da imagem", [
        { text: "OK" },
      ]);
    } finally {
      setIsOCRProcessing(false);
    }
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
    try {
      console.log("🗺️ Navegando para o mapa...");
      console.log("📍 Busca atual:", busca);
      console.log("📊 Unidades filtradas:", unidadesFiltradas.length);

      // Se não há busca, envia todas as unidades ordenadas por distância (usando GPS se disponível)
      if (busca.trim().length === 0) {
        const unidadesOrdenadas = [...unidadesComDistancia].sort((a, b) => {
          return parseFloat(a.distancia) - parseFloat(b.distancia);
        });

        console.log("📋 Enviando todas as unidades:", unidadesOrdenadas.length);

        navigation.navigate("Mapa", {
          unidades: unidadesOrdenadas,
          remedioFiltro: "",
          showAllUnits: true, // Flag para indicar que deve mostrar todas as unidades
        });
      } else {
        // Se há busca, envia apenas as unidades filtradas
        if (unidadesFiltradas.length === 0) {
          Alert.alert(
            "Nenhuma unidade encontrada",
            `Não foram encontradas unidades com o medicamento "${busca}" disponível.`,
            [{ text: "OK" }]
          );
          return;
        }

        console.log(
          "🔍 Enviando unidades filtradas:",
          unidadesFiltradas.length
        );

        navigation.navigate("Mapa", {
          unidades: unidadesFiltradas,
          remedioFiltro: busca,
          showAllUnits: false,
        });
      }
    } catch (error) {
      console.error("❌ Erro ao navegar para o mapa:", error);
      Alert.alert("Erro", "Ocorreu um erro ao abrir o mapa. Tente novamente.", [
        { text: "OK" },
      ]);
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
      <StatusBar
        style="light"
        backgroundColor={COLORS.primary}
        translucent={false}
      />

      {/* Header */}
      <View style={styles.header}>
        <Ionicons
          name="medical"
          size={40}
          color={COLORS.iconWhite}
          style={{ marginRight: 10 }}
        />
        <View style={styles.headerTitleContainer}>
          <Text style={styles.headerTitle}>{texts.appName}</Text>
        </View>
        <View style={{ width: 50 }} />
      </View>

      {/* Container principal de busca */}
      <View style={styles.searchContainerWrapper}>
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

        {/* Botão OCR - Maior e mais visível */}
        <TouchableOpacity
          style={[
            styles.ocrButton,
            isOCRProcessing && styles.ocrButtonDisabled,
          ]}
          onPress={handleOCRScan}
          disabled={isOCRProcessing}
          activeOpacity={0.8}
        >
          {isOCRProcessing ? (
            <ActivityIndicator
              size="large"
              color={COLORS.textWhite}
              style={{ transform: [{ scale: 1.3 }] }}
            />
          ) : (
            <Ionicons
              name="camera"
              size={ICON_SIZES.large} // Ícone muito maior para destaque
              color={COLORS.textWhite}
            />
          )}
        </TouchableOpacity>
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
    paddingTop: 40, // Reduzido já que status bar não é mais translúcida
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
  headerTitleContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },

  // Busca
  searchContainerWrapper: {
    flexDirection: "row",
    alignItems: "center",
    width: "85%",
    marginTop: -30,
    marginBottom: SPACING.base,
    gap: SPACING.base,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
    backgroundColor: COLORS.cardBackground,
    borderRadius: 18,
    ...SHADOWS.light,
    borderWidth: 1,
    borderColor: COLORS.border,
    paddingHorizontal: SPACING.lg,
  },
  searchIcon: {
    marginRight: SPACING.base,
  },
  input: {
    flex: 1,
    paddingVertical: SPACING.lg,
    fontSize: FONT_SIZES.lg,
    fontFamily: FONTS.regular,
    color: COLORS.textPrimary,
    fontWeight: "400",
  },
  clearButton: {
    padding: SPACING.xs,
    marginLeft: SPACING.sm,
  },
  ocrButton: {
    width: 80, // Maior para mais destaque
    height: 80, // Maior para mais destaque
    borderRadius: 40, // Ajustado proporcionalmente
    backgroundColor: COLORS.primary, // Verde principal do app
    alignItems: "center",
    justifyContent: "center",
    ...SHADOWS.heavy,
    elevation: 12, // Maior elevação para destaque
    borderWidth: 4, // Borda mais grossa
    borderColor: COLORS.primaryLight, // Borda clara
    shadowColor: COLORS.primary, // Sombra na cor principal
    shadowOffset: {
      width: 0,
      height: 6,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  ocrButtonDisabled: {
    backgroundColor: COLORS.textLight, // Cinza claro quando desabilitado
    elevation: 4,
    opacity: 0.6,
    borderColor: COLORS.border, // Borda neutra quando desabilitado
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
    fontWeight: "bold",
  },

  // Cards das unidades
  card: {
    backgroundColor: COLORS.cardBackground,
    width: 350,
    height: 100,
    borderRadius: SPACING.base,
    padding: SPACING.lg,
    marginBottom: SPACING.base,
    ...SHADOWS.light,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  cardContent: {
    flex: 1,
  },
  cardTitle: {
    ...TEXT_STYLES.cardTitle,
    fontSize: FONT_SIZES.lg,
    marginBottom: SPACING.md,
    fontWeight: "bold",
    color: COLORS.textPrimary,
  },
  cardInfoRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: SPACING.xs,
  },
  cardDistance: {
    ...TEXT_STYLES.distanceText,
    fontSize: FONT_SIZES.base,
    color: COLORS.textPrimary,
    marginLeft: SPACING.xs,
    fontWeight: "bold",
  },
  cardHorario: {
    ...TEXT_STYLES.timeText,
    marginLeft: SPACING.xs,
    color: COLORS.textSecondary,
    fontSize: FONT_SIZES.md,
    fontWeight: "normal",
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
