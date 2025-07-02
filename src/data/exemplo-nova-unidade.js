// Exemplo de como adicionar uma nova unidade
// Este arquivo é apenas para demonstração - NÃO importar no app

// EXEMPLO: Como adicionar a nova unidade "Centro de Saúde Esperança"

export const novaUnidadeExemplo = {
  id: "11", // Próximo ID disponível
  nome: "Centro de Saúde Esperança",
  distancia: 1.8, // Distância estimada em km
  latitude: -9.975123, // Coordenadas GPS reais da unidade
  longitude: -67.812456,
  horario: {
    semana: { inicio: "07:00", fim: "17:00" },
    sabado: { inicio: "08:00", fim: "12:00" }, // Funciona sábado meio período
    domingo: "fechado", // Fechado aos domingos
  },
  disponibilidade: [
    { remedio: "Dipirona", disponivel: true },
    { remedio: "Paracetamol", disponivel: true },
    { remedio: "Ibuprofeno", disponivel: false }, // Temporariamente indisponível
    { remedio: "Amoxicilina", disponivel: true },
    { remedio: "Losartana", disponivel: true },
    { remedio: "Captopril", disponivel: false },
    { remedio: "Metformina", disponivel: true },
    { remedio: "Omeprazol", disponivel: true },
  ],
};

// PASSOS PARA ADICIONAR:
// 1. Copie o objeto novaUnidadeExemplo acima
// 2. Cole no final do array 'unidades' em src/data/unidades.js
// 3. Ajuste os dados conforme necessário (nome, coordenadas, medicamentos)
// 4. Salve o arquivo
// 5. Teste no app

// IMPORTANTE:
// - Use sempre um ID único (próximo número disponível)
// - Verifique se as coordenadas GPS estão corretas
// - Mantenha a lista de medicamentos atualizada
// - Use nomes oficiais das unidades de saúde
