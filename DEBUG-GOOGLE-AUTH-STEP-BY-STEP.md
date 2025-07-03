# 🔍 Debug Google Auth - Passo a Passo

## 🚨 **POSSÍVEIS CAUSAS do problema:**

### 1. **Configurações ainda não propagaram (MAIS COMUM)**
- Google leva 2-15 minutos para atualizar
- **Solução**: Aguardar mais alguns minutos

### 2. **Cache do Browser**
- Browser pode ter cached a configuração antiga
- **Solução**: Ctrl+Shift+R (hard refresh) ou aba anônima

### 3. **Configuração ainda tem erro**
- Alguma URL pode estar errada
- **Solução**: Verificar novamente Google Cloud Console

### 4. **Problema no código Firebase**
- authDomain ou outras configurações
- **Solução**: Verificar console do browser

## 🔧 **TESTES DE DIAGNÓSTICO:**

### **Teste 1: Console do Browser**
1. Abra https://lexai--lexai-ef0ab.us-central1.hosted.app/signup
2. Aperte **F12** (Developer Tools)
3. Vá para **Console**
4. Clique em "Continuar com Google"
5. **Veja que erro aparece no console**

### **Teste 2: Network Tab**
1. **F12** → **Network**
2. Clique "Continuar com Google"
3. **Veja se há requisições que falham (vermelhas)**

### **Teste 3: Aba Anônita**
1. **Ctrl+Shift+N** (Chrome) ou **Ctrl+Shift+P** (Firefox)
2. Vá para https://lexai--lexai-ef0ab.us-central1.hosted.app/signup
3. Teste Google Auth na aba anônima

### **Teste 4: Outro Browser**
- Teste no Safari, Edge, ou outro browser
- Se funcionar em outro = problema de cache

## 📱 **TESTES ESPECÍFICOS:**

### **A. Verificar authDomain**
Abra console do browser e digite:
```javascript
console.log(window.location.hostname);
// Deve mostrar: lexai--lexai-ef0ab.us-central1.hosted.app
```

### **B. Verificar Firebase Config**
```javascript
// No console do browser:
console.log('Firebase config loaded?', !!window.firebase);
```

### **C. Testar URL Direta**
Tente acessar diretamente:
```
https://lexai-ef0ab.firebaseapp.com/__/auth/handler
```
**Deve mostrar uma página HTML básica, não erro 404**

## 🔄 **SOLUÇÕES RÁPIDAS:**

### **1. Hard Refresh**
- **Ctrl+Shift+R** (Windows/Linux)
- **Cmd+Shift+R** (Mac)

### **2. Limpar Cache**
- **Ctrl+Shift+Delete** → Limpar cache

### **3. Aguardar Propagação**
- Google pode levar até **15 minutos**
- Configurações foram salvas recentemente

### **4. Verificar Firewall/AdBlock**
- Desabilitar AdBlock temporariamente
- Verificar se empresa tem firewall bloqueando

## 📋 **CHECKLIST FINAL:**

- [ ] Configuração Google Cloud Console salva ✅
- [ ] Aguardou pelo menos 5 minutos
- [ ] Testou em aba anônima
- [ ] Verificou console do browser (F12)
- [ ] Testou hard refresh (Ctrl+Shift+R)

---

**ME ENVIE:**
1. **Erro exato** que aparece
2. **Prints do console** do browser (F12)
3. **Em qual URL** testou
4. **Qual browser** usou