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
