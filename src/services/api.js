/**
 * Serviço de API para comunicação com o backend
 * Centraliza todas as chamadas HTTP para a API REST usando Axios
 */

import axios from "axios";
import { getApiConfig, FEATURE_CONFIG, DEV_CONFIG } from "../config/apiConfig";

// Obter configurações da API
const config = getApiConfig();

/**
 * Configuração da instância Axios
 */
const apiClient = axios.create({
  baseURL: config.BASE_URL,
  timeout: config.timeout,
  headers: config.headers,
});

/**
 * Interceptor de Request - Adiciona logs e configurações
 */
apiClient.interceptors.request.use(
  (requestConfig) => {
    if (FEATURE_CONFIG.LOGGING.ENABLED) {
      console.log(
        `🌐 API Request: ${requestConfig.method?.toUpperCase()} ${
          requestConfig.baseURL
        }${requestConfig.url}`
      );
    }

    // Adicionar timestamp para debugging
    requestConfig.metadata = { startTime: new Date() };

    // Simular delay de rede em desenvolvimento
    if (DEV_CONFIG.SIMULATE_NETWORK_DELAY && __DEV__) {
      return new Promise((resolve) => {
        setTimeout(() => resolve(requestConfig), DEV_CONFIG.NETWORK_DELAY);
      });
    }

    return requestConfig;
  },
  (error) => {
    console.error("❌ Request Error:", error);
    return Promise.reject(error);
  }
);

/**
 * Interceptor de Response - Trata respostas e erros
 */
apiClient.interceptors.response.use(
  (response) => {
    if (FEATURE_CONFIG.LOGGING.ENABLED) {
      const duration = new Date() - response.config.metadata.startTime;
      console.log(
        `📡 API Response: ${response.status} ${response.statusText} (${duration}ms)`
      );

      if (FEATURE_CONFIG.LOGGING.LEVEL === "debug") {
        console.log(`✅ API Data received:`, response.data);
      }
    }

    return {
      success: true,
      data: response.data,
      status: response.status,
      headers: response.headers,
      duration: new Date() - response.config.metadata.startTime,
    };
  },
  (error) => {
    if (FEATURE_CONFIG.LOGGING.ENABLED) {
      console.error(`❌ API Error: [${error.code}]`, error.message);
    }

    // Estrutura padronizada de erro
    const errorResponse = {
      success: false,
      error: error.message || "Erro desconhecido",
      type: "unknown",
      status: error.response?.status,
    };

    // Tratar diferentes tipos de erro
    if (error.code === "ECONNABORTED" || error.code === "ETIMEDOUT") {
      errorResponse.type = "timeout";
      errorResponse.error = "Timeout da requisição";
      errorResponse.details = `Requisição demorou mais que ${config.timeout}ms`;
    } else if (error.code === "ECONNREFUSED" || error.code === "ENOTFOUND") {
      errorResponse.type = "network";
      errorResponse.error = "API não está disponível";
      errorResponse.details = `Não foi possível conectar com ${config.BASE_URL}. Usando dados locais como fallback.`;
    } else if (error.response) {
      // Erro HTTP (4xx, 5xx)
      errorResponse.type = "http";
      errorResponse.error = `HTTP ${error.response.status}: ${error.response.statusText}`;
      errorResponse.details =
        error.response.data?.message || error.response.data;
    }

    return Promise.resolve(errorResponse);
  }
);

/**
 * Classe utilitária para fazer requisições HTTP
 */
class ApiService {
  /**
   * Método GET
   */
  async get(endpoint, params = {}) {
    try {
      return await apiClient.get(endpoint, { params });
    } catch (error) {
      return this.handleError(error);
    }
  }

  /**
   * Método POST
   */
  async post(endpoint, data = {}) {
    try {
      return await apiClient.post(endpoint, data);
    } catch (error) {
      return this.handleError(error);
    }
  }

  /**
   * Método PUT
   */
  async put(endpoint, data = {}) {
    try {
      return await apiClient.put(endpoint, data);
    } catch (error) {
      return this.handleError(error);
    }
  }

