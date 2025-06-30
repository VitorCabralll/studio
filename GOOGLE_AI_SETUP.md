# 🔧 Configuração Google AI API - LexAI

## ❌ Problema Atual
```
Error: API key not valid. Please pass a valid API key.
```

## 🔑 Como Obter/Verificar Chave Correta

### 1. **Acesse Google AI Studio**
- URL: https://aistudio.google.com/app/apikey
- Faça login com sua conta Google

### 2. **Crie Nova API Key**
```
1. Clique em "Create API Key"
2. Selecione projeto Google Cloud (ou crie novo)
3. Copie a chave gerada (formato: AIza...)
```

### 3. **Habilite API Necessária**
- Acesse [Google Cloud Console](https://console.cloud.google.com/apis/library/generativelanguage.googleapis.com)
- Habilite "Generative Language API"
- Aguarde alguns minutos para ativação

### 4. **Adicione no Projeto**
```bash
# Edite .env.local
GOOGLE_AI_API_KEY=SUA_CHAVE_AQUI
```

### 5. **Teste a API**
```bash
npm run test:orchestrator
```

## 🔍 **Verificação de API Key**

Para testar se sua chave está funcionando:

```bash
curl -H "Content-Type: application/json" \
     -d '{"contents":[{"parts":[{"text":"Hello"}]}]}' \
     "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=SUA_CHAVE"
```

**Resposta esperada:**
```json
{
  "candidates": [
    {
      "content": {
        "parts": [{"text": "Hello! How can I help you today?"}]
      }
    }
  ]
}
```

## ⚡ **Fallback: Modo Demo**

Se ainda não conseguir a chave, posso configurar um modo demo para testar o sistema sem APIs externas.

## 📝 **Próximos Passos**

1. ✅ Obter chave válida do Google AI
2. ⏭️ Criar API routes Next.js
3. ⏭️ Integrar frontend com orquestrador
4. ⏭️ Corrigir tipos TypeScript

**Status atual:** Aguardando chave válida do Google AI para continuar.