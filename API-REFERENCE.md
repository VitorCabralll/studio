# 🚀 API Reference - LexAI

> **📊 Status:** Documentação completa das APIs REST | **Última Atualização:** Dezembro 2024

## 📖 Visão Geral

O LexAI expõe APIs REST para integração com o orquestrador de IA e processamento de documentos jurídicos. Todas as APIs seguem padrões RESTful e retornam JSON.

### **Base URL**
- **Desenvolvimento:** `http://localhost:3000/api`
- **Produção:** `https://your-domain.com/api`

### **Autenticação**
⚠️ **Atenção:** As APIs atualmente **não possuem autenticação** implementada. Isso está no roadmap de segurança.

---

## 🤖 Orquestrador de IA

### **GET /api/orchestrator/test**
Testa se o orquestrador está funcionando corretamente.

**Resposta de Sucesso (200):**
```json
{
  "status": "success",
  "message": "Orquestrador funcionando corretamente",
  "timestamp": "2024-12-30T10:00:00.000Z",
  "version": "1.0.0",
  "availableLLMs": ["openai", "google", "anthropic"],
  "environment": "development"
}
```

**Exemplo de Uso:**
```bash
curl -X GET http://localhost:3000/api/orchestrator/test
```

---

### **POST /api/orchestrator/process**
Processa uma tarefa de geração de documento usando o orquestrador multi-LLM.

**Content-Type:** `application/json`

**Body Parameters:**
```typescript
{
  taskType: "document_generation" | "analysis" | "summarization";
  documentType: "petition" | "contract" | "opinion" | "report";
  instructions: string;
  context: Array<{
    type: "ocr_text" | "uploaded_document" | "template";
    content: string;
    source: string;
    metadata?: Record<string, any>;
  }>;
  config?: {
    preferredLLM?: "openai" | "google" | "anthropic";
    maxTokens?: number;
    temperature?: number;
    enableTracing?: boolean;
  };
}
```

**Exemplo de Request:**
```json
{
  "taskType": "document_generation",
  "documentType": "petition",
  "instructions": "Gerar petição inicial de ação de indenização por danos morais",
  "context": [
    {
      "type": "ocr_text",
      "content": "João Silva foi vítima de acidente de trânsito em 15/03/2024...",
      "source": "boletim_ocorrencia.pdf",
      "metadata": {
        "dateExtracted": "2024-12-30T10:00:00.000Z",
        "confidence": 0.98
      }
    },
    {
      "type": "template",
      "content": "PETIÇÃO INICIAL\n\n[QUALIFICAÇÃO DAS PARTES]\n...",
      "source": "template_peticao.docx"
    }
  ],
  "config": {
    "preferredLLM": "openai",
    "maxTokens": 4000,
    "temperature": 0.7,
    "enableTracing": true
  }
}
```

**Resposta de Sucesso (200):**
```json
{
  "status": "success",
  "taskId": "task_abc123def456",
  "result": {
    "generatedDocument": {
      "title": "Petição Inicial - Ação de Indenização",
      "content": "EXCELENTÍSSIMO SENHOR DOUTOR JUIZ...",
      "sections": {
        "qualificacao": "João Silva, brasileiro, solteiro...",
        "dossFatos": "Em 15 de março de 2024...",
        "fundamentacao": "Com base no artigo 927 do Código Civil...",
        "pedidos": "Ante o exposto, requer-se..."
      },
      "metadata": {
        "wordCount": 1247,
        "estimatedReadingTime": "5 minutos",
        "legalReferences": ["Art. 927, CC", "Art. 186, CC"]
      }
    },
    "processingStats": {
      "totalTokensUsed": 3456,
      "processingTimeMs": 8234,
      "llmUsed": "openai",
      "confidenceScore": 0.92
    }
  },
  "timestamp": "2024-12-30T10:00:00.000Z"
}
```

**Resposta de Erro (400):**
```json
{
  "status": "error",
  "error": {
    "code": "INVALID_REQUEST",
    "message": "documentType é obrigatório",
    "details": {
      "field": "documentType",
      "received": null,
      "expected": ["petition", "contract", "opinion", "report"]
    }
  },
  "timestamp": "2024-12-30T10:00:00.000Z"
}
```

