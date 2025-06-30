exports.id=993,exports.ids=[993],exports.modules={10454:(e,t,o)=>{"use strict";o.r(t),o.d(t,{MockGoogleAIClient:()=>n});var a=o(25863);class n extends a.W{constructor(e){super(e)}async generateText(e){await new Promise(e=>setTimeout(e,1e3+2e3*Math.random()));let t=e.messages[e.messages.length-1]?.content||"",o="";o=t.includes("sumarize")||t.includes("resumir")?`# Resumo do Documento

      **Fatos principais:**
      - Requerente solicita deferimento de pedido
      - Fundamenta\xe7\xe3o baseada em jurisprud\xeancia consolidada
      - Documentos anexos comprovam a tese apresentada
      
      **Pontos de aten\xe7\xe3o:**
      - Prazo processual em andamento
      - Necessidade de fundamenta\xe7\xe3o adicional
      
      **Recomenda\xe7\xf5es:**
      - Incluir precedentes do STJ
      - Fortalecer argumenta\xe7\xe3o constitucional`:t.includes("estrutura")||t.includes("structure")?`{
        "titulo": "Peti\xe7\xe3o Inicial - A\xe7\xe3o [Tipo]",
        "secoes": [
          {
            "nome": "Qualifica\xe7\xe3o das Partes",
            "subsecoes": ["Requerente", "Requerido"]
          },
          {
            "nome": "Dos Fatos",
            "subsecoes": ["Contexto", "Ocorr\xeancias Relevantes"]
          },
          {
            "nome": "Do Direito",
            "subsecoes": ["Fundamenta\xe7\xe3o Legal", "Jurisprud\xeancia"]
          },
          {
            "nome": "Do Pedido",
            "subsecoes": ["Pedido Principal", "Pedidos Subsidi\xe1rios"]
          }
        ]
      }`:t.includes("gerar")||t.includes("content")?`**EXCELENT\xcdSSIMO SENHOR DOUTOR JUIZ DE DIREITO**

      **QUALIFICA\xc7\xc3O DAS PARTES**
      
      [NOME DO REQUERENTE], [qualifica\xe7\xe3o completa], por seus advogados que ao final assinam, vem respeitosamente perante Vossa Excel\xeancia, com fundamento nos artigos pertinentes do C\xf3digo de Processo Civil, propor a presente:
      
      **A\xc7\xc3O [TIPO DE A\xc7\xc3O]**
      
      em face de [NOME DO REQUERIDO], [qualifica\xe7\xe3o], pelas raz\xf5es de fato e de direito a seguir expostas:
      
      **DOS FATOS**
      
      O requerente encontra-se em situa\xe7\xe3o que demanda a interven\xe7\xe3o do Poder Judici\xe1rio, conforme detalhadamente exposto nos documentos anexos.
      
      **DO DIREITO**
      
      A pretens\xe3o encontra amparo legal nos dispositivos constitucionais e infraconstitucionais aplic\xe1veis \xe0 esp\xe9cie.
      
      **DO PEDIDO**
      
      Diante do exposto, requer-se:
      a) O deferimento do pedido principal;
      b) A condena\xe7\xe3o em custas e honor\xe1rios.
      
      Termos em que pede deferimento.
      
      Local, data.
      
      [Assinatura do Advogado]`:`Documento jur\xeddico processado com sucesso utilizando IA do Google Gemini (modo demo).
      
      Esta \xe9 uma resposta simulada para fins de teste. O sistema est\xe1 configurado corretamente e pronto para usar a API real quando a chave for fornecida.`;let a=Math.floor(t.length/4),n=Math.floor(o.length/4),s=a+n,r=this.calculateMockCost(e.model,s);return{content:o,finishReason:"stop",usage:{promptTokens:a,completionTokens:n,totalTokens:s,cost:r},model:e.model}}calculateMockCost(e,t){let o={"gemini-1.5-pro":.002,"gemini-1.5-flash":2e-4,"gemini-2.0-flash":2e-4};return t/1e6*(o[e]||o["gemini-1.5-pro"])}}},25863:(e,t,o)=>{"use strict";o.d(t,{W:()=>a});class a{constructor(e){this.options=e}async makeRequest(e,t,o={}){let a=new AbortController,n=setTimeout(()=>a.abort(),this.options.timeout||3e4);try{let s=await fetch(e,{method:"POST",headers:{"Content-Type":"application/json",...o},body:JSON.stringify(t),signal:a.signal});if(clearTimeout(n),!s.ok){let e=await s.text();throw Error(`HTTP ${s.status}: ${e}`)}return await s.json()}catch(e){if(clearTimeout(n),e instanceof Error&&"AbortError"===e.name)throw Error("Request timeout");throw e}}calculateCost(e,t,o){return e.promptTokens/1e6*t+e.completionTokens/1e6*o}}},26780:(e,t,o)=>{"use strict";o.r(t),o.d(t,{OpenAIClient:()=>n});var a=o(25863);class n extends a.W{constructor(e){super(e),this.baseUrl="https://api.openai.com/v1"}async generateText(e){let t={model:e.model,messages:e.messages,max_tokens:e.maxTokens||4096,temperature:e.temperature||.7,top_p:e.topP||1,stop:e.stopSequences},o={Authorization:`Bearer ${this.options.apiKey}`};try{let a=await this.makeRequest(`${this.baseUrl}/chat/completions`,t,o),n=a.choices[0],s=a.usage,r=this.calculateModelCost(e.model,s);return{content:n.message.content,finishReason:this.mapFinishReason(n.finish_reason),usage:{promptTokens:s.prompt_tokens,completionTokens:s.completion_tokens,totalTokens:s.total_tokens,cost:r},model:a.model,id:a.id}}catch(e){throw console.error("OpenAI API Error:",e),Error(`OpenAI API failed: ${e instanceof Error?e.message:"Unknown error"}`)}}calculateModelCost(e,t){let o={"gpt-4-turbo":{input:10,output:30},"gpt-4":{input:30,output:60},"gpt-4o":{input:5,output:15},"gpt-4o-mini":{input:.15,output:.6},"gpt-3.5-turbo":{input:.5,output:1.5}},a=o[e]||o["gpt-4-turbo"];return this.calculateCost({promptTokens:t.prompt_tokens,completionTokens:t.completion_tokens,totalTokens:t.total_tokens},a.input,a.output)}mapFinishReason(e){switch(e){case"stop":return"stop";case"length":return"length";case"content_filter":return"content_filter";default:return"error"}}}},30712:(e,t,o)=>{"use strict";o.r(t),o.d(t,{AnthropicClient:()=>n});var a=o(25863);class n extends a.W{constructor(e){super(e),this.baseUrl="https://api.anthropic.com/v1"}async generateText(e){let t=e.messages.find(e=>"system"===e.role),o=e.messages.filter(e=>"system"!==e.role),a={model:e.model,max_tokens:e.maxTokens||4096,temperature:e.temperature||.7,top_p:e.topP||1,stop_sequences:e.stopSequences,messages:o,...t&&{system:t.content}},n={"x-api-key":this.options.apiKey,"anthropic-version":"2023-06-01"};try{let t=await this.makeRequest(`${this.baseUrl}/messages`,a,n),o=t.content[0].text,s=t.usage,r=this.calculateModelCost(e.model,s);return{content:o,finishReason:this.mapFinishReason(t.stop_reason),usage:{promptTokens:s.input_tokens,completionTokens:s.output_tokens,totalTokens:s.input_tokens+s.output_tokens,cost:r},model:t.model,id:t.id}}catch(e){throw console.error("Anthropic API Error:",e),Error(`Anthropic API failed: ${e instanceof Error?e.message:"Unknown error"}`)}}calculateModelCost(e,t){let o={"claude-3-opus-20240229":{input:15,output:75},"claude-3-sonnet-20240229":{input:3,output:15},"claude-3-haiku-20240307":{input:.25,output:1.25},"claude-3-5-sonnet-20241022":{input:3,output:15}},a=o[e]||o["claude-3-sonnet-20240229"];return this.calculateCost({promptTokens:t.input_tokens,completionTokens:t.output_tokens,totalTokens:t.input_tokens+t.output_tokens},a.input,a.output)}mapFinishReason(e){switch(e){case"end_turn":case"stop_sequence":return"stop";case"max_tokens":return"length";default:return"error"}}}},39133:(e,t,o)=>{"use strict";o.d(t,{Ey:()=>i,xb:()=>c});var a=o(81114);class n{constructor(e){this.availableLLMs=[],this.availableLLMs=e}selectLLM(e,t){let o=t||this.inferCriteria(e),a=this.filterCompatibleLLMs(e,o);if(0===a.length)throw Error("Nenhum LLM compat\xedvel encontrado para esta tarefa");let n=a.map(t=>({llm:t,score:this.calculateScore(t,o),estimatedCost:this.estimateCost(t,e),estimatedLatency:this.estimateLatency(t,e)}));n.sort((e,t)=>t.score-e.score);let s=n[0],r=n.slice(1,4).map(e=>e.llm);return{selectedLLM:s.llm,reasoning:this.generateReasoning(s.llm,o),confidence:this.calculateConfidence(s.score,n),alternatives:r,estimatedCost:s.estimatedCost,estimatedLatency:s.estimatedLatency}}inferCriteria(e){let{taskType:t,documentType:o,legalArea:a}=e,n="medium";"data_extraction"===t||"document_summary"===t?n="low":("document_generation"===t||"legal_analysis"===t)&&(n="high");let s="standard";("petition"===o||"legal_opinion"===o)&&(s="premium");let r="balanced";return"data_extraction"===t?r="fast":"document_generation"===t&&(r="thorough"),{taskComplexity:n,qualityRequirement:s,latencyRequirement:r,costBudget:"medium",specialization:t,legalArea:a}}filterCompatibleLLMs(e,t){return this.availableLLMs.filter(e=>{if(t.specialization&&!e.capabilities.specializations.includes(t.specialization)||!e.capabilities.supportedLanguages.includes("pt-BR"))return!1;let o=this.getMinQualityThreshold(t.qualityRequirement);return!(e.capabilities.qualityRating<o)})}calculateScore(e,t){let o=0,a=this.getQualityWeight(t.qualityRequirement);o+=e.capabilities.qualityRating*a;let n=this.getLatencyWeight(t.latencyRequirement);o+=Math.max(0,20-e.performance.averageLatency/1e3)*n;let s=this.getCostWeight(t.costBudget);return o+=Math.max(0,20-1e3*((e.costs.inputTokenPrice+e.costs.outputTokenPrice)/2))*s+10*e.performance.reliability,t.specialization&&e.capabilities.specializations.includes(t.specialization)&&(o+=10),o}estimateCost(e,t){let o=this.estimateInputTokens(t),a=this.estimateOutputTokens(t.taskType);return o*e.costs.inputTokenPrice/1e3+a*e.costs.outputTokenPrice/1e3}estimateLatency(e,t){let o=this.estimateOutputTokens(t.taskType);return e.performance.averageLatency+o/e.performance.tokensPerSecond*1e3}estimateInputTokens(e){let t;return t=0+e.instructions.length/4,e.context.forEach(e=>{t+=e.content.length/4}),Math.ceil(t)}estimateOutputTokens(e){return({document_generation:2e3,legal_analysis:1500,contract_review:1e3,document_summary:500,data_extraction:200})[e]||1e3}generateReasoning(e,t){let o=[];return o.push(`Selecionado ${e.provider}/${e.model}`),"premium"===t.qualityRequirement&&o.push(`alta qualidade necess\xe1ria (rating: ${e.capabilities.qualityRating}/10)`),t.specialization&&o.push(`especializado em ${t.specialization}`),"fast"===t.latencyRequirement&&o.push(`baixa lat\xeancia (${e.performance.averageLatency}ms)`),o.join(", ")}calculateConfidence(e,t){return 1===t.length?1:Math.min(1,(e-(t[1]?.score||0))/50)}getMinQualityThreshold(e){return({draft:5,standard:7,premium:8})[e]}getQualityWeight(e){return({draft:2,standard:3,premium:4})[e]}getLatencyWeight(e){return({fast:2,balanced:1,thorough:.5})[e]}getCostWeight(e){return({low:2,medium:1,high:.5})[e]}}class s{constructor(e){this.config=e,this.router=new n(e.llmConfigs)}async process(e){let t={stages:[],totalDuration:0,totalCost:0,totalTokens:0,errors:[]},o={stage:"",input:e,intermediateResults:{},llmClients:{google:null,openai:null,anthropic:null,local:null,custom:null},config:this.config,trace:t},a=Date.now();try{for(let e of this.config.pipeline)await this.executeStage(e,o);let e=this.assembleDocument(o);return t.totalDuration=Date.now()-a,{success:!0,result:e,metadata:{processingTime:t.totalDuration,llmUsed:t.stages.map(e=>e.llmUsed).filter(Boolean),totalCost:t.totalCost,tokensUsed:{promptTokens:t.stages.reduce((e,t)=>e+(t.tokensUsed?.promptTokens||0),0),completionTokens:t.stages.reduce((e,t)=>e+(t.tokensUsed?.completionTokens||0),0),totalTokens:t.totalTokens,cost:t.totalCost},confidence:this.calculateOverallConfidence(t)},pipeline:t}}catch(e){return t.totalDuration=Date.now()-a,{success:!1,error:{code:"PIPELINE_ERROR",message:e instanceof Error?e.message:"Erro desconhecido no pipeline",stage:o.stage,retryable:!0,timestamp:new Date},metadata:{processingTime:t.totalDuration,llmUsed:[],totalCost:t.totalCost,tokensUsed:{promptTokens:0,completionTokens:0,totalTokens:0},confidence:0},pipeline:t}}}async executeStage(e,t){let o={stageName:e.name,startTime:new Date,input:t.intermediateResults};t.stage=e.name,t.trace.stages.push(o);try{if(e.processor.validate&&!e.processor.validate(t.intermediateResults))throw Error(`Valida\xe7\xe3o falhou para o est\xe1gio ${e.name}`);let a=await this.executeWithTimeout(()=>e.processor.process(t.intermediateResults,t),e.timeout||3e4),n=e.processor.transform?e.processor.transform(a):a;t.intermediateResults[e.name]=n,o.endTime=new Date,o.duration=o.endTime.getTime()-o.startTime.getTime(),o.output=n,t.trace.totalDuration+=o.duration}catch(n){let a={code:"STAGE_ERROR",message:n instanceof Error?n.message:"Erro no est\xe1gio",stage:e.name,retryable:!0,timestamp:new Date,details:{stage:e.name}};if(o.error=a,o.endTime=new Date,o.duration=o.endTime.getTime()-o.startTime.getTime(),t.trace.errors.push(a),e.retryConfig&&e.retryConfig.maxAttempts>1)await this.retryStage(e,t,a);else throw n}}async executeWithTimeout(e,t){return Promise.race([e(),new Promise((e,o)=>setTimeout(()=>o(Error("Timeout")),t))])}async retryStage(e,t,o){let a=e.retryConfig,n=1;for(;n<a.maxAttempts;)try{let o=Math.min(a.baseDelay*(a.exponentialBackoff?Math.pow(2,n-1):1),a.maxDelay);await new Promise(e=>setTimeout(e,o));let s=await this.executeWithTimeout(()=>e.processor.process(t.intermediateResults,t),e.timeout||3e4);t.intermediateResults[e.name]=e.processor.transform?e.processor.transform(s):s;return}catch(e){if(++n>=a.maxAttempts)throw e}}assembleDocument(e){let{intermediateResults:t,input:o}=e,a=t.summarization||"",n=t.structure_definition||{},s=t.content_generation||{};return{content:t.assembly||this.fallbackAssembly(s,n),documentType:o.documentType,confidence:this.calculateDocumentConfidence(t),suggestions:this.generateSuggestions(t),citations:this.extractCitations(t),structuredData:{summary:a,structure:n,sections:s,metadata:{generatedAt:new Date().toISOString(),taskType:o.taskType,legalArea:o.legalArea}}}}fallbackAssembly(e,t){return"string"==typeof e?e:"object"==typeof e?Object.values(e).join("\n\n"):"Documento gerado com sucesso, mas houve erro na montagem final."}calculateDocumentConfidence(e){return Math.min(.9,.8*(Object.keys(e).length/this.config.pipeline.length)+.1)}calculateOverallConfidence(e){let t=e.stages.filter(e=>!e.error).length,o=e.stages.length;return o>0?t/o:0}generateSuggestions(e){let t=[];return e.quality_check&&t.push("Revisar fundamenta\xe7\xe3o jur\xeddica"),e.citation_analysis&&t.push("Verificar cita\xe7\xf5es e refer\xeancias"),t.push("Revisar formata\xe7\xe3o e estrutura do documento"),t}extractCitations(e){let t=e.citations||[];return Array.isArray(t)?t:[]}}class r{constructor(e){this.config={...a.KB,...e},this.pipeline=new s(this.config),this.router=new n(this.config.llmConfigs)}async processDocument(e){try{this.validateInput(e),this.logProcessingStart(e);let t=await this.pipeline.process(e);return this.logProcessingResult(t),t}catch(o){let t={success:!1,error:{code:"ORCHESTRATOR_ERROR",message:o instanceof Error?o.message:"Erro desconhecido",retryable:!0,timestamp:new Date},metadata:{processingTime:0,llmUsed:[],totalCost:0,tokensUsed:{promptTokens:0,completionTokens:0,totalTokens:0},confidence:0},pipeline:{stages:[],totalDuration:0,totalCost:0,totalTokens:0,errors:[]}};return this.logError(o,e),t}}async testRouting(e){return this.router.selectLLM(e)}getConfig(){return{...this.config}}updateConfig(e){this.config={...this.config,...e},this.pipeline=new s(this.config),this.router=new n(this.config.llmConfigs)}addLLM(e){this.config.llmConfigs.push(e),this.router=new n(this.config.llmConfigs)}removeLLM(e,t){this.config.llmConfigs=this.config.llmConfigs.filter(o=>o.provider!==e||o.model!==t),this.router=new n(this.config.llmConfigs)}getAvailableLLMs(){return[...this.config.llmConfigs]}validateInput(e){if(!e.taskType)throw Error("Tipo de tarefa \xe9 obrigat\xf3rio");if(!e.documentType)throw Error("Tipo de documento \xe9 obrigat\xf3rio");if(!e.instructions?.trim())throw Error("Instru\xe7\xf5es s\xe3o obrigat\xf3rias");if(!e.context||0===e.context.length)throw Error("Contexto (documentos anexados) \xe9 obrigat\xf3rio");if(!e.context.some(e=>("ocr_text"===e.type||"file_content"===e.type)&&e.content?.trim()))throw Error("\xc9 necess\xe1rio anexar documentos com conte\xfado para processamento")}logProcessingStart(e){this.config.monitoring.enableTracing&&console.log("[ORCHESTRATOR] Iniciando processamento:",{taskType:e.taskType,documentType:e.documentType,legalArea:e.legalArea,contextItems:e.context.length,timestamp:new Date().toISOString()})}logProcessingResult(e){this.config.monitoring.enableTracing&&console.log("[ORCHESTRATOR] Processamento finalizado:",{success:e.success,duration:e.metadata.processingTime,cost:e.metadata.totalCost,tokens:e.metadata.tokensUsed.totalTokens,confidence:e.metadata.confidence,stages:e.pipeline.stages.length,timestamp:new Date().toISOString()})}logError(e,t){console.error("[ORCHESTRATOR] Erro no processamento:",{error:e instanceof Error?e.message:"Erro desconhecido",stack:e instanceof Error?e.stack:void 0,input:{taskType:t.taskType,documentType:t.documentType,legalArea:t.legalArea},timestamp:new Date().toISOString()})}}let i=new r;async function c(e){return i.processDocument(e)}},51513:(e,t,o)=>{"use strict";o.r(t),o.d(t,{GoogleAIClient:()=>n});var a=o(25863);class n extends a.W{constructor(e){super(e),this.baseUrl="https://generativelanguage.googleapis.com/v1beta"}async generateText(e){let t={contents:this.convertMessages(e.messages),generationConfig:{maxOutputTokens:e.maxTokens||8192,temperature:e.temperature||.7,topP:e.topP||.95,stopSequences:e.stopSequences},safetySettings:[{category:"HARM_CATEGORY_HARASSMENT",threshold:"BLOCK_MEDIUM_AND_ABOVE"},{category:"HARM_CATEGORY_HATE_SPEECH",threshold:"BLOCK_MEDIUM_AND_ABOVE"},{category:"HARM_CATEGORY_SEXUALLY_EXPLICIT",threshold:"BLOCK_MEDIUM_AND_ABOVE"},{category:"HARM_CATEGORY_DANGEROUS_CONTENT",threshold:"BLOCK_MEDIUM_AND_ABOVE"}]},o=`${this.baseUrl}/models/${e.model}:generateContent?key=${this.options.apiKey}`;try{let a=await this.makeRequest(o,t);if(!a.candidates||0===a.candidates.length)throw Error("No response candidates from Gemini");let n=a.candidates[0],s=n.content.parts[0].text,r=a.usageMetadata,i=this.calculateModelCost(e.model,r);return{content:s,finishReason:this.mapFinishReason(n.finishReason),usage:{promptTokens:r?.promptTokenCount||0,completionTokens:r?.candidatesTokenCount||0,totalTokens:r?.totalTokenCount||0,cost:i},model:e.model}}catch(e){throw console.error("Google AI API Error:",e),Error(`Google AI API failed: ${e instanceof Error?e.message:"Unknown error"}`)}}convertMessages(e){let t=[];for(let o of e)"system"===o.role?t.unshift({role:"user",parts:[{text:`System: ${o.content}`}]}):t.push({role:"assistant"===o.role?"model":"user",parts:[{text:o.content}]});return t}calculateModelCost(e,t){let o={"gemini-1.5-pro":{input:1.25,output:5},"gemini-1.5-flash":{input:.075,output:.3},"gemini-1.0-pro":{input:.5,output:1.5}},a=o[e]||o["gemini-1.5-pro"];return this.calculateCost({promptTokens:t?.promptTokenCount||0,completionTokens:t?.candidatesTokenCount||0,totalTokens:t?.totalTokenCount||0},a.input,a.output)}mapFinishReason(e){switch(e){case"STOP":return"stop";case"MAX_TOKENS":return"length";case"SAFETY":return"content_filter";default:return"error"}}}},78335:()=>{},81114:(e,t,o)=>{"use strict";o.d(t,{KB:()=>m,DOCUMENT_TYPE_CONFIGS:()=>p}),o(26780),o(51513),o(10454),o(30712);class a{async callLLM(e,t,a){let{DOCUMENT_TYPE_CONFIGS:n}=await Promise.resolve().then(o.bind(o,81114)),s=t.input.documentType&&t.input.documentType in n?n[t.input.documentType]:null,r=a?.preferredModel||s?.preferredModel||(a?.qualityRequirement==="premium"?"gemini-1.5-pro":"gemini-1.5-flash"),i=function(e,t){let a=!t.apiKey||t.apiKey.length<20;switch(e){case"openai":let{OpenAIClient:n}=o(26780);return new n(t);case"google":if(a){let{MockGoogleAIClient:e}=o(10454);return new e(t)}{let{GoogleAIClient:e}=o(51513);return new e(t)}case"anthropic":let{AnthropicClient:s}=o(30712);return new s(t);default:throw Error(`Unsupported LLM provider: ${e}`)}}("google",{apiKey:process.env.GOOGLE_AI_API_KEY||"",timeout:3e4});return await i.generateText({model:r,messages:[{role:"system",content:"Voc\xea \xe9 um assistente jur\xeddico especializado em an\xe1lise de documentos brasileiros."},{role:"user",content:e}],maxTokens:a?.maxTokens||2e3,temperature:a?.temperature||.3})}}class n extends a{async process(e,t){let o=t.input,a=o.context.filter(e=>"ocr_text"===e.type||"file_content"===e.type).map(e=>e.content).join("\n\n");if(!a.trim())return"Nenhum conte\xfado encontrado nos documentos anexados.";t.config.pipeline.find(e=>"summarization"===e.name);let n=this.buildSummarizationPrompt(a,o);return(await this.callLLM(n,t,{preferredModel:"gemini-1.5-flash",maxTokens:1500,temperature:.2})).content}buildSummarizationPrompt(e,t){return`
Como especialista em Direito ${t.legalArea||"geral"}, analise os documentos fornecidos e extraia:

1. FATOS PRINCIPAIS: Eventos, datas, pessoas envolvidas
2. QUEST\xd5ES JUR\xcdDICAS: Problemas legais identificados  
3. PEDIDOS/REQUERIMENTOS: O que est\xe1 sendo solicitado
4. DOCUMENTOS RELEVANTES: Contratos, certid\xf5es, comprovantes mencionados

DOCUMENTOS PARA AN\xc1LISE:
${e}

INSTRU\xc7\xd5ES ESPEC\xcdFICAS:
${t.instructions}

Resposta deve ser objetiva, factual e estruturada para uso em ${t.documentType}.
`}}class s extends a{async process(e,t){let o=t.input,a=o.instructions,n=o.context.filter(e=>"legal_precedent"===e.type||"template"===e.type).map(e=>e.content).join("\n\n"),s=this.buildContextPrompt(e,a,n,o),r=await this.callLLM(s,t,{preferredModel:"gemini-1.5-pro",maxTokens:2e3,temperature:.3});return{keyPoints:r.content,priorityAreas:this.extractPriorityAreas(r.content),legalStrategy:this.extractLegalStrategy(r.content)}}buildContextPrompt(e,t,o,a){return`
Baseado na sumariza\xe7\xe3o dos fatos e nas instru\xe7\xf5es espec\xedficas, identifique:

1. PONTOS PRIORIT\xc1RIOS: Aspectos que devem ser enfatizados
2. ESTRAT\xc9GIA JUR\xcdDICA: Linha argumentativa principal
3. FUNDAMENTA\xc7\xc3O: Leis, artigos e precedentes aplic\xe1veis
4. TESE PRINCIPAL: Argumento central do documento

SUMARIZA\xc7\xc3O DOS FATOS:
${e}

INSTRU\xc7\xd5ES ESPEC\xcdFICAS:
${t}

MATERIAL AUXILIAR:
${o}

TIPO DE DOCUMENTO: ${a.documentType}
\xc1REA JUR\xcdDICA: ${a.legalArea}

Forne\xe7a an\xe1lise estrat\xe9gica para orientar a gera\xe7\xe3o do documento.
`}extractPriorityAreas(e){return(e.match(/\d+\.\s*([^:\n]+)/g)||[]).map(e=>e.replace(/\d+\.\s*/,"").trim()).slice(0,5)}extractLegalStrategy(e){let t=e.match(/ESTRATÉGIA JURÍDICA[:\s]*([^\.]+)/i);return t?t[1].trim():"Estrat\xe9gia padr\xe3o baseada nos fatos apresentados"}}class r extends a{async process(e,t){let o=t.input,a=o.context.find(e=>"template"===e.type)?.content||"",n=this.buildStructurePrompt(e,a,o),s=await this.callLLM(n,t,{preferredModel:"gemini-1.5-flash",maxTokens:1500,temperature:.1});return{sections:this.extractSections(s.content),outline:s.content,sectionOrder:this.defineSectionOrder(o.documentType)}}buildStructurePrompt(e,t,o){return`
Defina a estrutura detalhada para ${o.documentType} baseada na an\xe1lise:

AN\xc1LISE CONTEXTUAL:
${JSON.stringify(e,null,2)}

TEMPLATE DISPON\xcdVEL:
${t}

Crie estrutura com:
1. SE\xc7\xd5ES PRINCIPAIS: Cabe\xe7alho, fundamenta\xe7\xe3o, conclus\xe3o, etc.
2. SUBSE\xc7\xd5ES: Divis\xf5es internas de cada se\xe7\xe3o
3. ORDEM L\xd3GICA: Sequ\xeancia de apresenta\xe7\xe3o
4. CONTE\xdaDO ESPERADO: O que incluir em cada se\xe7\xe3o

TIPO: ${o.documentType}
\xc1REA: ${o.legalArea}

Forne\xe7a estrutura clara e hier\xe1rquica.
`}extractSections(e){return(e.match(/\d+\.\s*([A-ZÁÉÍÓÚÇ][^:\n]+)/g)||[]).map(e=>e.replace(/\d+\.\s*/,"").trim())}defineSectionOrder(e){return({petition:["header","parties","facts","legal_basis","requests","conclusion"],contract:["header","parties","definitions","obligations","conditions","signatures"],legal_opinion:["header","summary","analysis","legal_basis","conclusion","recommendations"]})[e]||["header","introduction","facts","legal_basis","conclusion","footer"]}}class i extends a{async process(e,t){let o=t.intermediateResults.structure_definition,a={};if(!o||!Array.isArray(o.sections))throw Error("Invalid structure: sections not found or not iterable");for(let e of o.sections){let o=this.buildSectionPrompt(e,t),n=await this.callLLM(o,t,{preferredModel:"gemini-1.5-pro",maxTokens:3e3,temperature:.4});a[e]=n.content,await new Promise(e=>setTimeout(e,500))}return a}buildSectionPrompt(e,t){let{input:o}=t,a=t.intermediateResults.summarization||"",n=t.intermediateResults.context_analysis||{};return`
Redija a se\xe7\xe3o "${e}" para ${o.documentType} em ${o.legalArea}.

CONTEXTO DOS FATOS:
${a}

ESTRAT\xc9GIA JUR\xcdDICA:
${JSON.stringify(n,null,2)}

INSTRU\xc7\xd5ES ESPEC\xcdFICAS:
${o.instructions}

REQUISITOS:
- Linguagem t\xe9cnica jur\xeddica apropriada
- Fundamenta\xe7\xe3o legal s\xf3lida
- Argumenta\xe7\xe3o persuasiva
- Formata\xe7\xe3o adequada para documento oficial
- Cita\xe7\xe3o de leis e precedentes quando relevante

Redija apenas o conte\xfado desta se\xe7\xe3o, sem cabe\xe7alhos ou numera\xe7\xe3o.
`}}class c{async process(e,t){let o=t.intermediateResults.structure_definition,a=o?.sectionOrder||Object.keys(e),n="";for(let t of a)e[t]&&(n+=`

## ${this.formatSectionTitle(t)}

`,n+=e[t]);let s=this.generateHeader(t.input),r=this.generateFooter();return`${s}

${n.trim()}

${r}`}formatSectionTitle(e){return({header:"CABE\xc7ALHO",parties:"DAS PARTES",facts:"DOS FATOS",legal_basis:"DO DIREITO",requests:"DOS PEDIDOS",conclusion:"CONCLUS\xc3O",recommendations:"RECOMENDA\xc7\xd5ES"})[e]||e.toUpperCase().replace("_"," ")}generateHeader(e){let t=new Date().toLocaleDateString("pt-BR");return`DOCUMENTO GERADO AUTOMATICAMENTE
Tipo: ${e.documentType.toUpperCase()}
\xc1rea: ${e.legalArea?.toUpperCase()||"GERAL"}
Data: ${t}

---`}generateFooter(){return`---

Este documento foi gerado automaticamente pelo LexAI.
Recomenda-se revis\xe3o jur\xeddica antes da utiliza\xe7\xe3o.`}validate(e){return"object"==typeof e&&Object.keys(e).length>0}transform(e){return"string"==typeof e?e:JSON.stringify(e)}}let l=[{provider:"google",model:"gemini-1.5-pro",capabilities:{maxTokens:2097152,supportedLanguages:["pt-BR","en","es"],specializations:["document_generation","legal_analysis","document_summary","contract_review","data_extraction"],qualityRating:9,contextWindow:2097152,functionCalling:!0,jsonMode:!0},performance:{averageLatency:2e3,tokensPerSecond:50,reliability:.95,lastUpdated:new Date("2024-01-01")},costs:{inputTokenPrice:.00125,outputTokenPrice:.005,currency:"USD"}},{provider:"google",model:"gemini-1.5-flash",capabilities:{maxTokens:1048576,supportedLanguages:["pt-BR","en","es"],specializations:["data_extraction","document_summary","legal_analysis"],qualityRating:8,contextWindow:1048576,functionCalling:!0,jsonMode:!0},performance:{averageLatency:800,tokensPerSecond:120,reliability:.97,lastUpdated:new Date("2024-01-01")},costs:{inputTokenPrice:75e-6,outputTokenPrice:3e-4,currency:"USD"}},{provider:"openai",model:"gpt-4.1-nano",capabilities:{maxTokens:8192,supportedLanguages:["pt-BR","en","es"],specializations:["document_generation","legal_analysis","document_summary","contract_review"],qualityRating:9,contextWindow:8192,functionCalling:!0,jsonMode:!0},performance:{averageLatency:3e3,tokensPerSecond:40,reliability:.95,lastUpdated:new Date("2024-01-01")},costs:{inputTokenPrice:.03,outputTokenPrice:.06,currency:"USD"}},{provider:"openai",model:"gpt-3.5-turbo",capabilities:{maxTokens:4096,supportedLanguages:["pt-BR","en","es"],specializations:["document_summary","data_extraction"],qualityRating:7,contextWindow:16384,functionCalling:!0,jsonMode:!0},performance:{averageLatency:1500,tokensPerSecond:80,reliability:.97,lastUpdated:new Date("2024-01-01")},costs:{inputTokenPrice:.0015,outputTokenPrice:.002,currency:"USD"}}],u=[{name:"summarization",description:"Sumariza\xe7\xe3o dos documentos anexados",processor:new n,timeout:3e4,retryConfig:{maxAttempts:3,baseDelay:1e3,maxDelay:5e3,exponentialBackoff:!0,retryableErrors:["TIMEOUT","RATE_LIMIT","SERVER_ERROR"]}},{name:"context_analysis",description:"An\xe1lise de instru\xe7\xf5es e contexto",processor:new s,dependencies:["summarization"],timeout:45e3,retryConfig:{maxAttempts:2,baseDelay:2e3,maxDelay:1e4,exponentialBackoff:!0,retryableErrors:["TIMEOUT","RATE_LIMIT"]}},{name:"structure_definition",description:"Defini\xe7\xe3o da estrutura do documento",processor:new r,dependencies:["context_analysis"],timeout:3e4,retryConfig:{maxAttempts:2,baseDelay:1e3,maxDelay:5e3,exponentialBackoff:!1,retryableErrors:["TIMEOUT"]}},{name:"content_generation",description:"Gera\xe7\xe3o de conte\xfado por se\xe7\xe3o",processor:new i,dependencies:["structure_definition"],timeout:12e4,retryConfig:{maxAttempts:2,baseDelay:3e3,maxDelay:15e3,exponentialBackoff:!0,retryableErrors:["TIMEOUT","RATE_LIMIT"]}},{name:"assembly",description:"Montagem final do documento",processor:new c,dependencies:["content_generation"],timeout:15e3,retryConfig:{maxAttempts:3,baseDelay:500,maxDelay:2e3,exponentialBackoff:!1,retryableErrors:["TIMEOUT"]}}],m={llmConfigs:l,defaultRouting:{taskComplexity:"medium",qualityRequirement:"standard",latencyRequirement:"balanced",costBudget:"medium"},pipeline:u,monitoring:{enableTracing:!0,enableMetrics:!0,logLevel:"info",metricsEndpoint:process.env.METRICS_ENDPOINT},security:{enableAPIKeyRotation:!0,encryptPrompts:!0,auditLogging:!0,dataRetentionDays:30}},p={petition:{qualityRequirement:"premium",preferredLLMs:["google","openai"],preferredModel:"gemini-1.5-pro",fallbackModel:"gpt-4.1-nano",estimatedTokens:3e3},contract:{qualityRequirement:"premium",preferredLLMs:["google","openai"],preferredModel:"gemini-1.5-pro",fallbackModel:"gpt-4.1-nano",estimatedTokens:2500},legal_opinion:{qualityRequirement:"premium",preferredLLMs:["google","openai"],preferredModel:"gemini-1.5-pro",fallbackModel:"gpt-4.1-nano",estimatedTokens:2e3},notification:{qualityRequirement:"standard",preferredLLMs:["google","openai"],preferredModel:"gemini-1.5-flash",fallbackModel:"gpt-3.5-turbo",estimatedTokens:1e3},brief:{qualityRequirement:"standard",preferredLLMs:["google","openai"],preferredModel:"gemini-1.5-flash",fallbackModel:"gpt-3.5-turbo",estimatedTokens:1500},motion:{qualityRequirement:"standard",preferredLLMs:["google","openai"],preferredModel:"gemini-1.5-flash",fallbackModel:"gpt-3.5-turbo",estimatedTokens:1200}}},96487:()=>{}};