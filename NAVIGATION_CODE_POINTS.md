# 🔍 Pontos de Navegação no Código - Análise Detalhada

## 📍 Localização Exata dos Comandos de Navegação

### 🏠 **HomeScreen.js**

#### **Linha 223-228**: Navegação para Mapa (sem busca)

```javascript
navigation.navigate("Mapa", {
  unidades: unidadesOrdenadas,
  remedioFiltro: "",
  showAllUnits: true, // Flag para indicar que deve mostrar todas as unidades
});
```

**Contexto**: Botão "Ver no Mapa" quando não há texto na busca

#### **Linha 230-235**: Navegação para Mapa (com busca)

```javascript
navigation.navigate("Mapa", {
  unidades: unidadesFiltradas,
  remedioFiltro: busca,
  showAllUnits: false,
});
```

**Contexto**: Botão "Ver no Mapa" quando há texto na busca

#### **Linha 239**: Navegação para Detalhes

```javascript
navigation.navigate("Detalhes", { unidade });
```

**Contexto**: Clique em um card de unidade na lista

---

### 🗺️ **MapScreen.js**

#### **Linha 128**: Navegação para Detalhes

```javascript
navigation.navigate("Detalhes", { unidade });
```

**Contexto**: Clique em um card de unidade no mapa

#### **Linha 136**: Voltar para tela anterior

```javascript
onPress={() => navigation.goBack()}
```

**Contexto**: Botão de voltar no header

---

### 📋 **DetailScreen.js**

#### **Linha 210**: Voltar para tela anterior

```javascript
onPress={() => navigation.goBack()}
```

**Contexto**: Botão de voltar no header

## 🎯 Funções que Gerenciam Navegação

### **HomeScreen.js**

#### **`handleVerNoMapa()` - Linhas 218-236**

```javascript
const handleVerNoMapa = () => {
  // Se não há busca, envia todas as unidades ordenadas por distância (usando GPS se disponível)
  if (busca.trim().length === 0) {
    const unidadesOrdenadas = [...unidadesComDistancia].sort((a, b) => {
      return parseFloat(a.distancia) - parseFloat(b.distancia);
    });

    navigation.navigate("Mapa", {
      unidades: unidadesOrdenadas,
      remedioFiltro: "",
      showAllUnits: true, // Flag para indicar que deve mostrar todas as unidades
    });
  } else {
    // Se há busca, envia apenas as unidades filtradas
    navigation.navigate("Mapa", {
      unidades: unidadesFiltradas,
      remedioFiltro: busca,
      showAllUnits: false,
    });
  }
};
```

#### **`handleCardPress()` - Linhas 238-240**

```javascript
const handleCardPress = (unidade) => {
  navigation.navigate("Detalhes", { unidade });
};
```

### **MapScreen.js**

#### **`handleUnitPress()` - Linhas 127-129**

```javascript
const handleUnitPress = (unidade) => {
  navigation.navigate("Detalhes", { unidade });
};
```

## 🎨 Elementos UI que Acionam Navegação

### **HomeScreen.js**

#### **Botão "Ver no Mapa" - Linhas 316-325**

```javascript
<TouchableOpacity style={styles.mapButton} onPress={handleVerNoMapa}>
  <Ionicons
    name="map-outline"
    size={18}
    color={COLORS.iconPrimary}
    style={{ marginRight: 6 }}
  />
  <Text style={styles.mapButtonText}>{texts.viewOnMap}</Text>
</TouchableOpacity>
```

#### **Card da Unidade - Linhas 365-367**

```javascript
<TouchableOpacity
  style={styles.card}
  onPress={() => handleCardPress(item)}
  activeOpacity={0.7}
>
```

### **MapScreen.js**

#### **Botão Voltar no Header - Linhas 134-140**

```javascript
<TouchableOpacity
  onPress={() => navigation.goBack()}
  style={{ marginRight: 16 }}
>
  <Ionicons name="chevron-back" size={24} color={COLORS.iconWhite} />
</TouchableOpacity>
```