  /**
   * Método DELETE
   */
  async delete(endpoint) {
    try {
      return await apiClient.delete(endpoint);
    } catch (error) {
      return this.handleError(error);
    }
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

  /**
   * Tratamento padronizado de erros
   */
  handleError(error) {
    console.error("🔥 Erro não capturado pelo interceptor:", error);
    return {
      success: false,
      error: error.message || "Erro desconhecido",
      type: "unknown",
      details: error.stack,
    };
  }
}

// Instância global do serviço da API
const apiService = new ApiService();

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
  async getAll(params = {}) {
    try {
      console.log("🏥 Buscando todas as unidades de saúde...");
      return await apiService.get("/units", params);
    } catch (error) {
      return {
        success: false,
        error: "Erro ao buscar unidades",
        details: error.message,
      };
    }
  },

  /**
   * Buscar unidade por ID
   */
  async getById(id) {
    try {
      console.log(`🏥 Buscando unidade ID: ${id}`);
      return await apiService.get(`/units/${id}`);
    } catch (error) {
      return {
        success: false,
        error: "Erro ao buscar unidade",
        details: error.message,
      };
    }
  },

  /**
   * Buscar unidades próximas
   */
  async getNearby(latitude, longitude, radius = 10) {
    try {
      console.log(`📍 Buscando unidades próximas a ${latitude}, ${longitude}`);
      return await apiService.get("/units/nearby", {
        latitude,
        longitude,
        radius,
      });
    } catch (error) {
      return {
        success: false,
        error: "Erro ao buscar unidades próximas",
        details: error.message,
      };
    }
  },

  /**
   * Buscar medicamentos disponíveis em uma unidade
   */
  async getMedicines(unitId) {
    try {
      console.log(`💊 Buscando medicamentos da unidade: ${unitId}`);
      return await apiService.get(`/units/${unitId}/medicines`);
    } catch (error) {
      return {
        success: false,
        error: "Erro ao buscar medicamentos",
        details: error.message,
      };
    }
  },

  /**
   * Buscar unidades por medicamento
   */
  async getByMedicine(medicineName, available = true) {
    try {
      console.log(`🔍 Buscando unidades com medicamento: ${medicineName}`);
      const params = {
        medicine: medicineName,
        available: available.toString(),
      };
      return await apiService.get("/units", params);
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
 * Serviços relacionados a medicamentos
 */
export const medicinesService = {
  /**
   * Buscar todos os medicamentos
   */
  async getAll(params = {}) {
    try {
      console.log("💊 Buscando todos os medicamentos...");
      return await apiService.get("/medicines", params);
    } catch (error) {
      return {
        success: false,
        error: "Erro ao buscar medicamentos",
        details: error.message,
      };
    }
  },

  /**
   * Buscar medicamento por ID
   */
  async getById(id) {
    try {
      console.log(`💊 Buscando medicamento ID: ${id}`);
      return await apiService.get(`/medicines/${id}`);
    } catch (error) {
      return {
        success: false,
        error: "Erro ao buscar medicamento",
        details: error.message,
      };
    }
  },

  /**
   * Buscar medicamentos por nome
   */
  async searchByName(name) {
    try {
      console.log(`🔍 Buscando medicamentos com nome: ${name}`);
      return await apiService.get("/medicines/search", { name });
    } catch (error) {
      return {
        success: false,
        error: "Erro ao buscar medicamentos",
        details: error.message,
      };
    }
  },
};

/**
 * Serviços de busca
 */
export const searchService = {
  /**
   * Busca global por medicamentos e unidades
   */
  async search(query, params = {}) {
    try {
      console.log(`🔍 Busca global: ${query}`);
      return await apiService.get("/search", { q: query, ...params });
    } catch (error) {
      return {
        success: false,
        error: "Erro na busca",
        details: error.message,
      };
    }
  },

  /**
   * Buscar unidades que têm um medicamento específico
   */
  async findUnitsWithMedicine(medicineName, params = {}) {
    try {
      console.log(`🏥💊 Buscando unidades com medicamento: ${medicineName}`);
      return await apiService.get("/search/units-with-medicine", {
        medicine: medicineName,
        ...params,
      });
    } catch (error) {
      return {
        success: false,
        error: "Erro ao buscar unidades com medicamento",
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
    return apiService.healthCheck();
  },

  /**
   * Obter status detalhado da API
   */
  async getStatus() {
    try {
      const result = await apiService.get("/health");
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

// Export da instância do serviço para uso direto se necessário
export { apiService, apiClient };

// Export default com todos os serviços
export default {
  healthUnits: healthUnitsService,
  medicines: medicinesService,
  search: searchService,
  health: healthService,
  service: apiService,
  client: apiClient,
};