**Resposta de Erro (500):**
```json
{
  "status": "error",
  "error": {
    "code": "PROCESSING_ERROR",
    "message": "Erro no processamento do orquestrador",
    "details": {
      "stage": "document_generation",
      "llmError": "API rate limit exceeded",
      "retryable": true
    }
  },
  "timestamp": "2024-12-30T10:00:00.000Z"
}
```

---

## 📄 Geração de Documentos

### **POST /api/generate**
Endpoint simplificado para geração de documentos (wrapper do orquestrador).

**Content-Type:** `application/json`

**Body Parameters:**
```typescript
{
  agentId: string;
  documents: Array<{
    file: File | string;
    type: "pdf" | "docx" | "txt" | "image";
    name: string;
  }>;
  instructions?: string;
  additionalFiles?: Array<{
    file: File | string;
    type: "reference" | "jurisprudence" | "doctrine";
    name: string;
  }>;
}
```

**Exemplo de Request:**
```json
{
  "agentId": "agent_xyz789",
  "documents": [
    {
      "file": "base64_encoded_content_here",
      "type": "pdf",
      "name": "contrato_trabalho.pdf"
    }
  ],
  "instructions": "Focar na rescisão indireta por falta de pagamento",
  "additionalFiles": [
    {
      "file": "base64_encoded_content_here",
      "type": "jurisprudence",
      "name": "jurisprudencia_tst.pdf"
    }
  ]
}
```

**Resposta de Sucesso (200):**
```json
{
  "status": "success",
  "documentId": "doc_generated_123",
  "document": {
    "title": "Reclamação Trabalhista - Rescisão Indireta",
    "content": "EXCELENTÍSSIMO SENHOR DOUTOR JUIZ...",
    "downloadUrl": "/api/documents/doc_generated_123/download",
    "previewUrl": "/api/documents/doc_generated_123/preview"
  },
  "metadata": {
    "agentUsed": "Agente Trabalhista Sênior",
    "generatedAt": "2024-12-30T10:00:00.000Z",
    "processingTime": "12.3s",
    "tokensUsed": 4567
  }
}
```

---

## 📁 Gestão de Documentos

### **GET /api/documents/{documentId}**
Recupera informações de um documento gerado.

**Path Parameters:**
- `documentId` (string): ID único do documento

**Resposta de Sucesso (200):**
```json
{
  "status": "success",
  "document": {
    "id": "doc_generated_123",
    "title": "Reclamação Trabalhista - Rescisão Indireta",
    "content": "EXCELENTÍSSIMO SENHOR...",
    "status": "completed",
    "createdAt": "2024-12-30T10:00:00.000Z",
    "updatedAt": "2024-12-30T10:05:00.000Z",
    "metadata": {
      "agentId": "agent_xyz789",
      "userId": "user_abc123",
      "workspaceId": "ws_def456"
    }
  }
}
```

---

### **GET /api/documents/{documentId}/download**
Faz download do documento em formato específico.

**Query Parameters:**
- `format` (optional): "pdf" | "docx" | "txt" (default: "pdf")

**Resposta de Sucesso (200):**
- **Content-Type:** `application/pdf` | `application/vnd.openxmlformats-officedocument.wordprocessingml.document` | `text/plain`
- **Body:** Arquivo binário do documento

---

## 🔧 Configuração e Status

### **GET /api/config/llms**
Lista os LLMs disponíveis e suas configurações.

**Resposta de Sucesso (200):**
```json
{
  "status": "success",
  "llms": {
    "openai": {
      "available": true,
      "models": ["gpt-4", "gpt-3.5-turbo"],
      "status": "active",
      "costPerToken": 0.00003
    },
    "google": {
      "available": true,
      "models": ["gemini-pro", "gemini-pro-vision"],
      "status": "active",
      "costPerToken": 0.00001
    },
    "anthropic": {
      "available": false,
      "models": ["claude-3-opus", "claude-3-sonnet"],
      "status": "api_key_missing",
      "costPerToken": 0.00005
    }
  }
}
```

