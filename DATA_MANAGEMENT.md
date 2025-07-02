# 📊 Guia de Gerenciamento de Dados - Unidades de Saúde

Este documento explica como gerenciar e atualizar os dados das unidades de saúde no app **"Remédio Já"**.

## 📁 Estrutura dos Dados

Os dados das unidades estão agora organizados no arquivo:

```
src/data/unidades.js
```

## 🏥 Estrutura de uma Unidade

Cada unidade deve seguir o padrão abaixo:

```javascript
{
  id: "1",                              // ID único (string)
  nome: "Centro de Saúde Exemplo",      // Nome completo da unidade
  distancia: 2.5,                       // Distância estimada em km
  latitude: -9.978540834183534,         // Coordenada GPS - latitude
  longitude: -67.80469431534507,        // Coordenada GPS - longitude
  horario: {                            // Horários de funcionamento
    semana: { inicio: "07:00", fim: "17:00" },
    sabado: { inicio: "07:00", fim: "12:00" },  // Opcional
    domingo: "fechado"                          // Opcional
  },
  disponibilidade: [                    // Lista de medicamentos
    { remedio: "Dipirona", disponivel: true },
    { remedio: "Paracetamol", disponivel: false },
    // ... mais medicamentos
  ]
}
```

## ➕ Como Adicionar Uma Nova Unidade

1. **Abra o arquivo** `src/data/unidades.js`

2. **Adicione a nova unidade** no final do array `unidades`:

```javascript
{
  id: "11", // Próximo ID disponível
  nome: "Nova Unidade de Saúde",
  distancia: 5.2, // Distância estimada
  latitude: -9.xxxxx,
  longitude: -67.xxxxx,
  horario: {
    semana: { inicio: "07:00", fim: "17:00" }
  },
  disponibilidade: [
    { remedio: "Dipirona", disponivel: true },
    { remedio: "Paracetamol", disponivel: true },
    // Adicione todos os medicamentos disponíveis
  ]
}
```

3. **Salve o arquivo** - as mudanças serão aplicadas automaticamente

## 🔄 Como Atualizar Disponibilidade de Medicamentos

Para atualizar se um medicamento está disponível ou não:

1. Encontre a unidade no arquivo `src/data/unidades.js`
2. Localize o medicamento na lista `disponibilidade`
3. Altere `disponivel: true` ou `disponivel: false`

```javascript
disponibilidade: [
  { remedio: "Dipirona", disponivel: true }, // Disponível ✅
  { remedio: "Paracetamol", disponivel: false }, // Indisponível ❌
];
```

## 🗺️ Como Obter Coordenadas GPS

Para encontrar as coordenadas de uma nova unidade:

1. **Google Maps**:

   - Busque o endereço
   - Clique com botão direito no local
   - Selecione as coordenadas que aparecem

2. **GPS Coordinates App** ou similar

3. **Formato**: Use sempre coordenadas decimais (ex: -9.978540)

## 📋 Validação dos Dados

O arquivo inclui funções utilitárias para ajudar na validação:

- `getUnidadeById(id)` - Busca uma unidade específica
- `getUnidadesByRemedio(nome)` - Busca unidades que têm um medicamento
- `getTodosRemediosDisponiveis()` - Lista todos os medicamentos disponíveis

## 🚨 Importante

- **IDs únicos**: Sempre use IDs únicos para cada unidade
- **Coordenadas precisas**: Use coordenadas GPS corretas para cálculo de distâncias
- **Nomes padronizados**: Use nomes completos e oficiais das unidades
- **Medicamentos**: Mantenha a lista atualizada regularmente

## 🔄 Futuras Melhorias

Este sistema pode ser facilmente expandido para:

- Conectar com uma API/banco de dados
- Atualizações automáticas de disponibilidade
- Sistema de notificações quando medicamentos ficam disponíveis
- Interface administrativa para gerenciar dados

## 📱 Testando as Mudanças

Após adicionar/editar unidades:

1. Salve o arquivo
2. Reinicie o app se necessário
3. Teste a busca pelos medicamentos
4. Verifique se aparecem no mapa
5. Confirme as informações de distância e horário

---

**💡 Dica**: Mantenha um backup dos dados antes de fazer alterações importantes!
