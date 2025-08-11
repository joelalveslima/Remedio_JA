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
}
