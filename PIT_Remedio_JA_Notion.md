# PIT - Plano de Investimento e Tecnologia

# Projeto: Remedio_JA

---

## 📋 RESUMO EXECUTIVO

**Nome do Projeto:** Remedio_JA
**Tipo:** Aplicativo Mobile de Saúde Pública
**Plataforma:** React Native (iOS/Android)
**Status Atual:** MVP Desenvolvido
**Data:** Setembro 2025

### Objetivo Principal

> Facilitar o acesso à informação sobre medicamentos disponíveis no SUS através de tecnologia OCR e fornecer notícias relevantes sobre saúde pública.

---

## 🎯 ANÁLISE DE MERCADO

### Problema Identificado

- Dificuldade dos usuários em encontrar medicamentos disponíveis no SUS
- Falta de informação centralizada sobre campanhas de saúde
- Processo manual e demorado para verificar disponibilidade de medicamentos

### Público-Alvo

**Primário:** Usuários do SUS (todas as idades)
**Secundário:** Profissionais de saúde
**Terciário:** Cuidadores e familiares

### Tamanho do Mercado

- 75% da população brasileira depende exclusivamente do SUS
- Aproximadamente **150 milhões** de usuários potenciais
- Crescimento do mercado de saúde digital: **25% ao ano**

---

## 💡 PROPOSTA DE VALOR

### Funcionalidades Principais

**1. OCR de Receitas Médicas**

- Reconhecimento automático de medicamentos
- Verificação de disponibilidade no SUS
- Interface simples com botão "Tirar Foto"

**2. Feed de Notícias de Saúde**

- 15+ notícias categorizadas
- Informações sobre campanhas e programas
- Interface moderna com priorização de conteúdo

**3. Interface Moderna**

- Design nativo (SF Pro Display/Roboto)
- Safe Area para dispositivos modernos
- Navegação intuitiva

### Diferenciais Competitivos

✅ **Tecnologia OCR** integrada
✅ **Dados oficiais** do SUS
✅ **Interface moderna** e acessível
✅ **Gratuito** para usuários finais

---

## 🛠 ARQUITETURA TÉCNICA

### Stack Tecnológico Atual

```
Frontend: React Native + Expo SDK 53
Navegação: @react-navigation/native
Utilitários: expo-constants, react-native-gesture-handler
Tipografia: Sistema nativo (SF Pro Display/Roboto)
Safe Areas: Utilitários customizados com detecção de notch
```

### Estrutura do Projeto

```
src/
├── screens/           # Telas principais
│   ├── HomeScreen.js     # Tela inicial com OCR
│   ├── DetailScreen.js   # Detalhes dos medicamentos
│   ├── MapScreen.js      # Localização (futuro)
│   └── NewsScreen.js     # Feed de notícias
├── data/             # Dados estruturados
│   └── healthNews.js     # Base de notícias
├── constants/        # Configurações
│   └── theme.js          # Sistema de design
└── utils/           # Utilitários
    └── safeAreaUtils.js  # Safe areas customizadas
```

### Qualidade do Código

- ✅ Componentização modular
- ✅ Tipografia centralizada
- ✅ Safe Areas consistentes
- ✅ Código limpo (sem console.logs)
- ✅ Navegação otimizada

---

## 📈 PLANO DE DESENVOLVIMENTO

### Fase 1: MVP Atual (Concluída) - R$ 0

- [x] Interface básica
- [x] Estrutura de navegação
- [x] Feed de notícias
- [x] Design moderno
- [x] OCR interface preparada

### Fase 2: Funcionalidades Core (3-6 meses) - R$ 25.000

**Integração OCR Real**

- Implementação de ML Kit ou similar
- Processamento de imagens
- Extração de texto de receitas

**Base de Dados SUS**

- API de medicamentos disponíveis
- Integração com sistemas oficiais
- Cache local para performance

**Sistema de Busca Avançada**

- Busca por princípio ativo
- Filtros por categoria
- Sugestões inteligentes

### Fase 3: Expansão (6-12 meses) - R$ 45.000

**Geolocalização**

- Mapa de farmácias SUS
- Disponibilidade em tempo real
- Rotas otimizadas

**Perfil do Usuário**

- Histórico de consultas
- Medicamentos favoritos
- Notificações personalizadas

**Backend Robusto**

- API própria
- Banco de dados escalável
- Sistema de analytics

### Fase 4: Monetização (12+ meses) - R$ 30.000

**Parcerias Institucionais**

- Integração com prefeituras
- Dados oficiais em tempo real
- Certificações de segurança

**Features Premium**

- Relatórios detalhados
- Suporte prioritário
- Funcionalidades avançadas

---

## 💰 MODELO DE NEGÓCIO

### Receitas Potenciais

**1. Contratos Governamentais**

- **Valor:** R$ 50.000 - R$ 200.000/ano por município
- **Potencial:** 100+ municípios interessados
- **ROI:** 300-500%

**2. Parcerias com Farmácias**

- **Modelo:** Comissão por direcionamento
- **Valor:** R$ 2-5 por usuário direcionado
- **Volume:** 1.000+ usuários/mês

