# 🔧 Troubleshooting GPS e Câmera

## 📱 Problemas Identificados e Soluções

### ❌ **Problema Principal Identificado:**

Os valores de status das permissões (`"granted"`, `"denied"`) sempre retornam em **inglês** das APIs nativas, mesmo traduzindo esses valores no código quebrava a funcionalidade.

---

## 🔨 **Correções Implementadas:**

### 📷 **1. Permissões da Câmera**

✅ **App.json atualizado:**

```json
"permissions": [
  "CAMERA",
  "CAMERA_ROLL",
  "WRITE_EXTERNAL_STORAGE",
  "READ_EXTERNAL_STORAGE"
]
```

✅ **iOS Info.plist adicionado:**

```json
"NSCameraUsageDescription": "Este aplicativo precisa acessar a câmera para capturar imagens de receitas médicas e identificar medicamentos."
```

✅ **Verificação melhorada:**

- Status atual da permissão antes de solicitar
- Logs detalhados para debug
- Tratamento de erro aprimorado

### 🗺️ **2. Permissões de Localização**

✅ **App.json atualizado:**

```json
"permissions": [
  "ACCESS_FINE_LOCATION",
  "ACCESS_COARSE_LOCATION"
]
```

✅ **iOS Info.plist adicionado:**

```json
"NSLocationWhenInUseUsageDescription": "Este aplicativo precisa da sua localização para encontrar unidades de saúde próximas a você."
```

✅ **Inicialização robusta:**

- Verificação do status antes de solicitar permissão
- Setup do watcher apenas após permissão concedida
- Logs detalhados para cada etapa

---

## 🐛 **Debug Implementado:**

### 📷 **Câmera:**

```javascript
📷 Status da permissão da câmera: granted/denied
📷 Iniciando captura de imagem...
📷 Status atual da permissão: granted/denied
📷 Permissão obtida: true/false
📷 Abrindo câmera...
✅ Imagem capturada com sucesso
```

### 🗺️ **GPS:**

```javascript
🚀 Inicializando HomeScreen...
🔄 Inicializando sistema de localização...
🗺️ Status inicial da permissão: granted/denied
🔧 Configurando watcher de localização...
✅ Permissão OK, criando watcher...
📍 Nova localização obtida: {lat, lng}
✅ Watcher configurado com sucesso
```

---

## 📋 **Checklist de Verificação:**

### **Para o Desenvolvedor:**

- [ ] 1. **Limpar cache:** `expo r -c`
- [ ] 2. **Reinstalar app:** Desinstalar e reinstalar no dispositivo
- [ ] 3. **Verificar logs:** Abrir console do Expo e verificar logs
- [ ] 4. **Permissões no dispositivo:** Ir em Configurações > Apps > Remédio Já > Permissões

### **Para o Usuário Final:**

- [ ] 1. **Localização ativada** no dispositivo
- [ ] 2. **Permissão de câmera** concedida ao app
- [ ] 3. **Permissão de localização** concedida ao app
- [ ] 4. **GPS ativo** nas configurações do dispositivo

---

## 🔄 **Como Testar:**

### **1. Teste da Câmera:**

1. Abrir o app
2. Tocar no botão da câmera (ícone de câmera ao lado do campo de busca)
3. Verificar se abre a câmera
4. Capturar uma imagem
5. Verificar se processa a imagem

### **2. Teste do GPS:**

1. Abrir o app
2. Verificar o indicador de GPS no header
3. Deve mostrar "GPS ATIVO" se tudo estiver OK
4. Verificar se as distâncias são calculadas corretamente
5. Testar o botão "Ver no mapa"

---

## 🚨 **Mensagens de Erro Comuns:**

### **Câmera:**

- `"Permissão Necessária"` → Usuário negou acesso à câmera
- `"Erro ao capturar imagem"` → Falha técnica na captura
- `"Captura cancelada"` → Usuário cancelou a captura

### **GPS:**

- `"GPS DESATIVADO"` → GPS desligado no dispositivo ou permissão negada
- `"Verificando localização..."` → Aguardando resposta do GPS
- `"GPS ATIVO"` → Tudo funcionando corretamente

---

## 📝 **Próximos Passos:**

Se os problemas persistirem:

1. **Verificar logs do console** para identificar erros específicos
2. **Testar em dispositivo físico** (emulador pode ter limitações)
3. **Verificar versões das dependências** no package.json
4. **Considerar rebuild completo** do projeto

---

**Última atualização:** 21 de julho de 2025  
**Status:** ✅ Correções implementadas - Teste em dispositivo necessário
