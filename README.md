# 💊 Remédio Já

Um aplicativo React Native completo que ajuda usuários a encontrar medicamentos disponíveis em unidades de saúde próximas à sua localização, com funcionalidades avançadas de OCR e API backend.

## 📱 Sobre o Projeto

O **Remédio Já** é uma solução digital robusta que facilita o acesso a informações sobre disponibilidade de medicamentos em centros de saúde e postos médicos. O app oferece uma experiência completa com:

- 🔍 **Busca inteligente de medicamentos** com validação e autocomplete
- � **OCR (Reconhecimento Óptico)** para escanear receitas médicas usando Google Cloud Vision API
- 📍 **Geolocalização precisa** com cálculo de distâncias em tempo real
- ✅ **Verificação de disponibilidade** integrada com API backend
- 🗺️ **Navegação integrada** com Google Maps
- 📞 **Contato direto** com unidades de saúde
- � **Feed de notícias** sobre campanhas de saúde
- 🎨 **Interface moderna** com animações fluidas e design responsivo

## 🚀 Funcionalidades Principais

### 🏠 Tela Principal (Home)

- **Busca inteligente** com validação de segurança e sanitização de dados
- **Scanner OCR** para capturar medicamentos de receitas médicas via câmera
- **Lista dinâmica** de unidades filtradas por medicamento
- **Geolocalização automática** com indicador GPS visual
- **Cálculo de distâncias** em tempo real
- **Indicadores visuais** de disponibilidade com cores e ícones
- **Feedback háptico** para melhor experiência do usuário

### 🏥 Tela de Detalhes

- **Informações completas** da unidade de saúde
- **Lista completa** de medicamentos disponíveis
- **Horários de funcionamento** detalhados
- **Botões de ação** (Ver no Mapa, Ligar) com integração nativa
- **Distância calculada** em tempo real
- **Informações importantes** sobre documentação e procedimentos

### 🗺️ Tela de Mapa

- **Visualização interativa** de todas as unidades
- **Marcadores inteligentes** com cores indicando disponibilidade
- **Pop-ups informativos** ao tocar nos marcadores
- **Integração com Google Maps** para navegação

### 📰 Tela de Notícias

- **Feed de campanhas de saúde** com informações atualizadas
- **Categorização por tipo** (Vacinação, Prevenção, Saúde Mental, etc.)
- **Sistema de prioridades** com destaque visual
- **Conteúdo expansível** para leitura completa
- **Interface responsiva** com design moderno

## 🛠️ Tecnologias e Arquitetura

### Frontend (React Native/Expo)

- **React Native 0.81.4** - Framework principal para desenvolvimento mobile
- **Expo SDK 54** - Plataforma de desenvolvimento e build
- **React Navigation 7** - Sistema de navegação com transições customizadas
- **Expo Location** - Serviços de geolocalização
- **Expo Image Picker** - Captura de imagens para OCR
- **Expo Haptics** - Feedback tátil
- **Ionicons** - Biblioteca de ícones vetoriais
- **Async Storage** - Persistência local de dados

### Backend (Node.js API)

- **Node.js** - Runtime JavaScript
- **Express.js** - Framework web
- **Sequelize ORM** - Mapeamento objeto-relacional
- **SQLite/PostgreSQL** - Banco de dados
- **Swagger** - Documentação da API
- **Jest** - Framework de testes

### Serviços Externos

- **Google Cloud Vision API** - OCR para reconhecimento de texto em receitas
- **Google Maps API** - Integração de mapas e navegação
- **Expo Location Services** - Geolocalização precisa

### Arquitetura do Projeto

```
Remedio_JA/
├── src/                          # Código fonte do app
│   ├── screens/                  # Telas da aplicação
│   │   ├── HomeScreen.js         # Tela principal com busca e OCR
│   │   ├── DetailScreen.js       # Detalhes da unidade
│   │   ├── MapScreen.js          # Visualização em mapa
│   │   └── NewsScreen.js         # Feed de notícias de saúde
│   ├── constants/                # Constantes e tema
│   │   └── theme.js              # Cores, fontes e estilos
│   ├── data/                     # Dados estáticos
│   │   ├── unidades.js           # Base de dados das unidades
│   │   └── healthNews.js         # Notícias de campanhas de saúde
│   ├── services/                 # Serviços de API
│   │   ├── api.js                # Cliente HTTP para backend
│   │   └── dataAdapter.js        # Adaptador de dados
│   ├── utils/                    # Utilitários
│   │   ├── locationUtils.js      # Cálculos de geolocalização
│   │   ├── ocrUtils.js           # OCR com Google Vision
│   │   ├── ocrDataManager.js     # Gerenciamento de dados OCR
│   │   └── safeAreaUtils.js      # Layout responsivo
│   └── localization/             # Textos da aplicação
│       └── index.js              # Strings localizadas
├── api/                          # Backend Node.js
│   ├── src/
│   │   ├── controllers/          # Controladores da API
│   │   ├── models/               # Modelos de dados
│   │   ├── routes/               # Rotas da API
│   │   ├── middleware/           # Middlewares
│   │   ├── database/             # Configuração do banco
│   │   └── config/               # Configurações
│   └── package.json              # Dependências do backend
├── assets/                       # Recursos estáticos
├── test/                         # Testes de integração
└── App.js                        # Componente raiz
```

