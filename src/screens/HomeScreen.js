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
  Platform,
  Animated,
  Dimensions,
  Linking,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { Ionicons } from "@expo/vector-icons";
import * as Location from "expo-location";
import * as Haptics from "expo-haptics";
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
import { getResponsiveConfig } from "../utils/safeAreaUtils";
import { ImageSourceModal } from "../components/ImageSourceModal";
// Novos imports para API
import { healthUnitsService, apiHealthCheck } from "../services/api";
import {
  adaptHealthUnitsFromApi,
  combineApiWithLocalData,
  validateApiResponse,
  filterUnitsByMedicine,
  normalizeSearchString,
} from "../services/dataAdapter";

export default function HomeScreen({ navigation }) {
  const [busca, setBusca] = useState("");
  const [userLocation, setUserLocation] = useState(null);
  const [locationStatus, setLocationStatus] = useState("verificando"); // verificando, ativa, inativa, negada
  const [locationWatcher, setLocationWatcher] = useState(null);
  const [isOCRProcessing, setIsOCRProcessing] = useState(false);

  // Novos estados para API
  const [unidadesData, setUnidadesData] = useState([]);
  const [isLoadingUnidades, setIsLoadingUnidades] = useState(true);
  const [apiError, setApiError] = useState(null);
  const [isUsingApi, setIsUsingApi] = useState(false);

  // Estado para o modal moderno de seleção de imagem
  const [isImageModalVisible, setIsImageModalVisible] = useState(false);

  // Estados para animações
  const [fadeAnim] = useState(new Animated.Value(0));
  const [slideAnim] = useState(new Animated.Value(50));
  const [scaleAnim] = useState(new Animated.Value(0.9));

  // Configuração responsiva para safe area
  const safeAreaConfig = getResponsiveConfig();

  useEffect(() => {
    initializeLocation();
    loadHealthUnitsData();

    // Animação inicial
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }),
    ]).start();

    return () => {
      // Limpar o watcher quando o componente for desmontado
      if (locationWatcher) {
        locationWatcher.remove();
      }
    };
  }, []);

  /**
   * Carrega dados das unidades da API com fallback para dados locais
   */
  const loadHealthUnitsData = async () => {
    setIsLoadingUnidades(true);
    setApiError(null);

    try {
      console.log("🔧 MODO TESTE: Usando dados locais diretamente");

      // TESTE: Pular API e usar dados locais diretamente
      const localData = unidades.map((unit) => ({
        ...unit,
        isDistanciaReal: false,
        _source: "local",
      }));

      console.log("📊 Dados locais carregados:", localData.length);
      console.log("🔍 Primeira unidade:", localData[0]);
      console.log(
        "💊 Medicamentos da primeira unidade:",
        localData[0]?.disponibilidade
      );

      setUnidadesData(localData);
      setIsUsingApi(false);
      setApiError("Modo teste - dados locais");

      return; // Pular resto da função

      console.log("🏥 Carregando unidades de saúde...");

      // Primeiro, testar se a API está funcionando
      const healthCheck = await apiHealthCheck();

      if (healthCheck.success) {
        console.log("✅ API está funcionando, carregando dados...");

        // Carregar unidades da API
        const result = await healthUnitsService.getAll();
        const validation = validateApiResponse(result);

        if (validation.valid) {
          const adaptedData = adaptHealthUnitsFromApi(
            result.data,
            userLocation
          );
          setUnidadesData(adaptedData);
          setIsUsingApi(true);
          console.log(`✅ ${adaptedData.length} unidades carregadas da API`);
        } else {
          throw new Error(validation.error);
        }
      } else {
        throw new Error("API não está disponível");
      }
    } catch (error) {
      console.warn(
        "⚠️ Erro ao carregar da API, usando dados locais:",
        error.message
      );

      // Usar dados locais como fallback
      const localData = combineApiWithLocalData(null, unidades, userLocation);
      console.log("📊 Dados locais carregados:", localData.length);
      console.log("🔍 Primeira unidade local:", localData[0]);
      setUnidadesData(localData);
      setIsUsingApi(false);
      setApiError("API indisponível - usando dados locais");
    } finally {
      setIsLoadingUnidades(false);
    }
  };

  /**
   * Recarrega dados quando a localização do usuário mudar ou quando dados são carregados
   */
  useEffect(() => {
    if (userLocation && unidadesData.length > 0) {
      console.log(
        "🔄 Recalculando distâncias com localização atual:",
        userLocation
      );
      // Usar nossa nova função para calcular distâncias em tempo real
      const updatedData = calculateUnitsDistances(unidadesData, userLocation);
      setUnidadesData(updatedData);
    }
  }, [userLocation]);

  /**
   * Calcula distâncias quando dados das unidades são carregados pela primeira vez
   */
  useEffect(() => {
    if (
      unidadesData.length > 0 &&
      userLocation &&
      !unidadesData[0]?.distanciaCalculada
    ) {
      console.log("📊 Dados carregados, calculando distâncias iniciais...");
      const updatedData = calculateUnitsDistances(unidadesData, userLocation);
      setUnidadesData(updatedData);
    }
  }, [unidadesData.length]);

  const initializeLocation = async () => {
    try {
      // Primeiro verificar se já temos permissão
      const { status } = await Location.getForegroundPermissionsAsync();

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

  // Função para calcular distâncias das unidades baseada na localização do usuário
  const calculateUnitsDistances = (units, userLocation) => {
    if (!userLocation || !userLocation.latitude || !userLocation.longitude) {
      console.log(
        "📍 Localização do usuário não disponível, usando distâncias padrão"
      );
      return units;
    }

    console.log(
      "📍 Calculando distâncias baseadas na localização do usuário:",
      {
        latitude: userLocation.latitude,
        longitude: userLocation.longitude,
      }
    );

    return units
      .map((unit) => {
        const unitLat = unit.latitude;
        const unitLon = unit.longitude;

        if (!unitLat || !unitLon) {
          console.warn(
            `⚠️ Unidade "${unit.nome}" sem coordenadas, mantendo distância padrão`
          );
          return unit;
        }

        const calculatedDistance = calculateDistance(
          userLocation.latitude,
          userLocation.longitude,
          unitLat,
          unitLon
        );

        const finalDistance =
          calculatedDistance !== null
            ? parseFloat(calculatedDistance.toFixed(1))
            : unit.distancia; // fallback para distância original

        console.log(
          `📏 ${unit.nome}: ${finalDistance}km (calculado: ${
            calculatedDistance !== null
          })`
        );

        return {
          ...unit,
          distancia: finalDistance,
          distanciaCalculada: calculatedDistance !== null,
          distanciaOriginal: unit.distancia,
        };
      })
      .sort((a, b) => a.distancia - b.distancia); // Ordenar por distância
  };

  // Função para normalizar strings para busca segura - movida para dataAdapter
  // const normalizeSearchString = (str) => { ... } - removida, usando do dataAdapter

  // Função para lidar com OCR - versão modernizada
  const handleOCRScan = async () => {
    if (isOCRProcessing) return;

    // Mostrar modal moderno de seleção
    setIsImageModalVisible(true);
  };

  // Função para processar imagem após seleção
  const processOCRImage = async (image) => {
    if (!image) return;

    setIsOCRProcessing(true);

    try {
      // Processar imagem com OCR
      const result = await OCRUtils.processImageWithOCR(
        image.uri,
        image.base64
      );

      // Criar resultado estruturado similar ao antigo
      const structuredResult = {
        ...result,
        medicineName: result.searchTerm || result.medicineName,
        timestamp: new Date().toISOString(),
      };

      // Salvar resultado no storage para análise posterior
      await OCRDataManager.saveOCRResult(structuredResult);

      if (structuredResult.success) {
        // Usar o termo estruturado para pesquisa
        const searchTerm =
          structuredResult.searchTerm || structuredResult.medicineName;
        setBusca(searchTerm);

        // Log do JSON estruturado para debugging
        if (structuredResult.json) {
          console.log(
            "📊 OCR JSON Result:",
            JSON.stringify(structuredResult.json, null, 2)
          );
        }

        // Log adicional das informações estruturadas (sem popup)
        if (structuredResult.medicine) {
          console.log("💊 Medicamento detectado:", {
            nome: structuredResult.medicine.name,
            categoria: structuredResult.medicine.category,
            dosagem: structuredResult.medicine.dosage,
            fabricante: structuredResult.medicine.manufacturer,
            confianca: structuredResult.medicine.confidence,
            tipo_match: structuredResult.medicine.matchType,
          });
        }

        if (structuredResult.ocr) {
          console.log("🔍 Dados OCR:", {
            texto_completo: structuredResult.ocr.fullText,
            palavras_detectadas: structuredResult.ocr.wordCount,
            linhas_detectadas: structuredResult.ocr.lines?.length || 0,
            idioma: structuredResult.ocr.language,
          });
        }
      } else {
        if (structuredResult.error !== "Captura cancelada") {
          let errorMessage = structuredResult.error || texts.ocrNoTextFound;

          // Mostrar sugestões se disponíveis
          if (
            structuredResult.searchSuggestions &&
            structuredResult.searchSuggestions.length > 0
          ) {
            errorMessage += "\n\nSugestões encontradas:";
            structuredResult.searchSuggestions.forEach((suggestion, index) => {
              errorMessage += `\n${index + 1}. ${suggestion.term}`;
            });
            errorMessage +=
              "\n\nTente pesquisar manualmente por um destes termos.";
          }

          Alert.alert(texts.ocrError, errorMessage, [{ text: "OK" }]);

          // Log do JSON de erro para debugging
          if (structuredResult.json) {
            console.log(
              "❌ Erro OCR JSON:",
              JSON.stringify(structuredResult.json, null, 2)
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

  // Callbacks para o modal moderno
  const handleCameraPress = async () => {
    try {
      const image = await OCRUtils.captureImage();
      setIsImageModalVisible(false);
      if (image) {
        await processOCRImage(image);
      }
    } catch (error) {
      setIsImageModalVisible(false);
      console.error("Erro ao capturar imagem:", error);
      Alert.alert("Erro", "Não foi possível acessar a câmera");
    }
  };

  const handleGalleryPress = async () => {
    try {
      const image = await OCRUtils.pickImageFromGallery();
      setIsImageModalVisible(false);
      if (image) {
        await processOCRImage(image);
      }
    } catch (error) {
      setIsImageModalVisible(false);
      console.error("Erro ao selecionar da galeria:", error);
      Alert.alert("Erro", "Não foi possível acessar a galeria");
    }
  };

  const handleModalClose = () => {
    setIsImageModalVisible(false);
  };

  // FILTRO POR REMÉDIO: Mostra apenas unidades que têm o remédio pesquisado
  const unidadesFiltradas = (() => {
    console.log("🔍 FILTRO: Iniciando busca por remédio");
    console.log("📝 Busca atual:", busca);
    console.log(
      "🏥 Total de unidades disponíveis:",
      unidadesData.length || unidades.length
    );

    // Usar unidadesData (com distâncias calculadas) ou fallback para unidades
    const dadosParaFiltrar = unidadesData.length > 0 ? unidadesData : unidades;

    // Verificação de segurança: garantir que busca é uma string válida
    if (!busca || typeof busca !== "string") {
      console.warn("⚠️ Busca inválida:", busca);
      return [];
    }

    // Se não há busca, retornar todas as unidades ordenadas por distância
    if (busca.trim().length === 0) {
      console.log(
        "📋 Sem busca, mostrando todas as unidades ordenadas por distância"
      );
      const todasUnidades = dadosParaFiltrar
        .map((unidade) => ({
          id: unidade.id,
          nome: unidade.nome,
          endereco: `Lat: ${unidade.latitude.toFixed(
            4
          )}, Lng: ${unidade.longitude.toFixed(4)}`,
          distancia: unidade.distancia,
          distanciaCalculada: unidade.distanciaCalculada || false,
          distanciaOriginal: unidade.distanciaOriginal,
          horario: unidade.horario,
          medicamentos: unidade.disponibilidade || [],
          latitude: unidade.latitude,
          longitude: unidade.longitude,
          disponibilidade: unidade.disponibilidade,
        }))
        .sort((a, b) => a.distancia - b.distancia); // Ordenar por distância

      console.log("🎯 Mostrando todas as unidades:", todasUnidades.length);
      return todasUnidades;
    }

    // Filtrar unidades que têm o remédio pesquisado
    const termoBusca = busca.toLowerCase().trim();
    console.log("🔍 Procurando por:", termoBusca);

    const unidadesFiltradas = dadosParaFiltrar.filter((unidade) => {
      // Verificação de segurança: garantir que a unidade é válida
      if (!unidade || !unidade.nome) {
        console.warn("⚠️ Unidade inválida encontrada:", unidade);
        return false;
      }

      // Verificar se a unidade tem medicamentos disponíveis
      if (
        !unidade.disponibilidade ||
        !Array.isArray(unidade.disponibilidade) ||
        unidade.disponibilidade.length === 0
      ) {
        console.log(
          `ℹ️ Unidade "${unidade.nome}" sem medicamentos disponíveis`
        );
        return false;
      }

      // Verificar se algum medicamento corresponde à busca
      const temRemedio = unidade.disponibilidade.some((medicamento) => {
        // Verificação de segurança: garantir que medicamento e nome existem
        // Nota: no arquivo de dados, a propriedade se chama 'remedio', não 'nome'
        const nomeRemedio = medicamento.remedio || medicamento.nome;

        if (!medicamento || !nomeRemedio || typeof nomeRemedio !== "string") {
          console.warn("⚠️ Medicamento inválido encontrado:", medicamento);
          return false;
        }

        const nomeRemedioLower = nomeRemedio.toLowerCase();
        const temNome = nomeRemedioLower.includes(termoBusca);

        if (temNome) {
          console.log(`✅ Encontrou "${nomeRemedio}" na ${unidade.nome}`);
        }

        return temNome;
      });

      return temRemedio;
    });

    // Adaptar estrutura para compatibilidade com o renderItem
    const unidadesAdaptadas = unidadesFiltradas
      .map((unidade) => {
        const unidadeAdaptada = {
          id: unidade.id,
          nome: unidade.nome,
          endereco: `Lat: ${unidade.latitude.toFixed(
            4
          )}, Lng: ${unidade.longitude.toFixed(4)}`,
          distancia: unidade.distancia,
          distanciaCalculada: unidade.distanciaCalculada || false, // Preservar flag de cálculo
          distanciaOriginal: unidade.distanciaOriginal, // Preservar distância original
          horario: unidade.horario,
          medicamentos: unidade.disponibilidade || [],
          latitude: unidade.latitude,
          longitude: unidade.longitude,
          disponibilidade: unidade.disponibilidade,
          // Destacar o remédio pesquisado
          medicamentoPesquisado: termoBusca,
        };
        console.log(
          "✅ Unidade incluída:",
          unidadeAdaptada.nome,
          "Distância:",
          unidadeAdaptada.distancia + "km",
          "GPS:",
          unidadeAdaptada.distanciaCalculada
        );
        return unidadeAdaptada;
      })
      .sort((a, b) => a.distancia - b.distancia); // Ordenar por distância

    console.log(
      "🎯 Total de unidades com o remédio:",
      unidadesAdaptadas.length
    );
    return unidadesAdaptadas;
  })();

  const handleCardPress = (unidade) => {
    // Feedback haptic (se disponível)
    if (Platform.OS === "ios") {
      try {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      } catch (error) {
        console.log("Haptics não disponível:", error);
      }
    }

    // Animação de escala para feedback visual
    const scaleValue = new Animated.Value(1);
    Animated.sequence([
      Animated.timing(scaleValue, {
        toValue: 0.95,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(scaleValue, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();

    // Navegar após um pequeno delay para permitir a animação
    setTimeout(() => {
      navigation.navigate("Detalhes", {
        unidade,
        medicamentoPesquisado: busca.trim().length > 0 ? busca : null,
      });
    }, 150);
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
      .substring(0, 20); // Limita a 0 caracteres

    // Verifica se contém padrões perigosos
    const hasDangerousPattern = dangerousPatterns.some((pattern) =>
      pattern.test(sanitizedText)
    );

    // Só atualiza se passar na validação regex e não contiver padrões perigosos
    if (allowedCharsRegex.test(sanitizedText) && !hasDangerousPattern) {
      setBusca(sanitizedText);
    }
  };

  // Função para navegar para a localização da unidade
  const handleNavigateToLocation = (unidade) => {
    console.log("🗺️ Tentando navegar para:", unidade.nome);
    console.log("📍 Dados da unidade:", JSON.stringify(unidade, null, 2));

    // Tentar várias estruturas de dados possíveis
    const { latitude, longitude } =
      unidade.location ||
      unidade.localizacao || {
        latitude: unidade.latitude,
        longitude: unidade.longitude,
      } ||
      {};

    console.log("📍 Coordenadas extraídas:", { latitude, longitude });

    if (!latitude || !longitude) {
      console.error("❌ Coordenadas não encontradas para:", unidade.nome);
      Alert.alert(
        "Localização não disponível",
        `Não foi possível obter as coordenadas desta unidade de saúde.\n\nUnidade: ${
          unidade.nome
        }\nLatitude: ${latitude || "não encontrada"}\nLongitude: ${
          longitude || "não encontrada"
        }`
      );
      return;
    }

    // Feedback haptic se disponível
    if (Platform.OS === "ios") {
      try {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      } catch (error) {
        console.log("Haptics não disponível:", error);
      }
    }

    const label = encodeURIComponent(unidade.nome);
    const coordinates = `${latitude},${longitude}`;

    console.log("🏷️ Label:", label);
    console.log("📐 Coordinates:", coordinates);

    // URLs para diferentes plataformas de mapas
    const urls = {
      ios: `maps://app?daddr=${coordinates}&dirflg=d`, // Apple Maps
      android: `google.navigation:q=${coordinates}`, // Google Maps Navigation
      androidMaps: `geo:${coordinates}?q=${coordinates}(${label})`, // Android Maps genérico
      web: `https://www.google.com/maps/dir/?api=1&destination=${coordinates}`, // Google Maps Web
    };

    console.log("🌐 URLs geradas:", urls);

    // Função para tentar abrir o mapa
    const openMap = async (url, fallbackUrl) => {
      try {
        console.log("🚀 Tentando abrir URL:", url);
        const supported = await Linking.canOpenURL(url);
        console.log("✅ URL suportada:", supported);

        if (supported) {
          await Linking.openURL(url);
          console.log("✅ Mapa aberto com sucesso");
        } else if (fallbackUrl) {
          console.log("🔄 Tentando URL de fallback:", fallbackUrl);
          await Linking.openURL(fallbackUrl);
          console.log("✅ Mapa aberto com fallback");
        } else {
          throw new Error("Nenhum app de mapa disponível");
        }
      } catch (error) {
        console.error("❌ Erro ao abrir mapa:", error);
        Alert.alert(
          "Erro ao Abrir Mapa",
          `Não foi possível abrir o aplicativo de mapas.\n\nDetalhes:\n- URL tentada: ${url}\n- Erro: ${error.message}\n\nVerifique se você tem um app de mapas instalado.`
        );
      }
    };

    // Escolher URL baseada na plataforma
    console.log("📱 Plataforma detectada:", Platform.OS);
    if (Platform.OS === "ios") {
      openMap(urls.ios, urls.web);
    } else if (Platform.OS === "android") {
      // Tentar Google Maps Navigation primeiro, depois genérico, depois web
      openMap(urls.android, urls.androidMaps).catch(() => {
        openMap(urls.androidMaps, urls.web);
      });
    } else {
      openMap(urls.web);
    }
  };

  return (
    <Animated.View
      style={[
        styles.container,
        {
          paddingTop: safeAreaConfig.safeAreaTop,
          opacity: fadeAnim,
          transform: [{ scale: scaleAnim }],
        },
      ]}
    >
      <StatusBar
        style="light"
        backgroundColor={COLORS.primary}
        translucent={safeAreaConfig.isTranslucent}
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
          <Text
            style={styles.headerTitle}
            numberOfLines={1}
            adjustsFontSizeToFit={true}
            minimumFontScale={0.8}
          >
            {texts.appName}
          </Text>
        </View>
        <View style={{ width: 50 }} />
      </View>

      {/* Indicadores de status da API */}
      {(isLoadingUnidades || apiError || !isUsingApi) && (
        <View style={styles.statusContainer}>
          {isLoadingUnidades ? (
            <View style={styles.statusItem}>
              <ActivityIndicator size="small" color={COLORS.primary} />
              <Text style={styles.statusText}>Carregando unidades...</Text>
            </View>
          ) : (
            <>
              {apiError && (
                <View style={styles.statusItem}>
                  <Ionicons
                    name="cloud-offline"
                    size={16}
                    color={COLORS.warning}
                  />
                  <Text style={styles.statusTextWarning}>
                    {isUsingApi
                      ? "API conectada"
                      : "Modo offline - dados locais"}
                  </Text>
                  <TouchableOpacity
                    onPress={loadHealthUnitsData}
                    style={styles.retryButton}
                  >
                    <Ionicons name="refresh" size={14} color={COLORS.primary} />
                  </TouchableOpacity>
                </View>
              )}
              {isUsingApi && (
                <View style={styles.statusItem}>
                  <Ionicons
                    name="cloud-done"
                    size={16}
                    color={COLORS.success}
                  />
                  <Text style={styles.statusTextSuccess}>
                    API conectada - dados atualizados
                  </Text>
                </View>
              )}
            </>
          )}
        </View>
      )}

      {/* Container principal de busca */}
      <View style={styles.searchMainContainer}>
        <View style={styles.searchContainerWrapper}>
          {/* Busca com ícone */}
          <View style={styles.searchContainer}>
            <Ionicons
              name="search"
              size={ICON_SIZES.xl}
              color={COLORS.primary}
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
        </View>
      </View>

      {/* Botão de Captura */}
      <View style={styles.ocrContainer}>
        <TouchableOpacity
          style={[
            styles.ocrButton,
            isOCRProcessing && styles.ocrButtonDisabled,
          ]}
          onPress={handleOCRScan}
          disabled={isOCRProcessing}
          activeOpacity={0.7}
        >
          {isOCRProcessing ? (
            <>
              <ActivityIndicator size="small" color={COLORS.textWhite} />
              <Text style={styles.ocrButtonText}>Processando...</Text>
            </>
          ) : (
            <>
              <Ionicons name="camera" size={24} color={COLORS.textWhite} />
              <Text style={styles.ocrButtonText}>Tirar Foto</Text>
            </>
          )}
        </TouchableOpacity>
      </View>

      {/* Cabeçalho com o remédio pesquisado */}
      {busca.trim().length > 0 && (
        <View style={styles.searchHeaderContainer}>
          <Ionicons
            name="search-outline"
            size={20}
            color={COLORS.primary}
            style={styles.searchHeaderIcon}
          />
          <Text style={styles.searchHeaderText}>
            Pesquisando por: "{busca}"
          </Text>
          {unidadesFiltradas.length > 0 && (
            <Text style={styles.searchResultCount}>
              {unidadesFiltradas.length} unidade
              {unidadesFiltradas.length !== 1 ? "s" : ""} encontrada
              {unidadesFiltradas.length !== 1 ? "s" : ""}
            </Text>
          )}
        </View>
      )}

      {/* Lista de unidades filtradas */}
      {console.log(
        "🎯 Renderizando FlatList com:",
        unidadesFiltradas.length,
        "itens"
      )}
      {console.log(
        "📝 Lista completa:",
        unidadesFiltradas.map((u) => u.nome)
      )}
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
            <View style={styles.welcomeContainer}>
              {/* Seção de boas-vindas */}
              <View style={styles.welcomeSection}>
                <Ionicons
                  name="heart-outline"
                  size={50}
                  color={COLORS.primary}
                  style={styles.welcomeIcon}
                />
                <Text style={styles.welcomeTitle}>
                  Bem-vindo ao Remédio JA!
                </Text>
                <Text style={styles.welcomeSubtitle}>
                  Encontre medicamentos disponíveis nas unidades de saúde da sua
                  região
                </Text>
              </View>

              {/* Cards informativos */}
              <View style={styles.infoCardsContainer}>
                <View style={styles.infoCard}>
                  <Ionicons name="search" size={24} color={COLORS.primary} />
                  <Text style={styles.infoCardTitle}>Como Pesquisar</Text>
                  <Text style={styles.infoCardText}>
                    Digite o nome do medicamento ou use a câmera para escanear a
                    receita
                  </Text>
                </View>

                <View style={styles.infoCard}>
                  <Ionicons name="location" size={24} color={COLORS.primary} />
                  <Text style={styles.infoCardTitle}>Localização</Text>
                  <Text style={styles.infoCardText}>
                    Ative o GPS para encontrar unidades próximas a você
                  </Text>
                </View>

                <View style={styles.infoCard}>
                  <Ionicons name="time" size={24} color={COLORS.primary} />
                  <Text style={styles.infoCardTitle}>Horários</Text>
                  <Text style={styles.infoCardText}>
                    Confira os horários de funcionamento antes de se deslocar
                  </Text>
                </View>
              </View>

              {/* Dicas úteis */}
              <View style={styles.tipsContainer}>
                <Text style={styles.tipsTitle}>💡 Dicas Importantes</Text>
                <Text style={styles.tipsText}>
                  • Leve sempre um documento de identidade
                </Text>
                <Text style={styles.tipsText}>
                  • Traga a receita médica original
                </Text>
                <Text style={styles.tipsText}>
                  • Verifique a validade da receita
                </Text>
                <Text style={styles.tipsText}>
                  • Consulte os horários de funcionamento
                </Text>
              </View>
            </View>
          )
        }
        renderItem={({ item, index }) => {
          console.log("🏥 Renderizando unidade:", item.nome);

          // Animação de entrada para cada card (sem useEffect)
          const cardFadeAnim = new Animated.Value(0);
          const cardSlideAnim = new Animated.Value(30);

          // Atraso baseado no índice para efeito escalonado
          const delay = index * 100;

          // Iniciar animação imediatamente
          Animated.parallel([
            Animated.timing(cardFadeAnim, {
              toValue: 1,
              duration: 400,
              delay,
              useNativeDriver: true,
            }),
            Animated.timing(cardSlideAnim, {
              toValue: 0,
              duration: 400,
              delay,
              useNativeDriver: true,
            }),
          ]).start();

          return (
            <Animated.View
              style={{
                opacity: cardFadeAnim,
                transform: [{ translateY: cardSlideAnim }],
              }}
            >
              <TouchableOpacity
                style={styles.card}
                onPress={() => handleCardPress(item)}
                activeOpacity={0.8}
                delayPressIn={0}
                delayPressOut={100}
              >
                <View style={styles.cardContent}>
                  <View style={styles.cardMainContent}>
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
                      <Text style={styles.cardDistance}>
                        {item.distancia} km
                      </Text>
                      {item.distanciaCalculada && (
                        <View style={styles.gpsIndicator}>
                          <Ionicons
                            name="radio-button-on"
                            size={8}
                            color={COLORS.success}
                          />
                        </View>
                      )}
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

                  {/* Botão de navegação do lado direito */}
                  <TouchableOpacity
                    style={styles.navigationButton}
                    onPress={(e) => {
                      e.stopPropagation(); // Previne o click no card
                      handleNavigateToLocation(item);
                    }}
                    activeOpacity={0.7}
                  >
                    <Ionicons
                      name="navigate"
                      size={16}
                      color={COLORS.iconWhite}
                    />
                    <Text style={styles.navigationButtonText}>Mapa</Text>
                  </TouchableOpacity>
                </View>
              </TouchableOpacity>
            </Animated.View>
          );
        }}
      />

      {/* Rodapé com botão de notícias */}
      <Animated.View
        style={[
          styles.footerContainer,
          {
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }],
          },
        ]}
      >
        <TouchableOpacity
          style={styles.newsButton}
          onPress={() => {
            // Feedback haptic
            if (Platform.OS === "ios") {
              try {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              } catch (error) {
                console.log("Haptics não disponível:", error);
              }
            }
            navigation.navigate("Noticias");
          }}
          activeOpacity={0.9}
        >
          <View style={styles.newsButtonContent}>
            <View style={styles.newsIconContainer}>
              <Ionicons name="newspaper" size={14} color={COLORS.iconWhite} />
            </View>
            <View style={styles.newsTextContainer}>
              <Text style={styles.newsButtonTitle}>Notícias</Text>
              <Text style={styles.newsButtonSubtitle}>Saúde & Bem-estar</Text>
            </View>
            <Ionicons
              name="chevron-forward"
              size={18}
              color={COLORS.iconWhite}
              style={styles.newsArrow}
            />
          </View>
        </TouchableOpacity>
      </Animated.View>

      {/* Modal moderno para seleção de origem da imagem */}
      <ImageSourceModal
        visible={isImageModalVisible}
        onClose={handleModalClose}
        onCameraPress={handleCameraPress}
        onGalleryPress={handleGalleryPress}
        title="📸 Escanear Medicamento"
        subtitle="Escolha como você quer capturar a imagem do medicamento:"
      />
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  // Container principal
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    alignItems: "center",
    // paddingTop será aplicado dinamicamente via safeAreaConfig
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
    // Margem top negativa para sobrepor a safe area quando necessário
    marginTop: Platform.OS === "android" ? -39 : 0,
  },
  headerTitle: {
    ...TEXT_STYLES.headerTitle,
    textAlign: "center",
    numberOfLines: 1,
    adjustsFontSizeToFit: true,
    minimumFontScale: 0.8,
  },
  headerTitleContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },

  // Busca
  searchMainContainer: {
    width: "90%",
    marginTop: -35,
    marginBottom: SPACING.lg,
  },
  searchContainerWrapper: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: SPACING.md,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
    backgroundColor: COLORS.cardBackground,
    borderRadius: 25,
    ...SHADOWS.medium,
    borderWidth: 2,
    borderColor: COLORS.primaryLight,
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.xs,
    elevation: 8,
  },
  searchIcon: {
    marginRight: SPACING.md,
  },
  input: {
    flex: 1,
    paddingVertical: SPACING.lg,
    fontSize: FONT_SIZES.lg,
    fontFamily: FONTS.regular,
    color: COLORS.textPrimary,
    fontWeight: "500",
  },
  clearButton: {
    padding: SPACING.sm,
    marginLeft: SPACING.sm,
  },
  ocrContainer: {
    alignItems: "center",
    marginTop: SPACING.md,
    marginBottom: SPACING.lg,
    width: "90%",
    alignSelf: "center",
  },
  ocrButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: COLORS.primary,
    borderRadius: 25,
    ...SHADOWS.medium,
    elevation: 6,
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
    borderWidth: 2,
    borderColor: COLORS.primaryLight,
    width: "100%",
    minHeight: 50,
  },
  ocrButtonDisabled: {
    backgroundColor: COLORS.textLight,
    opacity: 0.6,
  },
  ocrButtonText: {
    ...TEXT_STYLES.bodyMedium,
    color: COLORS.textWhite,
    fontWeight: "700",
    marginLeft: SPACING.md,
    letterSpacing: 0.8,
    fontSize: 16,
  },

  // Rodapé
  footerContainer: {
    backgroundColor: COLORS.cardBackground,
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.lg,
    borderTopWidth: 1,
    borderTopColor: COLORS.primaryLight,
    ...SHADOWS.medium,
    elevation: 8,
    width: "100%",
    alignItems: "center",
  },
  newsButton: {
    backgroundColor: COLORS.primary,
    borderRadius: 16,
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.lg,
    elevation: 4,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    width: "90%",
    maxWidth: 300,
    minHeight: 56,
  },
  newsButtonContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: SPACING.xs,
  },
  newsIconContainer: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: "rgba(255, 255, 255, 0.08)",
    alignItems: "center",
    justifyContent: "center",
    marginRight: SPACING.md,
  },
  newsTextContainer: {
    flex: 1,
    alignItems: "flex-start",
  },
  newsButtonTitle: {
    ...TEXT_STYLES.title,
    color: COLORS.iconWhite,
    fontWeight: "600",
    fontSize: 16,
    marginBottom: 2,
  },
  newsButtonSubtitle: {
    ...TEXT_STYLES.body,
    color: "rgba(255, 255, 255, 0.85)",
    fontWeight: "400",
    fontSize: 12,
  },
  newsArrow: {
    opacity: 0.9,
    marginLeft: SPACING.sm,
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
    flexDirection: "row",
    alignItems: "stretch",
    justifyContent: "space-between",
  },
  cardMainContent: {
    flex: 1,
    paddingRight: SPACING.sm,
    justifyContent: "center",
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
  gpsIndicator: {
    marginLeft: 5,
    alignItems: "center",
    justifyContent: "center",
  },
  cardHorario: {
    ...TEXT_STYLES.timeText,
    marginLeft: SPACING.xs,
    color: COLORS.textSecondary,
    fontSize: FONT_SIZES.md,
    fontWeight: "normal",
  },

  // Botão de navegação no card
  navigationButton: {
    backgroundColor: COLORS.primary,
    borderRadius: 12,
    paddingHorizontal: SPACING.md,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    elevation: 3,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    minWidth: 80,
    flex: 0,
    alignSelf: "stretch",
  },
  navigationButtonText: {
    color: COLORS.iconWhite,
    fontSize: FONT_SIZES.sm,
    fontWeight: "600",
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

  // Container de boas-vindas
  welcomeContainer: {
    flex: 1,
    width: "100%",
    paddingHorizontal: SPACING.lg,
    paddingBottom: SPACING.xxxl,
  },
  welcomeSection: {
    alignItems: "center",
    marginTop: SPACING.xl,
    marginBottom: SPACING.xl,
    paddingHorizontal: SPACING.lg,
  },
  welcomeIcon: {
    marginBottom: SPACING.md,
  },
  welcomeTitle: {
    ...TEXT_STYLES.sectionTitle,
    color: COLORS.textPrimary,
    textAlign: "center",
    marginBottom: SPACING.sm,
  },
  welcomeSubtitle: {
    ...TEXT_STYLES.bodyText,
    color: COLORS.textSecondary,
    textAlign: "center",
    paddingHorizontal: SPACING.md,
  },

  // Cards informativos
  infoCardsContainer: {
    marginBottom: SPACING.xl,
  },
  infoCard: {
    backgroundColor: COLORS.cardBackground,
    borderRadius: 16,
    padding: SPACING.lg,
    marginBottom: SPACING.md,
    flexDirection: "row",
    alignItems: "flex-start",
    ...SHADOWS.light,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  infoCardTitle: {
    ...TEXT_STYLES.infoText,
    color: COLORS.textPrimary,
    marginBottom: SPACING.xs,
    marginLeft: SPACING.md,
    flex: 1,
  },
  infoCardText: {
    ...TEXT_STYLES.captionText,
    color: COLORS.textSecondary,
    marginLeft: SPACING.md,
    flex: 1,
    marginTop: -SPACING.xs,
  },

  // Dicas úteis
  tipsContainer: {
    backgroundColor: COLORS.cardBackground,
    borderRadius: 16,
    padding: SPACING.lg,
    ...SHADOWS.light,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderLeftWidth: 4,
    borderLeftColor: COLORS.primary,
  },
  tipsTitle: {
    fontSize: FONT_SIZES.lg,
    fontFamily: FONTS.bold,
    color: COLORS.textPrimary,
    marginBottom: SPACING.md,
    fontWeight: "600",
  },
  tipsText: {
    fontSize: FONT_SIZES.sm,
    fontFamily: FONTS.regular,
    color: COLORS.textSecondary,
    lineHeight: 20,
    marginBottom: SPACING.xs,
  },

  // Novos estilos para indicadores de status da API
  statusContainer: {
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.sm,
    backgroundColor: COLORS.cardBackground,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  statusItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: SPACING.xs,
  },
  statusText: {
    fontSize: FONT_SIZES.sm,
    fontFamily: FONTS.regular,
    color: COLORS.textSecondary,
    marginLeft: SPACING.sm,
  },
  statusTextWarning: {
    fontSize: FONT_SIZES.sm,
    fontFamily: FONTS.regular,
    color: COLORS.warning || "#FF9800",
    marginLeft: SPACING.sm,
  },
  statusTextSuccess: {
    fontSize: FONT_SIZES.sm,
    fontFamily: FONTS.regular,
    color: COLORS.success || "#4CAF50",
    marginLeft: SPACING.sm,
  },
  retryButton: {
    marginLeft: SPACING.sm,
    padding: SPACING.xs,
    borderRadius: 12,
    backgroundColor: COLORS.primaryLight || COLORS.primary + "20",
  },

  // Estilos para o cabeçalho da pesquisa
  searchHeaderContainer: {
    width: "90%",
    backgroundColor: COLORS.cardBackground,
    borderRadius: 12,
    padding: SPACING.md,
    marginVertical: SPACING.sm,
    borderLeftWidth: 4,
    borderLeftColor: COLORS.primary,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  searchHeaderIcon: {
    marginBottom: SPACING.xs,
  },
  searchHeaderText: {
    fontSize: FONT_SIZES.md,
    fontFamily: FONTS.medium,
    color: COLORS.textPrimary,
    marginBottom: SPACING.xs,
  },
  searchResultCount: {
    fontSize: FONT_SIZES.sm,
    fontFamily: FONTS.regular,
    color: COLORS.textSecondary,
  },
});
