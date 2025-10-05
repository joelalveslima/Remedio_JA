/**
 * Configurações da API
 * Centraliza todas as configurações relacionadas à comunicação com o backend
 */

// Detectar ambiente
const isDevelopment = __DEV__ || process.env.NODE_ENV === "development";

/**
 * Configurações base da API
 */
export const API_CONFIG = {
  // URLs por ambiente
  DEVELOPMENT: {
    BASE_URL: "http://localhost:3000/api",
    WS_URL: "ws://localhost:3000",
  },

  PRODUCTION: {
    BASE_URL: "https://api.remedioja.com/api", // Substitua pela sua URL de produção
    WS_URL: "wss://api.remedioja.com",
  },

  // Configurações de timeout
  TIMEOUT: {
    DEFAULT: 10000, // 10 segundos
    UPLOAD: 30000, // 30 segundos para uploads
    LONG_POLLING: 60000, // 60 segundos para operações longas
  },

  // Headers padrão
  HEADERS: {
    "Content-Type": "application/json",
    Accept: "application/json",
    "X-App-Version": "1.0.0",
    "X-Platform": "mobile",
  },

  // Configurações de retry
  RETRY: {
    MAX_ATTEMPTS: 3,
    DELAY: 1000, // 1 segundo
    BACKOFF_FACTOR: 2, // Exponential backoff
  },

  // Endpoints principais
  ENDPOINTS: {
    HEALTH: "/health",
    UNITS: "/units",
    MEDICINES: "/medicines",
    SEARCH: "/search",
    UPLOAD: "/upload",
  },
};

/**
 * Obter configuração baseada no ambiente atual
 */
export const getApiConfig = () => {
  const baseConfig = isDevelopment
    ? API_CONFIG.DEVELOPMENT
    : API_CONFIG.PRODUCTION;

  return {
    ...baseConfig,
    timeout: API_CONFIG.TIMEOUT.DEFAULT,
    headers: API_CONFIG.HEADERS,
    retry: API_CONFIG.RETRY,
    endpoints: API_CONFIG.ENDPOINTS,
  };
};

/**
 * Configurações específicas por feature
 */
export const FEATURE_CONFIG = {
  // Configurações de geolocalização
  LOCATION: {
    // Raio padrão para busca de unidades próximas (em km)
    DEFAULT_RADIUS: 10,
    // Precisão mínima para considerar uma localização válida (em metros)
    MIN_ACCURACY: 100,
    // Timeout para obter localização (em ms)
    TIMEOUT: 15000,
  },

  // Configurações de busca
  SEARCH: {
    // Número mínimo de caracteres para iniciar busca
    MIN_QUERY_LENGTH: 2,
    // Delay para debounce de busca (em ms)
    DEBOUNCE_DELAY: 300,
    // Número máximo de resultados por página
    MAX_RESULTS_PER_PAGE: 20,
  },

  // Configurações de cache
  CACHE: {
    // Tempo de vida do cache para unidades de saúde (em ms)
    HEALTH_UNITS_TTL: 5 * 60 * 1000, // 5 minutos
    // Tempo de vida do cache para medicamentos (em ms)
    MEDICINES_TTL: 30 * 60 * 1000, // 30 minutos
    // Tamanho máximo do cache (número de entradas)
    MAX_CACHE_SIZE: 100,
  },

  // Configurações de logs
  LOGGING: {
    // Habilitar logs detalhados apenas em desenvolvimento
    ENABLED: isDevelopment,
    // Nível de log (debug, info, warn, error)
    LEVEL: isDevelopment ? "debug" : "error",
    // Incluir stack trace nos logs de erro
    INCLUDE_STACK_TRACE: isDevelopment,
  },
};

/**
 * Validar configurações
 */
export const validateApiConfig = () => {
  const config = getApiConfig();
  const errors = [];
  const warnings = [];

  // Verificar URL base
  if (!config.BASE_URL) {
    errors.push("URL base da API não configurada");
  }

  // Verificar se URL é válida
  try {
    new URL(config.BASE_URL);
  } catch (error) {
    errors.push("URL base da API é inválida");
  }

  // Avisos para desenvolvimento
  if (isDevelopment) {
    if (config.BASE_URL.includes("localhost")) {
      warnings.push(
        "Usando servidor local - certifique-se de que a API está rodando"
      );
    }
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings,
    config,
  };
};

/**
 * Configurações de desenvolvimento para debugging
 */
export const DEV_CONFIG = {
  // Mock API quando não conseguir conectar
  ENABLE_MOCK_API: true,

  // Simular delay de rede
  SIMULATE_NETWORK_DELAY: false,
  NETWORK_DELAY: 1000, // 1 segundo

  // Simular erros aleatórios
  SIMULATE_ERRORS: false,
  ERROR_RATE: 0.1, // 10% de chance de erro

  // Logs verbosos
  VERBOSE_LOGGING: true,

  // Mostrar notificações de debug
  SHOW_DEBUG_NOTIFICATIONS: false,
};

// Validar configurações ao carregar o módulo
const validation = validateApiConfig();
if (validation.warnings.length > 0 && isDevelopment) {
  console.warn("⚠️ Avisos de configuração da API:", validation.warnings);
}
if (validation.errors.length > 0) {
  console.error("❌ Erros de configuração da API:", validation.errors);
}

export default {
  API_CONFIG,
  FEATURE_CONFIG,
  DEV_CONFIG,
  getApiConfig,
  validateApiConfig,
};
