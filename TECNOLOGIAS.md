# Tecnologias Utilizadas - Projeto Remédio JÁ

Este documento lista todas as tecnologias, frameworks, bibliotecas e serviços utilizados no projeto Remédio JÁ, incluindo suas respectivas versões.

## 📱 Frontend (React Native/Expo)

### Framework Principal

- **React Native**: 0.81.4
- **Expo SDK**: ~54.0.11
- **React**: 19.1.0
- **React DOM**: 19.1.0

### Navegação

- **@react-navigation/native**: ^7.1.17
- **@react-navigation/stack**: ^7.4.8
- **react-native-screens**: ~4.16.0
- **react-native-gesture-handler**: ~2.28.0

### Expo Modules

- **@expo/metro-runtime**: ~6.1.2
- **expo-haptics**: ~15.0.7 (feedback tátil)
- **expo-image-picker**: ~17.0.8 (câmera e galeria)
- **expo-location**: ~19.0.7 (geolocalização)
- **expo-splash-screen**: ~31.0.10
- **expo-status-bar**: ~3.0.8

### Armazenamento e Estado

- **@react-native-async-storage/async-storage**: 2.2.0

### Utilitários

- **react-native-safe-area-context**: ~5.6.0
- **axios**: ^1.6.2 (comunicação HTTP com API)

## 🚀 Backend (Node.js/Express)

### Runtime e Gerenciador de Pacotes

- **Node.js**: 22.16.0
- **npm**: 11.4.2

### Framework Web

- **Express.js**: ^4.18.2

### Segurança e Middleware

- **cors**: ^2.8.5 (CORS)
- **helmet**: ^7.1.0 (cabeçalhos de segurança)
- **compression**: ^1.7.4 (compressão)
- **morgan**: ^1.10.0 (logging)
- **express-rate-limit**: ^7.1.5 (rate limiting)
- **express-validator**: ^7.0.1 (validação)

### Banco de Dados

- **Sequelize ORM**: ^6.35.2
- **SQLite3**: ^5.1.6 (desenvolvimento)
- **PostgreSQL (pg)**: ^8.11.3 (produção)

### Documentação API

- **swagger-jsdoc**: ^6.2.8
- **swagger-ui-express**: ^5.0.0

### Utilitários Backend

- **dotenv**: ^16.3.1 (variáveis de ambiente)
- **axios**: ^1.6.2 (requisições HTTP)

## 🛠️ Ferramentas de Desenvolvimento

### Build e Deploy

- **EAS CLI**: >= 5.2.0 (Expo Application Services)
- **Babel Core**: ^7.28.3

### Processamento de Imagens

- **Canvas**: ^3.2.0

### Desenvolvimento Backend

- **Nodemon**: ^3.0.2 (hot reload)

### Testes

- **Jest**: ^29.7.0
- **Supertest**: ^6.3.3

### Qualidade de Código

- **ESLint**: ^8.55.0
- **Prettier**: ^3.1.1

## 🌐 Serviços Externos e APIs

### Geolocalização

- **Expo Location API** (GPS e localização)

### Câmera e Galeria

- **Expo Image Picker** (acesso à câmera e galeria)

### Banco de Dados em Produção

- **PostgreSQL** (banco principal)
- **SQLite** (desenvolvimento local)

## 📋 Configurações de Ambiente

### Requisitos Mínimos

- **Node.js**: >= 18.0.0
- **npm**: >= 9.0.0

### Plataformas Suportadas

- **Android** (via Expo)
- **iOS** (via Expo)
- **Web** (via React Native Web)

## 🔧 Ferramentas de Sistema

### Controle de Versão

- **Git**: 2.51.0.windows.2

### Configurações do Projeto

- **Package.json** (gerenciamento de dependências)
- **App.json** (configurações do Expo)
- **EAS.json** (configurações de build)

## 📦 Estrutura de Dependências

### Dependências de Produção (Frontend)

```json
{
  "@expo/metro-runtime": "~6.1.2",
  "@react-native-async-storage/async-storage": "2.2.0",
  "@react-navigation/native": "^7.1.17",
  "@react-navigation/stack": "^7.4.8",
  "expo": "~54.0.11",
  "expo-haptics": "~15.0.7",
  "expo-image-picker": "~17.0.8",
  "expo-location": "~19.0.7",
  "expo-splash-screen": "~31.0.10",
  "expo-status-bar": "~3.0.8",
  "node-fetch": "^2.7.0",
  "react": "19.1.0",
  "react-native": "0.81.4",
  "react-native-gesture-handler": "~2.28.0",
  "react-native-safe-area-context": "~5.6.0",
  "react-native-screens": "~4.16.0"
}
```

### Dependências de Produção (Backend)

```json
{
  "express": "^4.18.2",
  "cors": "^2.8.5",
  "helmet": "^7.1.0",
  "compression": "^1.7.4",
  "morgan": "^1.10.0",
  "dotenv": "^16.3.1",
  "express-rate-limit": "^7.1.5",
  "express-validator": "^7.0.1",
  "sqlite3": "^5.1.6",
  "pg": "^8.11.3",
  "sequelize": "^6.35.2",
  "swagger-jsdoc": "^6.2.8",
  "swagger-ui-express": "^5.0.0",
  "axios": "^1.6.2"
}
```

---

**Última atualização**: 5 de outubro de 2025
**Versão do projeto**: 1.0.0
