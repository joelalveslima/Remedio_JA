import AsyncStorage from "@react-native-async-storage/async-storage";

/**
 * Utilitário para armazenar e gerenciar dados JSON do OCR
 */
export class OCRDataManager {
  static STORAGE_KEY = "ocr_results_history";
  static MAX_STORED_RESULTS = 5; // Limitar quantidade para evitar uso excessivo de storage

  /**
   * Salva resultado do OCR no storage local
   */
  static async saveOCRResult(result) {
    try {
      // Obter histórico existente
      const existingHistory = await this.getOCRHistory();

      // Criar novo registro
      const newRecord = {
        id: Date.now().toString(),
        timestamp: new Date().toISOString(),
        success: result.success,
        searchTerm: result.searchTerm || null,
        confidence: result.confidence || null,
        source:
          result.json?.processing_info?.source ||
          result.source ||
          "desconhecido",
        medicine: result.medicine || null,
        fullText: result.ocr?.fullText || null,
        errorMessage: result.error || null,
        wordCount: result.ocr?.wordCount || 0,
        linesDetected: result.ocr?.lines?.length || 0,
        imageInfo: result.json?.image_info || null,
        processingTime:
          result.json?.processing_info?.timestamp || new Date().toISOString(),
      };

      // Adicionar ao início da lista
      const updatedHistory = [newRecord, ...existingHistory];

      // Limitar quantidade
      if (updatedHistory.length > this.MAX_STORED_RESULTS) {
        updatedHistory.splice(this.MAX_STORED_RESULTS);
      }

      // Salvar no storage
      await AsyncStorage.setItem(
        this.STORAGE_KEY,
        JSON.stringify(updatedHistory)
      );

      console.log("💾 OCR result saved to storage:", newRecord.id);
      return newRecord.id;
    } catch (error) {
      console.error("Erro ao salvar resultado OCR:", error);
      return null;
    }
  }

  /**
   * Recupera histórico de resultados OCR
   */
  static async getOCRHistory() {
    try {
      const historyJson = await AsyncStorage.getItem(this.STORAGE_KEY);
      return historyJson ? JSON.parse(historyJson) : [];
    } catch (error) {
      console.error("Erro ao recuperar histórico OCR:", error);
      return [];
    }
  }

  /**
   * Obtém estatísticas do OCR
   */
  static async getOCRStatistics() {
    try {
      const history = await this.getOCRHistory();

      const stats = {
        totalAttempts: history.length,
        successfulAttempts: history.filter((r) => r.success).length,
        failedAttempts: history.filter((r) => !r.success).length,
        averageConfidence: 0,
        mostCommonMedicines: {},
        sourceBreakdown: {},
        lastWeekAttempts: 0,
        averageProcessingTime: 0,
      };

      if (stats.totalAttempts === 0) return stats;

      // Calcular confiança média
      const successfulWithConfidence = history.filter(
        (r) => r.success && r.confidence
      );
      if (successfulWithConfidence.length > 0) {
        const totalConfidence = successfulWithConfidence.reduce(
          (sum, r) => sum + r.confidence,
          0
        );
        stats.averageConfidence =
          totalConfidence / successfulWithConfidence.length;
      }

      // Medicamentos mais comuns
      history.forEach((record) => {
        if (record.success && record.searchTerm) {
          const medicine = record.searchTerm.toLowerCase();
          stats.mostCommonMedicines[medicine] =
            (stats.mostCommonMedicines[medicine] || 0) + 1;
        }
      });

      // Breakdown por fonte
      history.forEach((record) => {
        const source = record.source || "desconhecido";
        stats.sourceBreakdown[source] =
          (stats.sourceBreakdown[source] || 0) + 1;
      });

      // Tentativas da última semana
      const oneWeekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
      stats.lastWeekAttempts = history.filter(
        (r) => new Date(r.timestamp) > oneWeekAgo
      ).length;

      return stats;
    } catch (error) {
      console.error("Erro ao calcular estatísticas OCR:", error);
      return null;
    }
  }

  /**
   * Limpa histórico antigo (manter apenas últimos 30 dias)
   */
  static async cleanOldHistory() {
    try {
      const history = await this.getOCRHistory();
      const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);

      const recentHistory = history.filter(
        (record) => new Date(record.timestamp) > thirtyDaysAgo
      );

      await AsyncStorage.setItem(
        this.STORAGE_KEY,
        JSON.stringify(recentHistory)
      );

      const removedCount = history.length - recentHistory.length;
      if (removedCount > 0) {
        console.log(`🧹 Removed ${removedCount} old OCR records`);
      }

      return removedCount;
    } catch (error) {
      console.error("Erro ao limpar histórico OCR:", error);
      return 0;
    }
  }

  /**
   * Exporta dados para análise (JSON)
   */
  static async exportOCRData() {
    try {
      const history = await this.getOCRHistory();
      const stats = await this.getOCRStatistics();

      const exportData = {
        metadata: {
          exportDate: new Date().toISOString(),
          totalRecords: history.length,
          dataVersion: "1.0",
        },
        statistics: stats,
        records: history,
      };

      return JSON.stringify(exportData, null, 2);
    } catch (error) {
      console.error("Erro ao exportar dados OCR:", error);
      return null;
    }
  }

  /**
   * Encontra padrões de erro para melhorias
   */
  static async analyzeErrorPatterns() {
    try {
      const history = await this.getOCRHistory();
      const errors = history.filter((r) => !r.success);

      const patterns = {
        commonErrors: {},
        lowConfidenceAttempts: [],
        emptyTextDetections: 0,
        apiErrors: 0,
        userCancellations: 0,
      };

      errors.forEach((error) => {
        // Erros comuns
        if (error.errorMessage) {
          patterns.commonErrors[error.errorMessage] =
            (patterns.commonErrors[error.errorMessage] || 0) + 1;
        }

        // Contadores específicos
        if (error.errorMessage?.includes("Nenhum texto encontrado")) {
          patterns.emptyTextDetections++;
        }
        if (error.errorMessage?.includes("Erro da API")) {
          patterns.apiErrors++;
        }
        if (error.errorMessage?.includes("cancelada")) {
          patterns.userCancellations++;
        }
      });

      // Tentativas com baixa confiança
      patterns.lowConfidenceAttempts = history
        .filter((r) => r.success && r.confidence && r.confidence < 0.7)
        .map((r) => ({
          searchTerm: r.searchTerm,
          confidence: r.confidence,
          timestamp: r.timestamp,
        }));

      return patterns;
    } catch (error) {
      console.error("Erro ao analisar padrões de erro:", error);
      return null;
    }
  }
}
