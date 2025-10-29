// Configuração do Google Cloud Vision API
export const GOOGLE_CLOUD_CONFIG = {
  // API Key do Google Cloud Vision (deve ser configurada via variável de ambiente)
  API_KEY:
    process.env.EXPO_PUBLIC_GOOGLE_CLOUD_API_KEY ||
    "AIzaSyApfmpzj5p240awQ3CuaUmzwwfZoWnW7VE", // Nova chave API renovada

  // URL da API do Google Cloud Vision
  VISION_API_URL: "https://vision.googleapis.com/v1/images:annotate",

  // Configurações de features para OCR
  FEATURES: [
    {
      type: "TEXT_DETECTION",
      maxResults: 10,
    },
    {
      type: "DOCUMENT_TEXT_DETECTION",
      maxResults: 10,
    },
  ],

  // Contexto de imagem para melhor reconhecimento
  IMAGE_CONTEXT: {
    languageHints: ["pt", "en"], // Português e Inglês
  },
};

// Configurações gerais do app
export const APP_CONFIG = {
  // Configurações de OCR
  OCR: {
    // Timeout para requisições OCR (ms)
    TIMEOUT: 10000,

    // Qualidade da imagem (0.1 a 1.0)
    IMAGE_QUALITY: 0.8,

    // Tamanho máximo da imagem
    MAX_IMAGE_SIZE: {
      width: 1024,
      height: 1024,
    },

    // Modo de fallback quando API não está disponível
    FALLBACK_MODE: true,

    // Medicamentos mais comuns para fallback
    COMMON_MEDICINES: [
      "Paracetamol",
      "Dipirona",
      "Ibuprofeno",
      "Amoxicilina",
      "Loratadina",
      "Omeprazol",
      "Metformina",
      "Losartana",
      "Sinvastatina",
      "Atenolol",
      "Cetoprofeno",
      "Azitromicina",
      "Diclofenaco",
    ],

    // Padrões regex para identificar medicamentos no texto OCR
    MEDICINE_PATTERNS: [
      /\b[A-Z][a-z]{4,}(?:ol|ina|ano|ato|eno|feno)\b/g, // Terminações comuns de medicamentos (mínimo 5 letras)
      /\b[A-Z][a-z]{3,}\s+(?=\d+\s?mg)/gi, // Nome seguido de dosagem (captura o nome)
      /\b(?:ceto|amoxi|dipir|ibupro|lorata|omepr|metfor|losar)[a-z]+/gi, // Prefixos conhecidos
      /\b[A-Z][a-z]{5,}(?<!mg|ml|comp|caps)\b/g, // Palavras longas que não sejam unidades
    ],
  },

  // Configurações de debug
  DEBUG: {
    // Habilitar logs detalhados
    VERBOSE_LOGGING: __DEV__ || false,

    // Mostrar informações de performance
    SHOW_PERFORMANCE: __DEV__ || false,
  },
};

/**
 * Valida se as configurações estão corretas
 * @returns {Object} Resultado da validação
 */
export const validateConfig = () => {
  const errors = [];
  const warnings = [];

  // Verificar API Key do Google Cloud
  if (!GOOGLE_CLOUD_CONFIG.API_KEY) {
    warnings.push(
      "Google Cloud API Key não configurada - OCR funcionará em modo fallback"
    );
  }

  // Verificar URL da API
  if (!GOOGLE_CLOUD_CONFIG.VISION_API_URL) {
    errors.push("URL da Google Vision API não configurada");
  }

  // Verificar configurações de imagem
  const { MAX_IMAGE_SIZE, IMAGE_QUALITY } = APP_CONFIG.OCR;
  if (IMAGE_QUALITY < 0.1 || IMAGE_QUALITY > 1.0) {
    errors.push("Qualidade de imagem deve estar entre 0.1 e 1.0");
  }

  if (!MAX_IMAGE_SIZE.width || !MAX_IMAGE_SIZE.height) {
    errors.push("Tamanho máximo de imagem deve ser especificado");
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings,
    hasApiKey: !!GOOGLE_CLOUD_CONFIG.API_KEY,
  };
};

/**
 * Configuração para modo de desenvolvimento
 * Permite usar OCR mesmo sem API key configurada
 */
export const getDevelopmentConfig = () => {
  if (__DEV__) {
    return {
      ...APP_CONFIG,
      OCR: {
        ...APP_CONFIG.OCR,
        FALLBACK_MODE: true,
        TIMEOUT: 5000, // Timeout menor em desenvolvimento
      },
    };
  }
  return APP_CONFIG;
};

// Verificar configurações ao carregar o módulo
const validation = validateConfig();
if (validation.warnings.length > 0 && __DEV__) {
  console.warn("⚠️ Avisos de configuração:", validation.warnings);
}
if (validation.errors.length > 0) {
  console.error("❌ Erros de configuração:", validation.errors);
}

export default {
  GOOGLE_CLOUD_CONFIG,
  APP_CONFIG,
  validateConfig,
  getDevelopmentConfig,
};
