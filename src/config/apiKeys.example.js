/**
 * EXEMPLO de Configuração de APIs e Chaves do Projeto
 *
 * INSTRUÇÕES:
 * 1. Copie este arquivo para src/config/apiKeys.js
 * 2. Substitua as chaves de exemplo pelas suas chaves reais
 * 3. Nunca faça commit do arquivo apiKeys.js real
 */

// Configurações da Google Cloud Vision API
export const GOOGLE_CLOUD_CONFIG = {
  // Sua chave de API do Google Cloud Vision
  // Obtenha em: https://console.cloud.google.com/apis/credentials
  API_KEY: "SUA_CHAVE_GOOGLE_CLOUD_VISION_API_AQUI",

  // URL da API do Google Cloud Vision
  VISION_API_URL: "https://vision.googleapis.com/v1/images:annotate",

  // Configurações de detecção
  FEATURES: [
    {
      type: "TEXT_DETECTION",
      maxResults: 10,
    },
  ],

  // Configurações de imagem
  IMAGE_CONTEXT: {
    languageHints: ["pt-BR", "pt", "en"], // Português brasileiro como prioridade
  },
};

// Configurações de outros serviços (opcional para futuro)
export const AWS_CONFIG = {
  // Para AWS Textract (caso queira usar no futuro)
  ACCESS_KEY_ID: "SUA_AWS_ACCESS_KEY_ID",
  SECRET_ACCESS_KEY: "SUA_AWS_SECRET_ACCESS_KEY",
  REGION: "us-east-1",
};

export const AZURE_CONFIG = {
  // Para Azure Computer Vision (caso queira usar no futuro)
  SUBSCRIPTION_KEY: "SUA_AZURE_SUBSCRIPTION_KEY",
  ENDPOINT: "https://SEU_RESOURCE_NAME.cognitiveservices.azure.com/",
};

// Configurações do app
export const APP_CONFIG = {
  // URL base do seu backend (se tiver)
  BACKEND_URL: "https://seu-backend.com/api",

  // Outras configurações do app
  TIMEOUT_MS: 30000, // 30 segundos para timeout de APIs
  RETRY_ATTEMPTS: 3,

  // Configurações de OCR específicas do app
  OCR_CONFIG: {
    // Confiança mínima para aceitar um resultado (0-1)
    MIN_CONFIDENCE: 0.7,

    // Medicamentos conhecidos para validação
    KNOWN_MEDICINES: [
      "dipirona",
      "paracetamol",
      "ibuprofeno",
      "amoxicilina",
      "azitromicina",
      "omeprazol",
      "losartana",
      "sinvastatina",
      "metformina",
      "captopril",
      "atenolol",
      "hidroclorotiazida",
      "diclofenaco",
      "prednisona",
      "dexametasona",
      "cefalexina",
      "ciprofloxacino",
      "clonazepam",
      "fluoxetina",
      "sertralina",
      "rivotril",
      "tylenol",
      "advil",
      "doril",
      "neosaldina",
      "benegrip",
      "aspirina",
      "buscopan",
      "plasil",
      "dramin",
    ],

    // Padrões regex para encontrar medicamentos
    MEDICINE_PATTERNS: [
      /\b\w+pril\b/gi, // Medicamentos terminados em "pril"
      /\b\w+olol\b/gi, // Medicamentos terminados em "olol"
      /\b\w+mycin\b/gi, // Antibióticos terminados em "mycin"
      /\b\w+cillin\b/gi, // Antibióticos terminados em "cillin"
    ],
  },
};

// Validação de configuração
export const validateConfig = () => {
  const errors = [];

  if (
    !GOOGLE_CLOUD_CONFIG.API_KEY ||
    GOOGLE_CLOUD_CONFIG.API_KEY.includes("SUA_CHAVE")
  ) {
    errors.push("Google Cloud Vision API Key não configurada");
  }

  if (errors.length > 0) {
    console.warn("⚠️ Configurações pendentes:", errors);
    return false;
  }

  return true;
};

// Função para obter configurações baseadas no ambiente
export const getConfig = () => {
  // Em produção, use variáveis de ambiente
  if (__DEV__) {
    return {
      googleCloud: GOOGLE_CLOUD_CONFIG,
      app: APP_CONFIG,
    };
  } else {
    return {
      googleCloud: {
        ...GOOGLE_CLOUD_CONFIG,
        API_KEY:
          process.env.GOOGLE_CLOUD_VISION_API_KEY ||
          GOOGLE_CLOUD_CONFIG.API_KEY,
      },
      app: {
        ...APP_CONFIG,
        BACKEND_URL: process.env.BACKEND_URL || APP_CONFIG.BACKEND_URL,
      },
    };
  }
};
