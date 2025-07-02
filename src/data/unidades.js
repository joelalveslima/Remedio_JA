// Dados das unidades de saúde
// Para adicionar novas unidades, siga o padrão abaixo:
// - id: identificador único (string)
// - nome: nome completo da unidade
// - distancia: distância estimada em km (será recalculada com GPS se disponível)
// - latitude/longitude: coordenadas GPS da unidade
// - horario: horários de funcionamento
// - disponibilidade: lista de remédios com status de disponibilidade

export const unidades = [
  {
    id: "1",
    nome: "Centro de Saúde Ary Rodrigues",
    distancia: 2.1,
    latitude: -9.978540834183534,
    longitude: -67.80469431534507,
    horario: {
      semana: { inicio: "07:00", fim: "17:00" },
    },
    disponibilidade: [
      { remedio: "Dipirona", disponivel: true },
      { remedio: "Amoxicilina", disponivel: true },
      { remedio: "Losartana", disponivel: false },
      { remedio: "Captopril", disponivel: true },
      { remedio: "Cetoconazol", disponivel: false },
    ],
  },
  {
    // -9.965002312938438, -67.8371291816943
    id: "2",
    nome: "Centro de Saúde Barral y Barral",
    distancia: 3.5,
    latitude: -9.965002312938438,
    longitude: -67.8371291816943,
    horario: {
      semana: { inicio: "07:00", fim: "17:00" },
    },
    disponibilidade: [
      { remedio: "Paracetamol", disponivel: true },
      { remedio: "Metformina", disponivel: true },
      { remedio: "Omeprazol", disponivel: false },
      { remedio: "Ibuprofeno", disponivel: true },
      { remedio: "Prednisona", disponivel: false },
    ],
  },
  {
    //-9.981615835637475, -67.81630108216648
    id: "3",
    nome: "Centro de Saúde Dr. Mário Maia",
    distancia: 4.0,
    latitude: -9.981615835637475,
    longitude: -67.81630108216648,
    horario: {
      semana: { inicio: "07:00", fim: "17:00" },
    },
    disponibilidade: [
      { remedio: "Ibuprofeno", disponivel: true },
      { remedio: "Enalapril", disponivel: false },
      { remedio: "Simeticona", disponivel: true },
      { remedio: "Ranitidina", disponivel: true },
      { remedio: "Loratadina", disponivel: false },
    ],
  },
  {
    //-9.971986998783423, -67.83450658216645
    id: "4",
    nome: "Centro de Saúde Gentil Perdomo da Rocha",
    distancia: 3.2,
    latitude: -9.971986998783423,
    longitude: -67.83450658216645,
    horario: {
      semana: { inicio: "07:00", fim: "17:00" },
    },
    disponibilidade: [
      { remedio: "Cetoconazol", disponivel: true },
      { remedio: "Salbutamol", disponivel: true },
      { remedio: "Dipirona", disponivel: false },
      { remedio: "Fluconazol", disponivel: true },
      { remedio: "Nistatina", disponivel: false },
    ],
  },
  {
    //-9.938217567063985, -67.83353902971976
    id: "5",
    nome: "USF Elpídio Moreira Souza",
    distancia: 8.7,
    latitude: -9.938217567063985,
    longitude: -67.83353902971976,
    horario: {
      semana: { inicio: "07:00", fim: "17:00" },
    },
    disponibilidade: [
      { remedio: "Azitromicina", disponivel: false },
      { remedio: "Ibuprofeno", disponivel: true },
      { remedio: "Hidroclorotiazida", disponivel: true },
      { remedio: "Clonazepam", disponivel: false },
      { remedio: "Simeticona", disponivel: true },
    ],
  },
  {
    // -9.950054079949172, -67.82424368278186
    id: "6",
    nome: "Centro de Saúde Vila Ivonete",
    distancia: 2.8,
    latitude: -9.950054079949172,
    longitude: -67.82424368278186,
    horario: {
      semana: { inicio: "07:00", fim: "17:00" },
    },
    disponibilidade: [
      { remedio: "Paracetamol", disponivel: true },
      { remedio: "Loratadina", disponivel: false },
      { remedio: "Clorfeniramina", disponivel: true },
      { remedio: "Losartana", disponivel: true },
      { remedio: "Sulfametoxazol + Trimetoprim", disponivel: false },
    ],
  },
  {
    id: "7",
    nome: "USF Luana Freitas II",
    distancia: 3.9,
    latitude: -9.949358367090992,
    longitude: -67.83444849295196,
    horario: {
      semana: { inicio: "07:00", fim: "17:00" },
    },
    disponibilidade: [
      { remedio: "Omeprazol", disponivel: true },
      { remedio: "Furosemida", disponivel: false },
      { remedio: "Amoxicilina", disponivel: true },
      { remedio: "Nimesulida", disponivel: false },
      { remedio: "Cefalexina", disponivel: true },
    ],
  },
  {
    //-9.933475273819187, -67.82562281074208
    id: "8",
    nome: "URAP Francisco Roney Rodrigues Meireles",
    distancia: 5.5,
    latitude: -9.933475273819187,
    longitude: -67.82562281074208,
    horario: {
      semana: { inicio: "07:00", fim: "17:00" },
    },
    disponibilidade: [
      { remedio: "Losartana", disponivel: true },
      { remedio: "Dipirona", disponivel: false },
      { remedio: "Ranitidina", disponivel: true },
      { remedio: "Paracetamol", disponivel: false },
      { remedio: "Benzetacil", disponivel: true },
    ],
  },
  {
    //-9.983468234491395, -67.82620559566028
    id: "9",
    nome: "URAP Augusto Hidalgo de Lima",
    distancia: 4.3,
    latitude: -9.983468234491395,
    longitude: -67.82620559566028,
    horario: {
      semana: { inicio: "07:00", fim: "17:00" },
    },
    disponibilidade: [
      { remedio: "Metformina", disponivel: true },
      { remedio: "Simeticona", disponivel: true },
      { remedio: "Nistatina", disponivel: false },
      { remedio: "Ibuprofeno", disponivel: true },
      { remedio: "Prednisona", disponivel: false },
    ],
  },
  {
    //-9.940890780427308, -67.8588830244957
    id: "10",
    nome: "USF Mocinha Magalhães",
    distancia: 3.7,
    latitude: -9.940890780427308,
    longitude: -67.8588830244957,
    horario: {
      semana: { inicio: "07:00", fim: "17:00" },
    },
    disponibilidade: [
      { remedio: "Salbutamol", disponivel: false },
      { remedio: "Clorfeniramina", disponivel: true },
      { remedio: "Azitromicina", disponivel: true },
      { remedio: "Captopril", disponivel: true },
      { remedio: "Nimesulida", disponivel: false },
    ],
  },
];

// Função utilitária para buscar unidade por ID
export const getUnidadeById = (id) => {
  return unidades.find((unidade) => unidade.id === id);
};

// Função utilitária para buscar unidades por remédio
export const getUnidadesByRemedio = (remedioNome) => {
  return unidades.filter((unidade) =>
    unidade.disponibilidade.some(
      (item) =>
        item.remedio.toLowerCase().includes(remedioNome.toLowerCase()) &&
        item.disponivel === true
    )
  );
};

// Função utilitária para obter todos os remédios disponíveis
export const getTodosRemediosDisponiveis = () => {
  const remedios = new Set();
  unidades.forEach((unidade) => {
    unidade.disponibilidade.forEach((item) => {
      if (item.disponivel) {
        remedios.add(item.remedio);
      }
    });
  });
  return Array.from(remedios).sort();
};
