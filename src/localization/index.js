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
  ocrScan: "Escanear receita",
  ocrTooltip: "Use a câmera para capturar o nome do medicamento",
  ocrProcessing: "Processando imagem...",
  ocrError: "Erro ao processar imagem",
  ocrNoTextFound: "Nenhum texto encontrado na imagem",
  ocrSuccess: "Medicamento encontrado!",

  // Botões
  map: "MAPA",
  call: "Ligar",
  back: "Voltar",
  home: "Início",

  // Mapa
  mapVisualization: "Visualização do Mapa",
  mapSubText: "Toque em uma unidade para ver no Google Maps",
  myLocation: "Minha Localização",
  locating: "Localizando...",
  orderedByDistance: "Ordenadas por distância",

  // Telas
  unitDetails: "Detalhes",
  medicines: "Remédios Disponíveis",
  importantInfo: "Informações Importantes",

  // Resultados
  noUnitsFound: "Medicamento não encontrado",
  noUnitsFoundSubtitle:
    'O medicamento "{search}" não está disponível nas unidades próximas. Tente verificar a grafia ou consulte outras opções.',
  searchInstructions:
    "Digite o nome do remédio para encontrar unidades que o possuem",
  available: "Disponível",
  unavailable: "Indisponível",
  estimated: "estimada",
  unitSingular: "unidade encontrada",
  unitPlural: "unidades encontradas",
  orderedByDistanceFooter: "(ordenadas por distância)",

  // Horários
  to: "às",

  // Strings de permissão ainda utilizadas
  permissionDenied:
    "Permissão de localização negada - usando distâncias estimadas",
  permissionError:
    "Erro ao solicitar permissão de localização - usando distâncias estimadas",

  // Feed de notícias
  healthNews: "Notícias",
  newsSubtitle: "Últimas informações sobre saúde pública",
  readMore: "Ler mais",
  newsCategory: "Categoria",
};

export default texts;