**3. Licenciamento de Tecnologia**

- **Valor:** R$ 100.000 - R$ 500.000
- **Clientes:** Redes de farmácias, planos de saúde
- **Recorrência:** Anual

**4. Consultoria em Saúde Digital**

- **Valor:** R$ 150/hora
- **Demanda:** Crescente no setor público

### Projeção Financeira (3 anos)

> **Ano 1:** R$ 80.000 (2 contratos municipais)
> **Ano 2:** R$ 250.000 (5 contratos + parcerias)
> **Ano 3:** R$ 500.000 (10 contratos + licenciamento)

---

## 🚀 ESTRATÉGIA DE LANÇAMENTO

### Fase de Testes (1-2 meses)

**Beta Testing**

- 100 usuários selecionados
- Feedback estruturado
- Melhorias baseadas em dados

**Validação Técnica**

- Testes de performance
- Validação de OCR
- Integração com APIs

### Lançamento Público (3-4 meses)

**Marketing Digital**

- Redes sociais focadas em saúde
- Parcerias com influenciadores da área
- SEO para termos relacionados ao SUS

**Parcerias Estratégicas**

- Secretarias municipais de saúde
- Associações médicas
- ONGs de saúde pública

### Expansão (6+ meses)

**Escalabilidade Regional**

- Foco em regiões carentes
- Adaptação para realidades locais
- Suporte multilíngue (futuro)

**Funcionalidades Avançadas**

- IA para recomendações
- Telemedicina básica
- Integração com dispositivos IoT

---

## ⚠️ ANÁLISE DE RISCOS

### Riscos Técnicos

| Risco               | Probabilidade | Impacto | Mitigação                            |
| ------------------- | ------------- | ------- | ------------------------------------ |
| Falhas no OCR       | Média         | Alto    | Múltiplos providers, fallback manual |
| Performance mobile  | Baixa         | Médio   | Testes contínuos, otimização         |
| Integração APIs SUS | Alta          | Alto    | APIs alternativas, cache robusto     |

### Riscos de Mercado

| Risco                 | Probabilidade | Impacto | Mitigação                           |
| --------------------- | ------------- | ------- | ----------------------------------- |
| Concorrência          | Média         | Médio   | Diferenciação, parcerias exclusivas |
| Mudanças regulatórias | Baixa         | Alto    | Acompanhamento legal, flexibilidade |
| Resistência usuários  | Baixa         | Médio   | UX excelente, educação do mercado   |

### Riscos Financeiros

| Risco                    | Probabilidade | Impacto | Mitigação                                 |
| ------------------------ | ------------- | ------- | ----------------------------------------- |
| Falta de investimento    | Média         | Alto    | Múltiplas fontes, desenvolvimento gradual |
| Custos de infraestrutura | Baixa         | Médio   | Cloud escalável, otimização               |

---

## 📊 MÉTRICAS DE SUCESSO

### KPIs Técnicos

- **Precisão OCR:** >85%
- **Tempo de resposta:** <3 segundos
- **Taxa de erro:** <5%
- **Disponibilidade:** >99%

### KPIs de Produto

- **Downloads:** 10.000 (6 meses)
- **Usuários ativos:** 2.000/mês
- **Retenção:** >60% (30 dias)
- **NPS:** >70

### KPIs de Negócio

- **Receita:** R$ 80.000 (ano 1)
- **Contratos:** 2 municípios
- **ROI:** >200%
- **Payback:** 18 meses

---

## 🎯 PRÓXIMOS PASSOS

### Imediato (1 mês)

**Validação de Mercado**

- Pesquisa com usuários SUS
- Entrevistas com profissionais de saúde
- Análise de concorrência detalhada

**Planejamento Técnico**

- Escolha de provider OCR
- Arquitetura de backend
- Estratégia de dados

### Curto Prazo (3 meses)

**Desenvolvimento Core**

- Implementação OCR
- Base de dados SUS
- Testes de integração

**Captação de Recursos**

- Editais de inovação
- Investidores anjo
- Parcerias estratégicas

### Médio Prazo (6 meses)

**Lançamento Beta**

- Teste com usuários reais
- Ajustes baseados em feedback
- Preparação para lançamento

**Primeiros Contratos**

- Negociação com municípios
- Implementação piloto
- Cases de sucesso

---

## 💡 CONCLUSÃO

O projeto **Remedio_JA** apresenta alto potencial de impacto social e viabilidade comercial. Com investimento inicial de R$ 100.000 e execução estruturada, pode gerar receita recorrente significativa enquanto resolve um problema real de saúde pública.

### Fatores de Sucesso

- **Problema real e relevante**
- **Tecnologia diferenciada** (OCR)
- **Mercado amplo** (SUS)
- **Modelo de negócio escalável**
- **Impacto social positivo**

### Recomendação

> **Avançar com o desenvolvimento** priorizando a validação de mercado e implementação das funcionalidades core. O timing é favorável com o crescimento da saúde digital no Brasil.

---

**Documento elaborado em:** Setembro 2025
**Versão:** 1.0
**Próxima revisão:** Dezembro 2025
