# 💊 Remédio Já

Um aplicativo React Native que ajuda usuários a encontrar medicamentos disponíveis em unidades de saúde próximas à sua localização.

## 📱 Sobre o Projeto

O **Remédio Já** é uma solução digital que facilita o acesso a informações sobre disponibilidade de medicamentos em centros de saúde e postos médicos. O app permite que os usuários:

- 🔍 **Busquem medicamentos específicos** por nome
- 📍 **Encontrem unidades de saúde próximas** com base na localização real
- ✅ **Verifiquem a disponibilidade** de medicamentos em tempo real
- 🗺️ **Naveguem até as unidades** através de integração com mapas
- 📞 **Entrem em contato** diretamente com as unidades de saúde

## 🚀 Funcionalidades

### Tela Principal (Home)

- Campo de busca inteligente com validação de segurança
- Lista de unidades filtradas por medicamento pesquisado
- Cálculo automático de distância baseado na localização do usuário
- Indicação visual de disponibilidade (disponível/indisponível)
- Botão "Minha Localização" para obter posição atual
- Integração com mapas para visualização geral

### Tela de Detalhes

- Informações completas da unidade de saúde
- Lista detalhada de todos os medicamentos disponíveis
- Horários de funcionamento
- Botões de ação (Ver no Mapa, Ligar)
- Cálculo de distância em tempo real
- Informações importantes sobre documentação necessária

### Tela de Mapa

- Visualização de todas as unidades em mapa interativo
- Marcadores coloridos indicando disponibilidade
- Informações rápidas ao tocar nos marcadores

## 🛠️ Tecnologias Utilizadas

- **React Native** - Framework principal
- **Expo** - Plataforma de desenvolvimento
- **React Navigation** - Navegação entre telas
- **Expo Location** - Serviços de geolocalização
- **Ionicons** - Ícones vetoriais
- **JavaScript/ES6+** - Linguagem de programação

## 📋 Pré-requisitos

- Node.js (versão 16 ou superior)
- Expo CLI instalado globalmente
- Dispositivo Android/iOS ou emulador
- Expo Go app (para teste em dispositivo físico)

## 🔧 Instalação e Execução

1. **Clone o repositório:**

```bash
git clone <url-do-repositorio>
cd Remedio_JA
```

2. **Instale as dependências:**

```bash
npm install
```

3. **Inicie o projeto:**

```bash
npx expo start
```

4. **Execute no dispositivo:**
   - Escaneie o QR code com o app Expo Go (Android/iOS)
   - Ou pressione `a` para Android / `i` para iOS (emulador)

## 📱 Como Usar

1. **Buscar Medicamento:**

   - Digite o nome do medicamento no campo de busca
   - O app filtrará automaticamente as unidades que possuem o medicamento

2. **Localização:**

   - Permita acesso à localização quando solicitado
   - O app calculará automaticamente as distâncias reais

3. **Detalhes da Unidade:**

   - Toque em qualquer card para ver detalhes completos
   - Verifique todos os medicamentos disponíveis na unidade

4. **Navegação:**
   - Use "Ver no Mapa" para abrir no Google Maps
   - Use "Ligar" para contato direto com a unidade

## 🗺️ Estrutura do Projeto

```
Remedio_JA/
├── src/
│   └── screens/
│       ├── HomeScreen.js      # Tela principal com busca
│       ├── DetailScreen.js    # Detalhes da unidade
│       └── MapScreen.js       # Visualização em mapa
├── assets/                    # Imagens e ícones
├── App.js                     # Componente principal
├── package.json               # Dependências do projeto
└── README.md                  # Este arquivo
```

## 🎯 Objetivo Social

O projeto foi desenvolvido com o objetivo de **facilitar o acesso à saúde pública**, ajudando cidadãos a:

- Economizar tempo na busca por medicamentos
- Evitar deslocamentos desnecessários
- Ter informações confiáveis sobre disponibilidade
- Melhorar a experiência no uso do SUS (Sistema Único de Saúde)

## 🔒 Segurança e Privacidade

- Validação de entrada com regex para prevenir ataques
- Sanitização de dados de busca
- Uso responsável de dados de localização
- Não armazenamento de dados pessoais

## 🤝 Contribuições

Este é um projeto educacional desenvolvido durante o curso de programação. Sugestões e melhorias são sempre bem-vindas!