## 📋 Pré-requisitos

### Para o Frontend (App React Native)

- **Node.js** (versão 18 ou superior)
- **npm** ou **yarn**
- **Expo CLI** instalado globalmente (`npm install -g @expo/cli`)
- **Dispositivo Android/iOS** ou emulador
- **Expo Go app** (para teste em dispositivo físico)

### Para o Backend (API)

- **Node.js** (versão 16 ou superior)
- **npm** ou **yarn**
- **SQLite** (para desenvolvimento) ou **PostgreSQL** (para produção)

### Serviços Externos (Opcionais)

- **Google Cloud Platform** - Para funcionalidades OCR
- **Google Maps API Key** - Para navegação avançada

## 🔧 Instalação e Execução

### 1. Clone o repositório

```bash
git clone https://github.com/joelalveslima/Remedio_JA.git
cd Remedio_JA
```

### 2. Configuração do Frontend

```bash
# Instalar dependências
npm install

# Iniciar o projeto Expo
npx expo start
```

### 3. Configuração do Backend (Opcional)

```bash
# Navegar para o diretório da API
cd api

# Instalar dependências
npm install

# Configurar banco de dados
npm run db:setup

# Iniciar servidor de desenvolvimento
npm run dev
```

### 4. Execute no dispositivo

- **Expo Go**: Escaneie o QR code com o app Expo Go (Android/iOS)
- **Emulador**: Pressione `a` para Android ou `i` para iOS
- **Web**: Pressione `w` para abrir no navegador

## 📱 Como Usar

### 🔍 Buscar Medicamento

1. **Busca Manual**: Digite o nome do medicamento no campo de pesquisa
2. **Scanner OCR**: Toque no ícone da câmera para escanear uma receita médica
3. **Filtros**: O app filtra automaticamente as unidades que possuem o medicamento

### 📍 Localização

1. **Permissões**: Permita acesso à localização quando solicitado
2. **GPS Ativo**: O indicador GPS mostra o status da localização
3. **Distâncias**: Calculadas automaticamente em tempo real
4. **Ordenação**: Unidades ordenadas por proximidade

### 🏥 Detalhes da Unidade

1. **Toque no Card**: Acesse informações completas da unidade
2. **Lista de Medicamentos**: Veja todos os medicamentos disponíveis
3. **Ações Rápidas**: Use "Ver no Mapa" ou "Ligar" para contato

### 🗺️ Navegação

- **Visualização em Mapa**: Toque em "MAPA" para ver todas as unidades
- **Marcadores Coloridos**: Verde (disponível), Vermelho (indisponível)
- **Navegação Externa**: Integração com Google Maps para direções

### 📰 Notícias de Saúde

- **Feed Atualizado**: Campanhas e informações de saúde pública
- **Categorias**: Vacinação, Prevenção, Saúde Mental, etc.
- **Conteúdo Expansível**: Toque para ler informações completas

## � Configuração Avançada

### Configuração do Google Cloud Vision (OCR)

Para habilitar a funcionalidade de OCR, você precisa:

1. **Criar projeto no Google Cloud Platform**
2. **Habilitar a Vision API**
3. **Gerar chave de API**
4. **Criar arquivo de configuração** (não incluído no repositório por segurança):

```javascript
// src/config/apiKeys.js
export const GOOGLE_CLOUD_CONFIG = {
  API_KEY: "sua-api-key-aqui",
  VISION_API_URL: "https://vision.googleapis.com/v1/images:annotate",
  FEATURES: [{ type: "TEXT_DETECTION", maxResults: 10 }],
  IMAGE_CONTEXT: { languageHints: ["pt"] },
};
```

### Configuração da API Backend

O projeto inclui uma API completa em Node.js:

```bash
# Configurar variáveis de ambiente
cp api/.env.example api/.env

# Editar configurações do banco de dados
nano api/.env

# Executar migrações
cd api && npm run db:migrate

# Popular dados iniciais
npm run db:seed
```

### Scripts Disponíveis

#### Frontend

```bash
npm start          # Inicia o Expo
npm run android    # Executa no Android
npm run ios        # Executa no iOS
npm run web        # Executa no navegador
```

#### Backend

```bash
npm run dev        # Servidor de desenvolvimento
npm run start      # Servidor de produção
npm run test       # Executar testes
npm run db:setup   # Configurar banco de dados
npm run db:reset   # Resetar banco de dados
```

## 🧪 Testes

