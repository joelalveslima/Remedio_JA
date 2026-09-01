// Feed de notícias sobre campanhas de saúde
import { COLORS } from "../constants/theme";

export const healthNews = [
  {
    id: 1,
    title: "Campanha de Vacinação contra Gripe 2025",
    summary:
      "Vacinação gratuita disponível em todas as unidades de saúde até agosto",
    date: "2025-07-01",
    category: "Vacinação",
    priority: "high",
    imageUrl: null,
    fullText:
      "A campanha de vacinação contra influenza está disponível gratuitamente em todas as unidades de saúde. Prioridade para idosos, crianças e grupos de risco.",
  },
  {
    id: 2,
    title: "Semana de Prevenção ao Diabetes",
    summary: "Testes gratuitos de glicemia em unidades básicas de saúde",
    date: "2025-07-03",
    category: "Prevenção",
    priority: "medium",
    imageUrl: null,
    fullText:
      "Durante esta semana, todas as UBS oferecem testes gratuitos de glicemia. Não é necessário agendamento.",
  },
  {
    id: 3,
    title: "Campanha Janeiro Branco - Saúde Mental",
    summary: "Atendimento psicológico gratuito e palestras sobre bem-estar",
    date: "2025-07-02",
    category: "Saúde Mental",
    priority: "high",
    imageUrl: null,
    fullText:
      "Programa de apoio à saúde mental com atendimentos gratuitos e atividades educativas sobre bem-estar emocional.",
  },
  {
    id: 4,
    title: "Distribuição de Preservativos",
    summary: "Preservativos gratuitos disponíveis em todas as unidades",
    date: "2025-06-30",
    category: "Prevenção",
    priority: "low",
    imageUrl: null,
    fullText:
      "Preservativos masculinos e femininos disponíveis gratuitamente em todas as unidades de saúde.",
  },
  {
    id: 5,
    title: "Cadastro para Medicamentos de Alto Custo",
    summary: "Aberto cadastro para acesso a medicamentos especializados",
    date: "2025-07-04",
    category: "Medicamentos",
    priority: "high",
    imageUrl: null,
    fullText:
      "Pacientes podem se cadastrar para ter acesso gratuito a medicamentos de alto custo através do SUS.",
  },
  {
    id: 6,
    title: "Mutirão de Exames de Mama",
    summary: "Mamografias gratuitas para mulheres de 50 a 69 anos",
    date: "2025-09-01",
    category: "Prevenção",
    priority: "high",
    imageUrl: null,
    fullText:
      "Mutirão de mamografias gratuitas nos finais de semana. Agendamento através do telefone 156 ou pelo app ConecteSUS.",
  },
  {
    id: 7,
    title: "Campanha Setembro Amarelo",
    summary: "Ações de prevenção ao suicídio e valorização da vida",
    date: "2025-09-03",
    category: "Saúde Mental",
    priority: "high",
    imageUrl: null,
    fullText:
      "Durante todo setembro, unidades de saúde promovem palestras e atendimentos especializados em saúde mental.",
  },
  {
    id: 8,
    title: "Vacinação contra COVID-19 Atualizada",
    summary: "Nova vacina bivalente disponível para todos os grupos",
    date: "2025-09-02",
    category: "Vacinação",
    priority: "medium",
    imageUrl: null,
    fullText:
      "Vacina atualizada contra as variantes mais recentes da COVID-19 disponível em todas as unidades de saúde.",
  },
  {
    id: 9,
    title: "Programa de Hipertensão e Diabetes",
    summary: "Acompanhamento médico especializado para pacientes crônicos",
    date: "2025-08-28",
    category: "Saúde Crônica",
    priority: "medium",
    imageUrl: null,
    fullText:
      "Programa HIPERDIA oferece consultas regulares, exames e medicamentos gratuitos para controle da pressão arterial e diabetes.",
  },
  {
    id: 10,
    title: "Teste Rápido de HIV e Sífilis",
    summary: "Testes gratuitos e sigilosos em todas as unidades",
    date: "2025-08-30",
    category: "Prevenção",
    priority: "medium",
    imageUrl: null,
    fullText:
      "Testes rápidos realizados em 15 minutos com resultado na hora. Atendimento sigiloso e orientação profissional.",
  },
  {
    id: 11,
    title: "Programa Saúde na Escola",
    summary: "Avaliação médica e odontológica em estudantes",
    date: "2025-08-25",
    category: "Campanhas",
    priority: "low",
    imageUrl: null,
    fullText:
      "Profissionais de saúde visitam escolas para realizar avaliações médicas e odontológicas em crianças e adolescentes.",
  },
  {
    id: 12,
    title: "Distribuição de Fraldas Geriátricas",
    summary: "Fraldas gratuitas para idosos cadastrados no programa",
    date: "2025-08-26",
    category: "Assistência",
    priority: "medium",
    imageUrl: null,
    fullText:
      "Idosos cadastrados no programa municipal podem retirar fraldas geriátricas nas unidades de saúde mediante apresentação de documentos.",
  },
  {
    id: 13,
    title: "Campanha de Doação de Sangue",
    summary: "Hemocentro necessita de doadores de todos os tipos sanguíneos",
    date: "2025-09-04",
    category: "Campanhas",
    priority: "high",
    imageUrl: null,
    fullText:
      "Crítica necessidade de doadores. Doação segura das 7h às 18h no Hemocentro. Leve documento com foto e esteja bem alimentado.",
  },
  {
    id: 14,
    title: "Programa Farmácia Popular",
    summary: "Medicamentos com desconto de até 90% nas farmácias credenciadas",
    date: "2025-08-29",
    category: "Medicamentos",
    priority: "medium",
    imageUrl: null,
    fullText:
      "Programa oferece medicamentos para hipertensão, diabetes, asma e contraceptivos com grandes descontos. Consulte a lista de farmácias credenciadas.",
  },
  {
    id: 15,
    title: "Atendimento 24h em Unidades de Pronto Atendimento",
    summary: "UPAs funcionam ininterruptamente para emergências médicas",
    date: "2025-08-27",
    category: "Emergência",
    priority: "medium",
    imageUrl: null,
    fullText:
      "Unidades de Pronto Atendimento funcionam 24 horas para casos de urgência e emergência. Classificação de risco com protocolo Manchester.",
  },
];

