/**
 * Utilitários compartilhados para geolocalização
 */

/**
 * Calcula a distância entre duas coordenadas usando a fórmula de Haversine
 * @param {number} lat1 - Latitude do primeiro ponto
 * @param {number} lon1 - Longitude do primeiro ponto
 * @param {number} lat2 - Latitude do segundo ponto
 * @param {number} lon2 - Longitude do segundo ponto
 * @returns {number|null} - Distância em quilômetros com 1 casa decimal ou null se parâmetros inválidos
 */
export const calculateDistance = (lat1, lon1, lat2, lon2) => {
  try {
    // Validação dos parâmetros
    if (!lat1 || !lon1 || !lat2 || !lon2) {
      return null;
    }

    const R = 6371; // Raio da Terra em km
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLon = ((lon2 - lon1) * Math.PI) / 180;

    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((lat1 * Math.PI) / 180) *
        Math.cos((lat2 * Math.PI) / 180) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c;

    // Retorna a distância formatada com 1 casa decimal
    return parseFloat(distance.toFixed(1));
  } catch (error) {
    console.error("Erro ao calcular distância:", error);
    return null;
  }
};
