# 🧭 Guia de Navegação - App Remédio Já

## 📋 Visão Geral da Navegação

O app **"Remédio Já"** usa **React Navigation v6** com **Stack Navigator** para gerenciar a navegação entre telas. Aqui está como tudo funciona:

## 🏗️ Estrutura de Navegação

### 📁 **Arquivo Principal: `App.js`**

```javascript
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Home" // Tela inicial
        screenOptions={{
          headerShown: false, // Remove header padrão
        }}
      >
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Mapa" component={MapScreen} />
        <Stack.Screen name="Detalhes" component={DetailScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
```

## 🗺️ Fluxo de Navegação

```
┌─────────────┐
│ HomeScreen  │ ◀── Tela inicial
│   (Home)    │
└─────────────┘
       │
       ├─── "Ver no Mapa" ────────┐
       │                         │
       └─── Card da Unidade ──────┼─────┐
                                  │     │
                                  ▼     ▼
                            ┌─────────────┐   ┌─────────────┐
                            │ MapScreen   │   │DetailScreen │
                            │   (Mapa)    │   │ (Detalhes)  │
                            └─────────────┘   └─────────────┘
                                  │                 │
                                  └─── Card ────────┘
                                  │
                                  ▼
                            ┌─────────────┐
                            │DetailScreen │
                            │ (Detalhes)  │
                            └─────────────┘
```

## 📱 Detalhes de Cada Tela

### 🏠 **HomeScreen (`Home`)**

**Função**: Tela principal com busca de medicamentos

**Navegações Saindo:**

```javascript
// 1. Para o Mapa (botão "Ver no Mapa")
navigation.navigate("Mapa", {
  unidades: unidadesOrdenadas,
  remedioFiltro: "",
  showAllUnits: true,
});

// 2. Para o Mapa (com filtro de busca)
navigation.navigate("Mapa", {
  unidades: unidadesFiltradas,
  remedioFiltro: busca,
  showAllUnits: false,
});

// 3. Para Detalhes (clique no card da unidade)
navigation.navigate("Detalhes", { unidade });
```

**Parâmetros Enviados:**

- `unidades`: Array com dados das unidades
- `remedioFiltro`: Texto da busca atual
- `showAllUnits`: Flag para mostrar todas ou filtradas
- `unidade`: Dados da unidade específica

---

### 🗺️ **MapScreen (`Mapa`)**

**Função**: Mostra mapa e lista de unidades

**Navegações Entrando:**

```javascript
// Recebe parâmetros do HomeScreen
const { unidades, remedioFiltro, showAllUnits } = route.params;
```

**Navegações Saindo:**

```javascript
// 1. Para Detalhes (clique no card da unidade)
navigation.navigate("Detalhes", { unidade });

// 2. Voltar para Home
navigation.goBack();
```

**Parâmetros Recebidos:**

- `unidades`: Lista de unidades para exibir
- `remedioFiltro`: Medicamento filtrado (se houver)
- `showAllUnits`: Se deve mostrar todas as unidades

---

### 📋 **DetailScreen (`Detalhes`)**

**Função**: Mostra detalhes completos da unidade

**Navegações Entrando:**

```javascript
// Recebe dados da unidade
const { unidade } = route.params;
```

**Navegações Saindo:**

```javascript
// Apenas volta para a tela anterior
navigation.goBack();
```

**Parâmetros Recebidos:**

- `unidade`: Objeto completo com dados da unidade

## 🔄 Tipos de Navegação Usados

### 1. **`navigation.navigate()`**

```javascript
// Vai para uma tela específica com parâmetros
navigation.navigate("NomeDaTela", { parametros });
```

**Usado para:** Ir para frente nas telas

### 2. **`navigation.goBack()`**

```javascript
// Volta para a tela anterior
navigation.goBack();
```

**Usado para:** Voltar na pilha de navegação

## 📦 Estrutura de Parâmetros

### **Objeto Unidade** (passado entre telas):

```javascript
{
  id: "1",
  nome: "Centro de Saúde Exemplo",
  distancia: 2.1,
  latitude: -9.978540834183534,
  longitude: -67.80469431534507,
  horario: {
    semana: { inicio: "07:00", fim: "17:00" }
  },
  disponibilidade: [
    { remedio: "Dipirona", disponivel: true },
    // ...mais medicamentos
  ]
}
```

### **Parâmetros para MapScreen**:

```javascript
{
  unidades: [/* array de unidades */],
  remedioFiltro: "Dipirona",    // ou ""
  showAllUnits: true            // ou false
}
```

## 🎮 Como Usar a Navegação

### **Para Navegar:**

```javascript
// Em qualquer componente de tela
export default function MinhaScreen({ navigation, route }) {
  // Ir para outra tela
  const irParaDetalhes = (unidade) => {
    navigation.navigate("Detalhes", { unidade });
  };

  // Voltar
  const voltar = () => {
    navigation.goBack();
  };

  // Receber parâmetros
  const parametros = route.params;
}
```

### **Props Automáticas:**

Toda tela do Stack Navigator recebe automaticamente:

- `navigation`: Objeto com métodos de navegação
- `route`: Objeto com informações da rota atual e parâmetros

## 🚀 Exemplos Práticos

### **1. HomeScreen → MapScreen**

```javascript
// HomeScreen.js
const handleVerNoMapa = () => {
  if (busca.trim().length === 0) {
    // Sem busca - mostra todas
    navigation.navigate("Mapa", {
      unidades: unidadesOrdenadas,
      remedioFiltro: "",
      showAllUnits: true,
    });
  } else {
    // Com busca - mostra filtradas
    navigation.navigate("Mapa", {
      unidades: unidadesFiltradas,
      remedioFiltro: busca,
      showAllUnits: false,
    });
  }
};
```

### **2. MapScreen → DetailScreen**

```javascript
// MapScreen.js
const handleUnitPress = (unidade) => {
  navigation.navigate("Detalhes", { unidade });
};
```

### **3. DetailScreen → Voltar**

```javascript
// DetailScreen.js
<TouchableOpacity onPress={() => navigation.goBack()}>
  <Ionicons name="chevron-back" size={24} />
</TouchableOpacity>
```

## 📊 Stack de Navegação

```
[DetailScreen] ← Tela atual
[MapScreen]    ← navigation.goBack() vai aqui
[HomeScreen]   ← Tela inicial (sempre na base)
```

## 🛠️ Configurações Importantes

### **Headers Customizados:**

```javascript
screenOptions={{
  headerShown: false,  // Remove header padrão
}}
```

Cada tela implementa seu próprio header customizado.

### **Tela Inicial:**

```javascript
initialRouteName = "Home"; // App sempre inicia no HomeScreen
```

## 🔍 Debugging da Navegação

Para debugar problemas de navegação:

```javascript
// Ver estado atual da navegação
console.log("Navigation state:", navigation.getState());

// Ver parâmetros recebidos
console.log("Route params:", route.params);

// Ver nome da tela atual
console.log("Current screen:", route.name);
```

## 📝 Resumo

- **3 telas principais**: Home, Mapa, Detalhes
- **Stack Navigator**: Pilha simples de navegação
- **Parâmetros**: Dados passados entre telas
- **Headers customizados**: Cada tela tem seu próprio design
- **Navegação intuitiva**: Botões para ir e voltar

Essa estrutura permite uma navegação fluida e intuitiva para o usuário! 🎯