export const healthCampaigns = [
  {
    id: "janeiro",
    month: "Janeiro",
    name: "Janeiro Branco",
    theme: "Saúde mental",
    description: "Mês de conscientização sobre cuidado emocional e bem-estar.",
    color: "#F2F4F3",
    textColor: "#40514E",
    icon: "heart-outline",
  },
  {
    id: "fevereiro",
    month: "Fevereiro",
    name: "Fevereiro Roxo e Laranja",
    theme: "Lúpus, Alzheimer e leucemia",
    description: "Atenção ao diagnóstico precoce e à doação de medula óssea.",
    color: "#8251A5",
    textColor: "#FFFFFF",
    icon: "medical-outline",
  },
  {
    id: "marco",
    month: "Março",
    name: "Março Azul-Marinho",
    theme: "Câncer colorretal",
    description: "Informação e prevenção para o câncer de intestino.",
    color: "#24558A",
    textColor: "#FFFFFF",
    icon: "ribbon-outline",
  },
  {
    id: "abril",
    month: "Abril",
    name: "Abril Azul",
    theme: "Autismo",
    description: "Conscientização e respeito às pessoas autistas.",
    color: "#2176A5",
    textColor: "#FFFFFF",
    icon: "people-outline",
  },
  {
    id: "maio",
    month: "Maio",
    name: "Maio Amarelo",
    theme: "Segurança no trânsito",
    description: "Ações para reduzir acidentes e preservar vidas no trânsito.",
    color: "#D49712",
    textColor: "#FFFFFF",
    icon: "car-outline",
  },
  {
    id: "junho",
    month: "Junho",
    name: "Junho Vermelho",
    theme: "Doação de sangue",
    description: "Incentivo à doação regular de sangue para salvar vidas.",
    color: "#BE3D3D",
    textColor: "#FFFFFF",
    icon: "water-outline",
  },
  {
    id: "julho",
    month: "Julho",
    name: "Julho Amarelo",
    theme: "Hepatites virais",
    description: "Prevenção, testagem e tratamento das hepatites virais.",
    color: "#D49712",
    textColor: "#FFFFFF",
    icon: "shield-checkmark-outline",
  },
  {
    id: "agosto",
    month: "Agosto",
    name: "Agosto Dourado",
    theme: "Amamentação",
    description: "Apoio ao aleitamento materno para bebês mais saudáveis.",
    color: "#BD8D21",
    textColor: "#FFFFFF",
    icon: "heart-circle-outline",
  },
  {
    id: "setembro",
    month: "Setembro",
    name: "Setembro Amarelo",
    theme: "Prevenção ao suicídio",
    description: "Escuta, acolhimento e valorização da vida.",
    color: "#D49712",
    textColor: "#FFFFFF",
    icon: "chatbubble-ellipses-outline",
  },
  {
    id: "outubro",
    month: "Outubro",
    name: "Outubro Rosa",
    theme: "Câncer de mama",
    description: "Informação, prevenção e diagnóstico precoce.",
    color: "#C95378",
    textColor: "#FFFFFF",
    icon: "ribbon-outline",
  },
  {
    id: "novembro",
    month: "Novembro",
    name: "Novembro Azul",
    theme: "Saúde do homem",
    description: "Conscientização sobre prevenção e cuidado integral.",
    color: "#2176A5",
    textColor: "#FFFFFF",
    icon: "person-outline",
  },
  {
    id: "dezembro",
    month: "Dezembro",
    name: "Dezembro Vermelho",
    theme: "HIV e outras ISTs",
    description: "Prevenção, testagem e combate ao preconceito.",
    color: "#BE3D3D",
    textColor: "#FFFFFF",
    icon: "shield-outline",
  },
  {
    id: "janeiro-roxo",
    month: "Janeiro",
    name: "Janeiro Roxo",
    theme: "Hanseníase",
    description: "Conscientização sobre sinais, diagnóstico precoce e tratamento da hanseníase.",
    color: "#8251A5",
    textColor: "#FFFFFF",
    icon: "medical-outline",
  },
  {
    id: "fevereiro-laranja",
    month: "Fevereiro",
    name: "Fevereiro Laranja",
    theme: "Leucemia",
    description: "Incentivo à doação de medula óssea e atenção aos sinais da leucemia.",
    color: "#D87822",
    textColor: "#FFFFFF",
    icon: "water-outline",
  },
  {
    id: "marco-lilas",
    month: "Março",
    name: "Março Lilás",
    theme: "Câncer do colo do útero",
    description: "Prevenção e diagnóstico precoce com vacinação e exames de rotina.",
    color: "#8A4F7D",
    textColor: "#FFFFFF",
    icon: "ribbon-outline",
  },
  {
    id: "abril-verde",
    month: "Abril",
    name: "Abril Verde",
    theme: "Saúde e segurança no trabalho",
    description: "Prevenção de acidentes e doenças relacionadas ao trabalho.",
    color: "#278A57",
    textColor: "#FFFFFF",
    icon: "shield-checkmark-outline",
  },
  {
    id: "maio-roxo",
    month: "Maio",
    name: "Maio Roxo",
    theme: "Doenças inflamatórias intestinais",
    description: "Informação sobre diagnóstico e acompanhamento das doenças inflamatórias intestinais.",
    color: "#8251A5",
    textColor: "#FFFFFF",
    icon: "medical-outline",
  },
  {
    id: "junho-violeta",
    month: "Junho",
    name: "Junho Violeta",
    theme: "Violência contra a pessoa idosa",
    description: "Conscientização, proteção e respeito aos direitos das pessoas idosas.",
    color: "#7A5AA6",
    textColor: "#FFFFFF",
    icon: "people-outline",
  },
  {
    id: "julho-verde",
    month: "Julho",
    name: "Julho Verde",
    theme: "Câncer de cabeça e pescoço",
    description: "Alerta para prevenção e identificação precoce de cânceres de boca, garganta e pescoço.",
    color: "#278A57",
    textColor: "#FFFFFF",
    icon: "ribbon-outline",
  },
  {
    id: "agosto-lilas",
    month: "Agosto",
    name: "Agosto Lilás",
    theme: "Combate à violência contra a mulher",
    description: "Informação e acolhimento para prevenir e enfrentar a violência contra mulheres.",
    color: "#8A4F7D",
    textColor: "#FFFFFF",
    icon: "shield-outline",
  },
  {
    id: "agosto-laranja",
    month: "Agosto",
    name: "Agosto Laranja",
    theme: "Esclerose múltipla",
    description: "Conscientização sobre sintomas, diagnóstico e acompanhamento da esclerose múltipla.",
    color: "#D87822",
    textColor: "#FFFFFF",
    icon: "medical-outline",
  },
  {
    id: "setembro-verde",
    month: "Setembro",
    name: "Setembro Verde",
    theme: "Doação de órgãos",
    description: "Conscientização sobre a importância de conversar com a família sobre a doação de órgãos.",
    color: "#278A57",
    textColor: "#FFFFFF",
    icon: "heart-outline",
  },
  {
    id: "setembro-vermelho",
    month: "Setembro",
    name: "Setembro Vermelho",
    theme: "Saúde cardiovascular",
    description: "Conscientização sobre prevenção, sinais de alerta e cuidado com doenças do coração.",
    color: "#BE3D3D",
    textColor: "#FFFFFF",
    icon: "heart-outline",
  },
  {
    id: "setembro-dourado",
    month: "Setembro",
    name: "Setembro Dourado",
    theme: "Câncer infantojuvenil",
    description: "Informação sobre a importância do diagnóstico precoce do câncer em crianças e adolescentes.",
    color: "#BD8D21",
    textColor: "#FFFFFF",
    icon: "ribbon-outline",
  },
  {
    id: "setembro-lilas",
    month: "Setembro",
    name: "Setembro Lilás",
    theme: "Doença de Alzheimer",
    description: "Conscientização sobre os sinais de Alzheimer, acolhimento e cuidado com pessoas idosas.",
    color: "#8A4F7D",
    textColor: "#FFFFFF",
    icon: "people-outline",
  },
  {
    id: "outubro-verde",
    month: "Outubro",
    name: "Outubro Verde",
    theme: "Prevenção da sífilis",
    description: "Orientação sobre prevenção, testagem e tratamento da sífilis e outras ISTs.",
    color: "#278A57",
    textColor: "#FFFFFF",
    icon: "shield-checkmark-outline",
  },
  {
    id: "novembro-roxo",
    month: "Novembro",
    name: "Novembro Roxo",
    theme: "Prematuridade",
    description: "Atenção à saúde materna e neonatal para reduzir nascimentos prematuros.",
    color: "#8251A5",
    textColor: "#FFFFFF",
    icon: "heart-circle-outline",
  },
  {
    id: "dezembro-laranja",
    month: "Dezembro",
    name: "Dezembro Laranja",
    theme: "Câncer de pele",
    description: "Prevenção e detecção precoce do câncer de pele, com proteção contra o sol.",
    color: "#D87822",
    textColor: "#FFFFFF",
    icon: "sunny-outline",
  },
];