#### **Card da Unidade no Mapa - Linhas 196-198**

```javascript
<TouchableOpacity
  style={styles.unitCard}
  onPress={() => handleUnitPress(item)}
>
```

### **DetailScreen.js**

#### **Botão Voltar no Header - Linhas 208-214**

```javascript
<TouchableOpacity
  onPress={() => navigation.goBack()}
  style={{ marginRight: 16 }}
>
  <Ionicons name="chevron-back" size={24} color={COLORS.iconWhite} />
</TouchableOpacity>
```

## 📊 Parâmetros Passados Entre Telas

### **Home → Mapa**

```javascript
// Parâmetros enviados
{
  unidades: Array,        // Lista de unidades
  remedioFiltro: String,  // Texto da busca ou ""
  showAllUnits: Boolean   // true = todas, false = filtradas
}

// Como é recebido no MapScreen
const { unidades, remedioFiltro, showAllUnits } = route.params;
```

### **Home/Mapa → Detalhes**

```javascript
// Parâmetro enviado
{
  unidade: Object; // Dados completos da unidade
}

// Como é recebido no DetailScreen
const { unidade } = route.params;
```

## 🔄 Fluxo de Dados na Navegação

```
HomeScreen
    │
    ├─ Busca por "Dipirona"
    │     │
    │     └─ unidadesFiltradas = [unidades com Dipirona disponível]
    │           │
    │           └─ handleVerNoMapa()
    │                 │
    │                 └─ navigation.navigate("Mapa", {
    │                      unidades: unidadesFiltradas,
    │                      remedioFiltro: "Dipirona",
    │                      showAllUnits: false
    │                    })
    │
MapScreen
    │
    ├─ Recebe: route.params = {unidades, remedioFiltro, showAllUnits}
    │     │
    │     └─ Renderiza lista filtrada
    │           │
    │           └─ Usuário clica em uma unidade
    │                 │
    │                 └─ handleUnitPress(unidade)
    │                       │
    │                       └─ navigation.navigate("Detalhes", { unidade })
    │
DetailScreen
    │
    └─ Recebe: route.params = { unidade }
          │
          └─ Exibe detalhes completos da unidade
                │
                └─ Botão voltar: navigation.goBack()
```

## 🛠️ Props de Navegação

Cada componente de tela recebe automaticamente:

```javascript
export default function MinhaScreen({ navigation, route }) {
  // navigation: objeto com métodos de navegação
  // route: objeto com informações da rota e parâmetros
}
```

### **Métodos do `navigation`:**

- `navigate(screen, params)` - Vai para tela específica
- `goBack()` - Volta para tela anterior
- `getState()` - Estado atual da navegação (debug)

### **Propriedades do `route`:**

- `name` - Nome da tela atual
- `params` - Parâmetros recebidos
- `key` - Chave única da rota

## 🎯 Resumo dos Pontos de Navegação

| Origem   | Destino    | Linha | Trigger                         | Dados Passados                                              |
| -------- | ---------- | ----- | ------------------------------- | ----------------------------------------------------------- |
| Home     | Mapa       | 223   | Botão "Ver no Mapa" (sem busca) | unidades, remedioFiltro="", showAllUnits=true               |
| Home     | Mapa       | 230   | Botão "Ver no Mapa" (com busca) | unidades filtradas, remedioFiltro=busca, showAllUnits=false |
| Home     | Detalhes   | 239   | Clique no card                  | unidade                                                     |
| Mapa     | Detalhes   | 128   | Clique no card                  | unidade                                                     |
| Mapa     | ← Home     | 136   | Botão voltar                    | -                                                           |
| Detalhes | ← Anterior | 210   | Botão voltar                    | -                                                           |

Essa estrutura garante uma navegação fluida e intuitiva! 🚀
