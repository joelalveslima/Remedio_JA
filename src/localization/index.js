// Arquivo de localização simplificado para evitar problemas de build

// Textos padrão em português
const texts = {
  // Header
  appName: "REMÉDIO JÁ",

  // Status GPS
  verifyingLocation: "Verificando localização...",
  gpsActive: "GPS ATIVO",
  gpsDeactivated: "GPS DESATIVADO",

  // Busca
  searchPlaceholder: "Digite o nome do remédio",
  searchMedicine: "Pesquise um remédio",

  // Botões
  viewOnMap: "Ver no mapa",
  call: "Ligar",

  // Telas
  unitDetails: "Detalhes da Unidade",
  medicines: "Remédios Disponíveis",
  importantInfo: "Informações Importantes",

  // Resultados
  noUnitsFound: "Nenhuma unidade encontrada para",
  available: "disponível",
  unavailable: "indisponível",
  estimated: "estimada",

  // Horários
  to: "às",

  // Console logs
  locationTimeout: "Timeout na localização - usando distâncias estimadas",
  locationUnavailable: "Localização indisponível - usando distâncias estimadas",
  gpsDisabled: "GPS desabilitado - usando distâncias estimadas",
  locationError: "Erro na localização - usando distâncias estimadas:",
  permissionDenied:
    "Permissão de localização negada - usando distâncias estimadas",
  permissionError:
    "Erro ao solicitar permissão de localização - usando distâncias estimadas",
};

export default texts;