---

### **GET /api/health**
Verifica o status geral da aplicação.

**Resposta de Sucesso (200):**
```json
{
  "status": "healthy",
  "version": "1.0.0",
  "timestamp": "2024-12-30T10:00:00.000Z",
  "services": {
    "database": "connected",
    "orchestrator": "operational",
    "llms": {
      "openai": "connected",
      "google": "connected",
      "anthropic": "disconnected"
    },
    "ocr": "operational"
  },
  "performance": {
    "uptime": "24h 15m",
    "memoryUsage": "45%",
    "avgResponseTime": "234ms"
  }
}
```

---

## 📊 Analytics (Futuro)

### **GET /api/analytics/usage**
⚠️ **Em desenvolvimento** - Métricas de uso das APIs.

### **GET /api/analytics/costs**
⚠️ **Em desenvolvimento** - Análise de custos por LLM.

---

## 🔒 Códigos de Erro

| Código | Descrição | Solução |
|--------|-----------|---------|
| `400` | **Bad Request** | Verifique os parâmetros enviados |
| `401` | **Unauthorized** | Autenticação necessária (futuro) |
| `403` | **Forbidden** | Sem permissão para o recurso |
| `404` | **Not Found** | Recurso não encontrado |
| `429` | **Rate Limited** | Muitas requisições, aguarde |
| `500` | **Internal Error** | Erro no servidor, tente novamente |
| `503` | **Service Unavailable** | Serviço temporariamente indisponível |

### **Estrutura Padrão de Erro:**
```json
{
  "status": "error",
  "error": {
    "code": "ERROR_CODE",
    "message": "Descrição legível do erro",
    "details": {
      "field": "campo_problema",
      "received": "valor_recebido",
      "expected": "valor_esperado"
    }
  },
  "timestamp": "2024-12-30T10:00:00.000Z",
  "requestId": "req_abc123def456"
}
```

---

## 🧪 Testando as APIs

### **Usando cURL:**
```bash
# Teste básico
curl -X GET http://localhost:3000/api/orchestrator/test

# Processamento completo
curl -X POST http://localhost:3000/api/orchestrator/process \
  -H "Content-Type: application/json" \
  -d @request_example.json

# Health check
curl -X GET http://localhost:3000/api/health
```

### **Usando Postman:**
1. Importe a coleção: [LexAI APIs.postman_collection.json](./docs/postman/)
2. Configure environment variables:
   - `base_url`: `http://localhost:3000/api`
   - `auth_token`: (quando implementado)

### **Usando JavaScript:**
```javascript
// Teste do orquestrador
const response = await fetch('/api/orchestrator/process', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    taskType: 'document_generation',
    documentType: 'petition',
    instructions: 'Gerar petição inicial',
    context: [
      {
        type: 'ocr_text',
        content: 'Texto extraído do documento...',
        source: 'documento.pdf'
      }
    ]
  })
});

const result = await response.json();
console.log(result);
```

---

## 🔮 Roadmap de APIs

### **Próximas Implementações:**
1. **Autenticação por Token** - Sistema de API keys
2. **Rate Limiting** - Controle de quotas por usuário
3. **Webhooks** - Notificações de documentos processados
4. **Streaming** - Respostas em tempo real
5. **Batch Processing** - Processamento de múltiplos documentos

### **APIs Planejadas:**
- `POST /api/agents` - Criação/gestão de agentes
- `GET /api/templates` - Gestão de templates
- `POST /api/webhook` - Endpoint para integrações
- `GET /api/analytics/*` - Analytics detalhado

---

## 📞 Suporte

- **Issues**: [GitHub Issues](https://github.com/VitorCabralll/studio-1/issues)
- **Documentação**: Consulte `README.md` e `SETUP.md`
- **Status**: [Status Page](https://status.lexai.com.br) (futuro)

---

**🚀 LexAI APIs - Automatização jurídica inteligente via REST**