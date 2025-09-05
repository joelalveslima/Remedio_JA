// Feed de notícias sobre campanhas de saúde
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
    Vacinação: "#4CAF50",
    Prevenção: "#2196F3",
    "Saúde Mental": "#9C27B0",
    Medicamentos: "#FF9800",
    Campanhas: "#21796A",
    "Saúde Crônica": "#E91E63",
    Assistência: "#795548",
    Emergência: "#F44336",
  };
  return colors[category] || "#666";
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
