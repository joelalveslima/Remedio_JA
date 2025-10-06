import * as ImagePicker from "expo-image-picker";
import { Alert } from "react-native";
import {
  GOOGLE_CLOUD_CONFIG,
  APP_CONFIG,
  validateConfig,
} from "../config/apiKeys";

/**
 * Utilidade para captura e processamento de OCR
 * Implementação usando Google Cloud Vision API
 */

export class OCRUtils {
  /**
   * Solicita permissões da câmera
   */
  static async requestCameraPermissions() {
    try {
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      return status === "granted";
    } catch (error) {
      console.error("Erro ao solicitar permissão da câmera:", error);
      return false;
    }
  }

  /**
   * Solicita permissões da galeria/biblioteca de mídia
   */
  static async requestMediaLibraryPermissions() {
    try {
      const { status } =
        await ImagePicker.requestMediaLibraryPermissionsAsync();
      return status === "granted";
    } catch (error) {
      console.error("Erro ao solicitar permissão da galeria:", error);
      return false;
    }
  }

  /**
   * Abre a câmera para capturar uma imagem
   */
  static async captureImage() {
    try {
      // Verificar permissões primeiro
      const { status: currentStatus } =
        await ImagePicker.getCameraPermissionsAsync();

      const hasPermission = await this.requestCameraPermissions();

      if (!hasPermission) {
        Alert.alert(
          "Permissão Necessária",
          "É necessário permitir o acesso à câmera para usar esta funcionalidade."
        );
        return null;
      }

      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: false, // Removido para não precisar cortar
        quality: 0.9, // Qualidade maior para melhor OCR
        base64: true, // Necessário para enviar para Google Vision API
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        return result.assets[0];
      }

      return null;
    } catch (error) {
      console.error("❌ Erro ao capturar imagem:", error);
      return null;
    }
  }

  /**
   * Abre a galeria para selecionar uma imagem
   */
  static async pickImageFromGallery() {
    try {
      // Verificar permissões primeiro
      const hasPermission = await this.requestMediaLibraryPermissions();

      if (!hasPermission) {
        Alert.alert(
          "Permissão Necessária",
          "É necessário permitir o acesso à galeria para usar esta funcionalidade."
        );
        return null;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: false, // Removido para não precisar cortar
        quality: 0.9, // Qualidade maior para melhor OCR
        base64: true, // Necessário para enviar para Google Vision API
        allowsMultipleSelection: false, // Apenas uma imagem por vez
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        return result.assets[0];
      }

      return null;
    } catch (error) {
      console.error("❌ Erro ao selecionar imagem da galeria:", error);
      return null;
    }
  }

  /**
   * Mostra opções para o usuário escolher entre câmera ou galeria
   */
  static async showImageSourceOptions() {
    return new Promise((resolve) => {
      Alert.alert(
        "Selecionar Imagem",
        "Escolha a origem da imagem para análise:",
        [
          {
            text: "📷 Câmera",
            onPress: async () => {
              const image = await this.captureImage();
              resolve(image);
            },
          },
          {
            text: "🖼️ Galeria",
            onPress: async () => {
              const image = await this.pickImageFromGallery();
              resolve(image);
            },
          },
          {
            text: "Cancelar",
            style: "cancel",
            onPress: () => resolve(null),
          },
        ],
        { cancelable: true, onDismiss: () => resolve(null) }
      );
    });
  }

  /**
   * Converte imagem para base64 (se necessário)
   */
  static async convertImageToBase64(imageUri, base64Data) {
    if (base64Data) {
      return base64Data;
    }

    // Se não tiver base64, converter a URI para base64
    try {
      const response = await fetch(imageUri);
      const blob = await response.blob();
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          const base64 = reader.result.split(",")[1];
          resolve(base64);
        };
        reader.onerror = reject;
        reader.readAsDataURL(blob);
      });
    } catch (error) {
      console.error("Erro ao converter imagem para base64:", error);
      return null;
    }
  }

  /**
   * Processa a imagem com Google Cloud Vision API
   */
  static async processImageWithOCR(imageUri, base64Data) {
    try {
      // Validar configuração
      if (!validateConfig()) {
        return {
          success: false,
          error: "Não foi possível encontrar o medicamento na imagem",
          timestamp: new Date().toISOString(),
          source: "erro_configuracao",
        };
      }

      // Converter imagem para base64 se necessário
      const base64Image = await this.convertImageToBase64(imageUri, base64Data);
      if (!base64Image) {
        throw new Error("Não foi possível processar a imagem");
      }

      // Preparar payload para Google Cloud Vision API
      const requestBody = {
        requests: [
          {
            image: {
              content: base64Image,
            },
            features: GOOGLE_CLOUD_CONFIG.FEATURES,
            imageContext: GOOGLE_CLOUD_CONFIG.IMAGE_CONTEXT,
          },
        ],
      };

      // Fazer requisição para Google Cloud Vision API
      const response = await fetch(
        `${GOOGLE_CLOUD_CONFIG.VISION_API_URL}?key=${GOOGLE_CLOUD_CONFIG.API_KEY}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(requestBody),
          timeout: APP_CONFIG.TIMEOUT_MS,
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(
          `Erro da API: ${response.status} - ${response.statusText}`
        );
      }

      const result = await response.json();

      // Processar resposta da API
      return this.processGoogleVisionResponse(result);
    } catch (error) {
      console.error("Erro no processamento OCR:", error.message);

      // Em caso de erro da API, retornar erro
      if (
        error.message.includes("Erro da API") ||
        error.message.includes("Rede")
      ) {
        return {
          success: false,
          error: "Não foi possível encontrar o medicamento na imagem",
          timestamp: new Date().toISOString(),
          source: "erro_api",
        };
      }

      return {
        success: false,
        error: "Não foi possível encontrar o medicamento na imagem",
        details: error.message,
        timestamp: new Date().toISOString(),
        source: "erro_processamento",
      };
    }
  }

  /**
   * Processa a resposta da Google Cloud Vision API
   */
  static processGoogleVisionResponse(apiResponse) {
    try {
      const responses = apiResponse.responses;
      if (!responses || responses.length === 0) {
        return {
          success: false,
          error: "Nenhuma resposta da API",
        };
      }

      const detection = responses[0];

      // Verificar se há erro na resposta
      if (detection.error) {
        return {
          success: false,
          error: `Erro da API: ${detection.error.message}`,
        };
      }

      // Extrair texto detectado
      const textAnnotations = detection.textAnnotations;
      if (!textAnnotations || textAnnotations.length === 0) {
        return {
          success: false,
          error: "Nenhum texto encontrado na imagem",
        };
      }

      // Criar estrutura JSON detalhada da resposta
      const ocrResult = this.createOCRResultJSON(textAnnotations);

      // Procurar medicamentos no texto detectado
      const detectedMedicine = this.findMedicineInText(ocrResult.fullText);

      if (detectedMedicine) {
        return {
          success: true,
          medicine: detectedMedicine,
          ocr: ocrResult,
          searchTerm: detectedMedicine.name, // Termo para usar no campo de pesquisa
          timestamp: new Date().toISOString(),
          source: "api_google_vision",
        };
      } else {
        return {
          success: false,
          error: "Nenhum medicamento reconhecido no texto",
          ocr: ocrResult,
          searchSuggestions: this.extractPossibleMedicineNames(
            ocrResult.fullText
          ),
          timestamp: new Date().toISOString(),
          source: "api_google_vision",
        };
      }
    } catch (error) {
      console.error("Erro ao processar resposta da API:", error);
      return {
        success: false,
        error: "Erro ao processar resposta da API",
        timestamp: new Date().toISOString(),
        source: "erro",
      };
    }
  }

  /**
   * Cria estrutura JSON detalhada do resultado OCR
   */
  static createOCRResultJSON(textAnnotations) {
    // Texto completo (primeiro elemento)
    const fullText = textAnnotations[0].description;

    // Palavras individuais detectadas
    const words = [];
    const lines = [];

    // Processar todas as anotações de texto (exceto a primeira que é o texto completo)
    for (let i = 1; i < textAnnotations.length; i++) {
      const annotation = textAnnotations[i];
      const boundingPoly = annotation.boundingPoly;

      words.push({
        text: annotation.description,
        confidence: 1.0, // Google Vision não retorna confiança por palavra
        boundingBox: boundingPoly
          ? {
              vertices: boundingPoly.vertices,
            }
          : null,
        position: i,
      });
    }

    // Agrupar palavras em linhas baseado na posição Y
    const groupedLines = this.groupWordsIntoLines(words);

    return {
      fullText: fullText,
      words: words,
      lines: groupedLines,
      wordCount: words.length,
      language: "pt-BR", // Configurado nas hints
      processingTime: new Date().toISOString(),
      rawResponse: textAnnotations, // Resposta completa da API para debugging
    };
  }

  /**
   * Agrupa palavras em linhas baseado na posição vertical
   */
  static groupWordsIntoLines(words) {
    const lines = [];
    const lineThreshold = 10; // Pixels de tolerância para considerar mesma linha

    words.forEach((word) => {
      if (!word.boundingBox || !word.boundingBox.vertices) {
        return;
      }

      const wordY = word.boundingBox.vertices[0].y || 0;

      // Encontrar linha existente ou criar nova
      let targetLine = lines.find(
        (line) => Math.abs(line.averageY - wordY) <= lineThreshold
      );

      if (!targetLine) {
        targetLine = {
          text: "",
          words: [],
          averageY: wordY,
          lineNumber: lines.length + 1,
        };
        lines.push(targetLine);
      }

      targetLine.words.push(word);
      targetLine.text += (targetLine.text ? " " : "") + word.text;

      // Recalcular Y médio da linha
      const totalY = targetLine.words.reduce(
        (sum, w) => sum + (w.boundingBox?.vertices[0]?.y || 0),
        0
      );
      targetLine.averageY = totalY / targetLine.words.length;
    });

    // Ordenar linhas por posição vertical
    return lines.sort((a, b) => a.averageY - b.averageY);
  }

  /**
   * Extrai possíveis nomes de medicamentos quando não há match exato
   */
  static extractPossibleMedicineNames(text) {
    if (!text) return [];

    const words = text.split(/\s+/).filter((word) => word.length > 3);
    const suggestions = [];

    for (const word of words) {
      if (this.looksLikeMedicine(word)) {
        suggestions.push({
          term: this.capitalizeMedicine(word),
          confidence: 0.5,
          reason: "correspondencia_padrao",
        });
      }
    }

    // Limitar a 3 sugestões mais prováveis
    return suggestions.slice(0, 3);
  }

  /**
   * Encontra medicamentos no texto detectado com informações estruturadas
   */
  static findMedicineInText(text) {
    if (!text) return null;

    const normalizedText = text.toLowerCase();
    const knownMedicines = APP_CONFIG.OCR_CONFIG.KNOWN_MEDICINES;

    // Array para armazenar todos os matches encontrados
    const matches = [];

    // 1. Procurar medicamentos conhecidos (maior prioridade)
    for (const medicine of knownMedicines) {
      const lowerMedicine = medicine.toLowerCase();
      if (normalizedText.includes(lowerMedicine)) {
        matches.push({
          name: this.capitalizeMedicine(medicine),
          confidence: 0.95,
          matchType: "conhecido_exato",
          originalText: medicine,
          dosage: this.extractDosage(text, medicine),
          manufacturer: this.extractManufacturer(text),
          category: this.getMedicineCategory(medicine),
        });
      }
    }

    // 2. Procurar padrões de medicamentos (prioridade média)
    const patterns = APP_CONFIG.OCR_CONFIG.MEDICINE_PATTERNS;
    for (const pattern of patterns) {
      const matches_pattern = text.match(pattern);
      if (matches_pattern && matches_pattern.length > 0) {
        for (const match of matches_pattern) {
          // Evitar duplicatas
          if (
            !matches.find((m) => m.name.toLowerCase() === match.toLowerCase())
          ) {
            matches.push({
              name: this.capitalizeMedicine(match),
              confidence: 0.8,
              matchType: "padrao_correspondencia",
              originalText: match,
              dosage: this.extractDosage(text, match),
              manufacturer: this.extractManufacturer(text),
              category: this.getMedicineCategoryByPattern(pattern),
            });
          }
        }
      }
    }

    // 3. Procurar palavras que parecem medicamentos (menor prioridade)
    if (matches.length === 0) {
      const words = text.split(/\s+/).filter((word) => word.length > 3);
      for (const word of words) {
        if (this.looksLikeMedicine(word)) {
          matches.push({
            name: this.capitalizeMedicine(word),
            confidence: 0.65,
            matchType: "heuristico",
            originalText: word,
            dosage: this.extractDosage(text, word),
            manufacturer: this.extractManufacturer(text),
            category: "desconhecido",
          });
          break; // Apenas o primeiro que parecer medicamento
        }
      }
    }

    // Retornar o match com maior confiança
    if (matches.length > 0) {
      const bestMatch = matches.reduce((best, current) =>
        current.confidence > best.confidence ? current : best
      );

      return {
        ...bestMatch,
        allMatches: matches, // Incluir todos os matches para referência
        totalMatches: matches.length,
      };
    }

    return null;
  }

  /**
   * Extrai dosagem do texto baseado no medicamento encontrado
   */
  static extractDosage(text, medicineName) {
    // Padrões comuns de dosagem
    const dosagePatterns = [
      /(\d+(?:\.\d+)?)\s*mg/gi,
      /(\d+(?:\.\d+)?)\s*g/gi,
      /(\d+(?:\.\d+)?)\s*ml/gi,
      /(\d+(?:\.\d+)?)\s*mcg/gi,
      /(\d+(?:\.\d+)?)\s*UI/gi,
    ];

    const medicineIndex = text
      .toLowerCase()
      .indexOf(medicineName.toLowerCase());
    if (medicineIndex === -1) return null;

    // Procurar dosagem próxima ao nome do medicamento (100 caracteres antes e depois)
    const searchArea = text.slice(
      Math.max(0, medicineIndex - 100),
      medicineIndex + medicineName.length + 100
    );

    for (const pattern of dosagePatterns) {
      const match = searchArea.match(pattern);
      if (match) {
        return {
          value: match[1],
          unit: match[0].replace(match[1], "").trim(),
          full: match[0],
        };
      }
    }

    return null;
  }

  /**
   * Extrai fabricante/laboratório do texto
   */
  static extractManufacturer(text) {
    // Padrões comuns de laboratórios brasileiros
    const manufacturers = [
      "ems",
      "eurofarma",
      "medley",
      "neo química",
      "germed",
      "biosintética",
      "abbott",
      "bayer",
      "novartis",
      "pfizer",
      "roche",
      "sanofi",
      "genérico",
      "similar",
      "referência",
    ];

    const normalizedText = text.toLowerCase();

    for (const manufacturer of manufacturers) {
      if (normalizedText.includes(manufacturer)) {
        return {
          name: this.capitalizeWords(manufacturer),
          type: ["genérico", "similar", "referência"].includes(manufacturer)
            ? manufacturer
            : "laboratorio",
        };
      }
    }

    return null;
  }

  /**
   * Obtém categoria do medicamento baseado no nome
   */
  static getMedicineCategory(medicineName) {
    const categories = {
      analgésico: [
        "dipirona",
        "paracetamol",
        "ibuprofeno",
        "diclofenaco",
        "aspirina",
      ],
      antibiótico: [
        "amoxicilina",
        "azitromicina",
        "cefalexina",
        "ciprofloxacino",
      ],
      "anti-hipertensivo": [
        "losartana",
        "captopril",
        "atenolol",
        "hidroclorotiazida",
      ],
      antidepressivo: ["fluoxetina", "sertralina", "clonazepam"],
      antiácido: ["omeprazol"],
      antidiabético: ["metformina"],
      corticóide: ["prednisona", "dexametasona"],
      hipocolesterolemiante: ["sinvastatina"],
    };

    const lowerName = medicineName.toLowerCase();

    for (const [category, medicines] of Object.entries(categories)) {
      if (medicines.some((med) => lowerName.includes(med))) {
        return category;
      }
    }

    return "medicamento";
  }

  /**
   * Obtém categoria baseada no padrão regex
   */
  static getMedicineCategoryByPattern(pattern) {
    if (!pattern) {
      return "medicamento";
    }

    const patternCategories = {
      "/\\b\\w+pril\\b/gi": "anti-hipertensivo",
      "/\\b\\w+olol\\b/gi": "beta-bloqueador",
      "/\\b\\w+mycin\\b/gi": "antibiótico",
      "/\\b\\w+cillin\\b/gi": "antibiótico",
    };

    return patternCategories[pattern.toString()] || "medicamento";
  }

  /**
   * Capitaliza palavras
   */
  static capitalizeWords(text) {
    return text
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(" ");
  }

  /**
   * Verifica se uma palavra parece ser um medicamento
   */
  static looksLikeMedicine(word) {
    const cleaned = word.replace(/[^a-zA-Z]/g, "");

    // Critérios para parecer um medicamento
    return (
      cleaned.length >= 4 &&
      cleaned.length <= 20 &&
      /^[A-Za-z]+$/.test(cleaned) &&
      !/^(the|and|for|with|this|that)$/i.test(cleaned)
    );
  }

  /**
   * Capitaliza o nome do medicamento
   */
  static capitalizeMedicine(medicine) {
    return medicine.charAt(0).toUpperCase() + medicine.slice(1).toLowerCase();
  }

  /**
   * Função principal para capturar e processar imagem
   */
  static async scanMedicineFromImage(useImagePicker = true) {
    try {
      let image;

      if (useImagePicker) {
        // Mostra opções para o usuário escolher entre câmera ou galeria
        image = await this.showImageSourceOptions();
      } else {
        // Comportamento antigo - apenas câmera (mantido para compatibilidade)
        image = await this.captureImage();
      }

      if (!image) {
        return {
          success: false,
          error: "Captura cancelada",
          timestamp: new Date().toISOString(),
          source: "cancelado_usuario",
        };
      }

      // Processa com OCR (passa tanto URI quanto base64)
      const ocrResult = await this.processImageWithOCR(image.uri, image.base64);

      if (ocrResult.success) {
        const finalResult = {
          success: true,
          medicineName: ocrResult.searchTerm, // Para compatibilidade
          searchTerm: ocrResult.searchTerm, // Termo para o campo de pesquisa
          confidence: ocrResult.medicine?.confidence || 0,
          medicine: ocrResult.medicine, // Informações completas do medicamento
          ocr: ocrResult.ocr, // Dados completos do OCR
          json: {
            // JSON estruturado para logging/debug
            api_response: ocrResult,
            image_info: {
              uri: image.uri,
              width: image.width,
              height: image.height,
              base64_size: image.base64 ? image.base64.length : 0,
            },
            processing_info: {
              timestamp: ocrResult.timestamp,
              source: ocrResult.source,
              total_words: ocrResult.ocr?.wordCount || 0,
              lines_detected: ocrResult.ocr?.lines?.length || 0,
            },
          },
        };

        return finalResult;
      } else {
        return {
          success: false,
          error: ocrResult.error || "Não foi possível detectar texto na imagem",
          searchSuggestions: ocrResult.searchSuggestions || [],
          ocr: ocrResult.ocr,
          json: {
            api_response: ocrResult,
            image_info: {
              uri: image.uri,
              width: image.width,
              height: image.height,
              base64_size: image.base64 ? image.base64.length : 0,
            },
            error_info: {
              timestamp: ocrResult.timestamp,
              source: ocrResult.source,
              full_text: ocrResult.ocr?.fullText,
            },
          },
        };
      }
    } catch (error) {
      console.error("Erro crítico no processo OCR:", error.message);

      return {
        success: false,
        error: "Erro interno no processamento",
        timestamp: new Date().toISOString(),
        source: "erro_interno",
        json: {
          error: error.message,
          stack: error.stack,
        },
      };
    }
  }
}
