# 🔑 Guia de Configuração das Chaves de API

## 📋 Configuração da Google Cloud Vision API

### 1. Criar Projeto no Google Cloud

1. Acesse o [Google Cloud Console](https://console.cloud.google.com/)
2. Clique em "Selecionar projeto" e depois "Novo projeto"
3. Dê um nome ao projeto (ex: "remedio-ja-ocr")
4. Clique em "Criar"

### 2. Ativar a API do Cloud Vision

1. No menu lateral, vá em **APIs e serviços** > **Biblioteca**
2. Procure por "Cloud Vision API"
3. Clique na API e depois em **"Ativar"**

### 3. Criar Chave de API

1. Vá em **APIs e serviços** > **Credenciais**
2. Clique em **"+ Criar credenciais"** > **"Chave de API"**
3. Uma janela aparecerá com sua chave - **copie e guarde**
4. Clique em **"Restringir chave"** para maior segurança

### 4. Configurar Restrições de Segurança

#### Restrições de API (Recomendado):

- Selecione "Restringir chave"
- Marque apenas "Cloud Vision API"

#### Restrições de Aplicativo (Opcional):

- **Para desenvolvimento**: Selecione "Nenhuma"
- **Para produção**: Configure IP/HTTP referrers

### 5. Configurar no App

1. Copie o arquivo `src/config/apiKeys.example.js` para `src/config/apiKeys.js`
2. Substitua `SUA_CHAVE_GOOGLE_CLOUD_VISION_API_AQUI` pela sua chave real
3. Salve o arquivo

```javascript
export const GOOGLE_CLOUD_CONFIG = {
  API_KEY: "AIzaSyBxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx", // Sua chave aqui
  // ... resto das configurações
};
```

## 💰 Controle de Custos

### Quotas e Limites

- **Gratuito**: 1.000 detecções de texto por mês
- **Pago**: $1.50 por 1.000 detecções adicionais

### Monitoramento

1. Vá em **APIs e serviços** > **Quotas**
2. Configure alertas de uso em **Monitoramento** > **Alertas**
3. Defina limites de gastos em **Faturamento**

### Otimizações para Reduzir Custos

- Use qualidade de imagem adequada (0.8 no app)
- Implemente cache local de resultados
- Configure timeout para evitar requisições longas
- Use fallback para simulação em desenvolvimento

## 🔒 Segurança

### ✅ Boas Práticas

- ✅ Arquivo `apiKeys.js` está no `.gitignore`
- ✅ Use restrições de API no Google Cloud
- ✅ Configure alertas de uso anômalo
- ✅ Rotacione chaves periodicamente
- ✅ Use variáveis de ambiente em produção

### ❌ Evite

- ❌ Nunca faça commit de chaves reais
- ❌ Não compartilhe chaves por email/chat
- ❌ Não use a mesma chave para múltiplos projetos
- ❌ Não deixe chaves sem restrições

## 🧪 Teste da Configuração

### Verificar se a API está funcionando:

1. Execute o app: `npm start`
2. Toque no botão de câmera na busca
3. Capture uma imagem com texto
4. Verifique os logs do console:

```javascript
// API funcionando:
✅ "Texto detectado: [nome do medicamento]"

// API não configurada:
⚠️ "Configuração da API não válida, usando modo de simulação"

// Erro na API:
❌ "API Error: 403 - API key not valid"
```

## 🚀 Configuração para Produção

### Variáveis de Ambiente

Para apps publicados, use variáveis de ambiente:

1. Configure no seu provedor de hospedagem/build:

```bash
GOOGLE_CLOUD_VISION_API_KEY=sua_chave_aqui
BACKEND_URL=https://sua-api.com
```

2. O app automaticamente usará essas variáveis em produção

### Build de Produção

Certifique-se de que:

- `apiKeys.js` não está no bundle final
- Chaves estão em variáveis de ambiente
- Logs de debug estão desabilitados

## 🔧 Solução de Problemas

### Erro: "API key not valid"

- Verifique se a chave está correta em `apiKeys.js`
- Confirme que a Cloud Vision API está ativada
- Verifique restrições da chave no Google Cloud

### Erro: "Quota exceeded"

- Verifique uso no Google Cloud Console
- Configure alertas de quota
- Considere otimizações ou upgrade do plano

### Erro: "Network request failed"

- Verifique conexão com internet
- Confirme que não há firewall bloqueando
- Teste com timeout maior

### App usando simulação mesmo com chave configurada

- Verifique se o arquivo `apiKeys.js` existe
- Confirme que a chave não contém "SUA_CHAVE"
- Verifique logs do console para erros

## 📞 Suporte

- [Documentação Google Cloud Vision](https://cloud.google.com/vision/docs)
- [Pricing e Quotas](https://cloud.google.com/vision/pricing)
- [Stack Overflow - google-cloud-vision](https://stackoverflow.com/questions/tagged/google-cloud-vision)

---

**⚠️ Lembrete**: Mantenha suas chaves seguras e monitore o uso regularmente!
