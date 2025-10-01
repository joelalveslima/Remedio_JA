/**
 * Serviço de API para comunicação com o backend
 * Centraliza todas as chamadas HTTP para a API REST
 */

// Detectar ambiente e usar fetch apropriado
const fetchApi = typeof fetch !== "undefined" ? fetch : require("node-fetch");

// Configuração da API
const API_CONFIG = {
  // URL base da API - usar localhost para desenvolvimento
  BASE_URL: "http://localhost:3000/api",
  // Timeout para requisições (em ms)
  TIMEOUT: 5000, // Reduzido para falhar mais rápido em caso de problemas
  // Headers padrão
  DEFAULT_HEADERS: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
};

/**
 * Classe utilitária para fazer requisições HTTP
 */
class ApiClient {
  constructor(baseURL = API_CONFIG.BASE_URL) {
    this.baseURL = baseURL;
  }

  /**
   * Método genérico para fazer requisições HTTP
   */
  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;

    const config = {
      timeout: API_CONFIG.TIMEOUT,
      headers: {
        ...API_CONFIG.DEFAULT_HEADERS,
        ...options.headers,
      },
      ...options,
    };

    try {
      console.log(`🌐 API Request: ${config.method || "GET"} ${url}`);

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), config.timeout);

      const response = await fetchApi(url, {
        ...config,
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      console.log(`📡 API Response: ${response.status} ${response.statusText}`);

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      console.log(`✅ API Data received:`, data);

      return {
        success: true,
        data,
        status: response.status,
        headers: response.headers,
      };
    } catch (error) {
      console.error(`❌ API Error: [${error.name}]`, error.message);

      // Tratar diferentes tipos de erro
      if (error.name === "AbortError") {
        return {
          success: false,
          error: "Timeout da requisição",
          type: "timeout",
          details: `Requisição para ${url} demorou mais que ${config.timeout}ms`,
        };
      }

      if (
        error.name === "TypeError" &&
        error.message.includes("Network request failed")
      ) {
        return {
          success: false,
          error: "API não está disponível",
          type: "network",
          details: `Não foi possível conectar com ${url}. Usando dados locais como fallback.`,
        };
      }

      return {
        success: false,
        error: error.message || "Erro desconhecido",
        type: "unknown",
        details: error.stack,
      };
    }
  }

  /**
   * Método GET
   */
  async get(endpoint, params = {}) {
    const searchParams = new URLSearchParams();
    Object.keys(params).forEach((key) => {
      if (params[key] !== undefined && params[key] !== null) {
        searchParams.append(key, params[key]);
      }
    });

    const queryString = searchParams.toString();
    const finalEndpoint = queryString ? `${endpoint}?${queryString}` : endpoint;

    return this.request(finalEndpoint, { method: "GET" });
  }

  /**
   * Health check para verificar se a API está funcionando
   */
  async healthCheck() {
    try {
      const result = await this.get("/health");
      return result.success;
    } catch (error) {
      console.warn("⚠️ Health check falhou:", error.message);
      return false;
    }
  }
}

// Instância global do cliente da API
const apiClient = new ApiClient();

/**
 * Serviços da API organizados por domínio
 */

/**
 * Serviços relacionados a unidades de saúde
 */
export const healthUnitsService = {
  /**
   * Buscar todas as unidades de saúde
   */
  async getAll(page = 1, limit = 20) {
    try {
      const result = await apiClient.get("/units", { page, limit });
      return result;
    } catch (error) {
      return {
        success: false,
        error: "API não está disponível",
        details: error.message,
      };
    }
  },

  /**
   * Buscar unidades por medicamento
   */
  async getByMedicine(medicineName, available = true) {
    try {
      const params = {
        medicine: medicineName,
        available: available.toString(),
      };

      const result = await apiClient.get("/units", params);
      return result;
    } catch (error) {
      return {
        success: false,
        error: "API não está disponível",
        details: error.message,
      };
    }
  },
};

/**
 * Health check service
 */
export const healthService = {
  /**
   * Verificar se a API está funcionando
   */
  async check() {
    return apiClient.healthCheck();
  },

  /**
   * Obter status detalhado da API
   */
  async getStatus() {
    try {
      const result = await apiClient.get("/health");
      return result;
    } catch (error) {
      return {
        success: false,
        error: "API não está disponível",
        details: error.message,
      };
    }
  },
};

/**
 * Função de conveniência para health check
 */
export const apiHealthCheck = async () => {
  return healthService.getStatus();
};

// Export da instância do cliente para uso direto se necessário
export { apiClient };

// Export default com todos os serviços
export default {
  healthUnits: healthUnitsService,
  health: healthService,
  client: apiClient,
};
