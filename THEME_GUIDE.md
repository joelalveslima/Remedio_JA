# 🎨 Sistema de Tema Centralizado - Remédio JÁ

Este arquivo explica como usar e personalizar o sistema de tema centralizado do app "Remédio JÁ".

## 📁 Localização

O arquivo de tema está localizado em: `src/constants/theme.js`

## 🎯 Como Usar

### Cores

Para usar as cores em qualquer tela, importe as constantes:

```javascript
import { COLORS } from "../constants/theme";

// Uso em estilos
backgroundColor: COLORS.primary,
color: COLORS.textPrimary,

// Uso em componentes
<Ionicons name="location" color={COLORS.iconLocation} />
```

### Fontes

```javascript
import { FONTS, TEXT_STYLES } from "../constants/theme";

// Uso direto da fonte
fontFamily: FONTS.bold,

// Uso de estilo de texto pré-definido
...TEXT_STYLES.headerTitle,
```

### Tamanhos

```javascript
import { FONT_SIZES, SPACING } from "../constants/theme";

fontSize: FONT_SIZES.lg,
padding: SPACING.lg,
```

## 🛠️ Personalização Rápida

### Mudança de Cores Principais

Para alterar as cores do app, edite apenas o arquivo `theme.js`:

```javascript
export const COLORS = {
  primary: "#21796A", // ← Mude aqui para alterar a cor principal
  iconLocation: "#4CAF50", // ← Cor do ícone de localização
  iconTime: "#FF9800", // ← Cor do ícone de horário
  // ... outras cores
};
```

### Mudança de Fontes

```javascript
export const FONTS = {
  regular: "OpenSans_400Regular", // ← Altere para mudar fonte regular
  semiBold: "OpenSans_600SemiBold", // ← Altere para mudar fonte semi-bold
  bold: "OpenSans_700Bold", // ← Altere para mudar fonte bold
};
```

## 🎨 Cores Disponíveis

### Cores Principais

- `COLORS.primary` - Verde principal (#21796A)
- `COLORS.primaryLight` - Verde claro (#F0F9F7)

### Cores de Status

- `COLORS.success` - Verde de sucesso (#4CAF50)
- `COLORS.error` - Vermelho de erro (#B00020)
- `COLORS.warning` - Laranja de aviso (#FF9800)

### Cores de Ícones

- `COLORS.iconLocation` - Verde para localização (#4CAF50)
- `COLORS.iconTime` - Laranja para horário (#FF9800)
- `COLORS.iconPrimary` - Verde principal (#21796A)

### Cores de Texto

- `COLORS.textPrimary` - Texto principal (#333)
- `COLORS.textSecondary` - Texto secundário (#666)
- `COLORS.textLight` - Texto claro (#888)

## 📏 Tamanhos Padronizados

### Fontes

- `FONT_SIZES.xs` - 11px
- `FONT_SIZES.sm` - 12px
- `FONT_SIZES.md` - 13px
- `FONT_SIZES.base` - 14px
- `FONT_SIZES.lg` - 16px
- `FONT_SIZES.xl` - 18px
- `FONT_SIZES.title` - 24px
- `FONT_SIZES.headerTitle` - 28px

### Espaçamentos

- `SPACING.xs` - 4px
- `SPACING.sm` - 6px
- `SPACING.md` - 8px
- `SPACING.base` - 12px
- `SPACING.lg` - 16px
- `SPACING.xl` - 20px
- `SPACING.xxl` - 24px
- `SPACING.xxxl` - 32px

## ✨ Exemplos de Uso

### Exemplo 1: Botão com tema

```javascript
const styles = StyleSheet.create({
  button: {
    backgroundColor: COLORS.primary,
    padding: SPACING.lg,
    borderRadius: SPACING.base,
  },
  buttonText: {
    ...TEXT_STYLES.buttonText,
    fontSize: FONT_SIZES.lg,
  },
});
```

### Exemplo 2: Card com tema

```javascript
const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.cardBackground,
    padding: SPACING.lg,
    marginBottom: SPACING.base,
    ...SHADOWS.medium,
  },
  cardTitle: {
    ...TEXT_STYLES.cardTitle,
  },
});
```

## 🔄 Atualizações Futuras

Para mudar o tema do app inteiro:

1. Abra `src/constants/theme.js`
2. Modifique as cores, fontes ou tamanhos desejados
3. As mudanças serão aplicadas automaticamente em todo o app

### Exemplo: Mudança para tema azul

```javascript
export const COLORS = {
  primary: "#1976D2", // Azul ao invés de verde
  iconLocation: "#2196F3", // Azul claro para localização
  iconTime: "#FF9800", // Mantém laranja para horário
  // ... resto das cores
};
```

## 📱 Telas Atualizadas

As seguintes telas já usam o sistema de tema centralizado:

- ✅ HomeScreen
- ✅ MapScreen
- ✅ DetailScreen
- ✅ App.js (carregamento de fontes)

## 💡 Dicas

1. **Consistência**: Sempre use as constantes do tema ao invés de cores hardcoded
2. **Manutenibilidade**: Adicione novas cores no arquivo de tema quando necessário
3. **Performance**: Os estilos pré-definidos (`TEXT_STYLES`) evitam repetição de código
4. **Acessibilidade**: Use contrastes adequados entre cores de texto e fundo

## 🛡️ Boas Práticas

- ❌ **Evite**: `color: "#21796A"`
- ✅ **Use**: `color: COLORS.primary`

- ❌ **Evite**: `fontSize: 16, fontWeight: "bold"`
- ✅ **Use**: `...TEXT_STYLES.cardTitle`

- ❌ **Evite**: `padding: 16, marginBottom: 12`
- ✅ **Use**: `padding: SPACING.lg, marginBottom: SPACING.base`