O projeto inclui testes de integração para a API:

```bash
# Testar integração com a API
cd test
node api-integration.js

# Teste rápido de funcionalidades
node quick-test.js
```

## 🎯 Recursos Técnicos Avançados

### 🔒 Segurança e Validação

- **Sanitização de entrada** com regex para prevenir ataques
- **Validação de dados** em tempo real
- **Proteção contra XSS** e injection attacks
- **Uso responsável de dados de localização**

### 🎨 Interface e UX

- **Design System** completo com tema unificado
- **Animações fluidas** com Animated API
- **Feedback háptico** para interações
- **Layout responsivo** para diferentes tamanhos de tela
- **Safe Area** automático para diferentes dispositivos

### ⚡ Performance

- **Lazy loading** de componentes
- **Otimização de imagens** automática
- **Cache inteligente** de dados de localização
- **Debounce** em buscas para reduzir requisições

### 📊 Dados e Estado

- **Persistência local** com AsyncStorage
- **Gerenciamento de estado** otimizado
- **Sincronização** com API backend
- **Fallback** para dados offline

## 🎯 Objetivo e Impacto Social

O **Remédio Já** foi desenvolvido com o objetivo de **democratizar o acesso à saúde pública**, oferecendo uma ferramenta tecnológica que:

### 🏥 Benefícios para Cidadãos

- **Economiza tempo** na busca por medicamentos
- **Evita deslocamentos desnecessários** a unidades sem o medicamento
- **Fornece informações confiáveis** sobre disponibilidade em tempo real
- **Facilita o contato** direto com unidades de saúde
- **Melhora a experiência** no uso do SUS (Sistema Único de Saúde)

### � Impacto na Saúde Pública

- **Reduz sobrecarga** nas unidades de saúde
- **Otimiza distribuição** de medicamentos
- **Melhora gestão** de recursos públicos
- **Aumenta satisfação** dos usuários do SUS
- **Promove transparência** na disponibilidade de medicamentos

### 🔬 Inovação Tecnológica

- **OCR inteligente** para reconhecimento de receitas médicas
- **Geolocalização precisa** com cálculo de rotas otimizadas
- **Interface acessível** seguindo diretrizes de usabilidade
- **Arquitetura escalável** preparada para expansão nacional

## 🌟 Diferenciais do Projeto

### 💡 Tecnologia de Ponta

- **Integração com Google Cloud Vision** para OCR profissional
- **API REST completa** com documentação Swagger
- **Banco de dados robusto** com Sequelize ORM
- **Testes automatizados** para garantia de qualidade

### 🎨 Experiência do Usuário

- **Design moderno** seguindo Material Design e Human Interface Guidelines
- **Animações suaves** para transições entre telas
- **Feedback visual e tátil** para todas as interações
- **Acessibilidade** para usuários com necessidades especiais

### 🔧 Arquitetura Profissional

- **Código limpo** seguindo boas práticas de desenvolvimento
- **Componentização** reutilizável e manutenível
- **Separação de responsabilidades** clara entre camadas
- **Documentação completa** para facilitar manutenção

## 🤝 Contribuições e Desenvolvimento

Este projeto representa um **portfólio profissional** demonstrando competências em:

### 📱 Desenvolvimento Mobile

- **React Native/Expo** avançado com navegação complexa
- **Integração de APIs** externas (Google Cloud, Maps)
- **Geolocalização** e serviços nativos
- **Otimização de performance** para dispositivos móveis

### ⚙️ Backend e APIs

- **Node.js/Express** com arquitetura REST
- **Banco de dados** com relacionamentos complexos
- **Middleware** personalizado para autenticação e validação
- **Documentação automática** com Swagger

### 🔒 Boas Práticas

- **Segurança** com sanitização e validação
- **Testes** automatizados e integração contínua
- **Versionamento** com Git seguindo padrões profissionais
- **Código limpo** com ESLint e Prettier

---

## 📝 Licença

Este projeto foi desenvolvido para fins educacionais e de portfólio profissional.

**Desenvolvido com ❤️ para melhorar o acesso à saúde pública no Brasil**

---

## 📞 Contato e Suporte

Para dúvidas, sugestões ou oportunidades de colaboração:

- **GitHub**: [joelalveslima](https://github.com/joelalveslima)
- **LinkedIn**: [Joel Alves Lima](https://linkedin.com/in/joelalveslima)
- **Email**: joelalveslima@exemplo.com

---

### 🔄 Atualizações Recentes

- **v1.0.0** - Lançamento inicial com todas as funcionalidades principais
- **OCR Integration** - Implementação completa do reconhecimento de receitas
- **Backend API** - API REST completa com banco de dados
- **News Feed** - Sistema de notícias de campanhas de saúde
- **Performance Optimization** - Melhorias significativas de performance

> **Nota**: Este README foi atualizado para refletir o estado atual do projeto com todas as funcionalidades implementadas.