// Função para obter notícias ordenadas por prioridade e data
export const getHealthNewsOrdered = (limit = 3) => {
  const priorityOrder = { high: 3, medium: 2, low: 1 };

  return healthNews
    .sort((a, b) => {
      // Primeiro ordena por prioridade
      const priorityDiff =
        priorityOrder[b.priority] - priorityOrder[a.priority];
      if (priorityDiff !== 0) return priorityDiff;

      // Se mesma prioridade, ordena por data (mais recente primeiro)
      return new Date(b.date) - new Date(a.date);
    })
    .slice(0, limit); // Mostra apenas as mais relevantes conforme o limite
};

// Função para obter cor da categoria
export const getCategoryColor = (category) => {
  const colors = {
    Vacinação: COLORS.success,
    Prevenção: COLORS.info,
    "Saúde Mental": "#8A4F7D",
    Medicamentos: COLORS.warning,
    Campanhas: COLORS.primary,
    "Saúde Crônica": "#B25070",
    Assistência: "#7A6554",
    Emergência: COLORS.error,
  };
  return colors[category] || COLORS.textSecondary;
};

// Função para formatar data
export const formatNewsDate = (dateString) => {
  const date = new Date(dateString);
  const today = new Date();
  const diffTime = Math.abs(today - date);
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return "Hoje";
  if (diffDays === 1) return "Ontem";
  if (diffDays <= 7) return `${diffDays} dias atrás`;

  return date.toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
  });
};
