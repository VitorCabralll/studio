# 🔑 reCAPTCHA Secret Key - Instruções para Correção

## ❌ PROBLEMA IDENTIFICADO

Firebase Functions está configurado com **SITE KEY** no lugar do **SECRET KEY**:

```bash
# CONFIGURAÇÃO ATUAL (INCORRETA)
firebase functions:config:get
{
  "recaptcha": {
    "secret_key": "projects/506027619372/keys/6Ld79nMrAAAAAE-oWEVVeBbthv-I49JaHxbRR-_N"
  }
}
```

**Isso está ERRADO!** O valor acima é o **Site Key**, não o **Secret Key**.

---

## ✅ SOLUÇÃO

### 1. Obter o Secret Key Correto

**Acesse:** https://www.google.com/recaptcha/admin

**Passos:**
1. Faça login com sua conta Google
2. Selecione o site **"LexAI"** 
3. Clique na **engrenagem (Settings)**
4. Vá em **"reCAPTCHA Keys"**
5. Copie o **"Secret key"** (diferente do "Site key")

### 2. Configurar no Firebase Functions

```bash
# Substitua COLOQUE_O_SECRET_KEY_AQUI pelo secret key real
firebase functions:config:set recaptcha.secret_key="COLOQUE_O_SECRET_KEY_AQUI" --project lexai-ef0ab

# Deploy as functions novamente
firebase deploy --only functions --force
```

---

## 📋 VERIFICAÇÃO

**Site Key (atual - correto):** `6Ld79nMrAAAAAE-oWEVVeBbthv-I49JaHxbRR-_N`
**Secret Key (necessário):** `???????` ← **VOCÊ PRECISA BUSCAR ISSO**

---

## 🎯 RESULTADO ESPERADO

Após configurar o secret key correto:

1. ✅ Firebase Functions poderão validar tokens reCAPTCHA
2. ✅ reCAPTCHA console mostrará **"Avaliações"** 
3. ✅ Erros 400 do App Check serão resolvidos
4. ✅ Status mudará de **"Desprotegido"** para **"Protegido"**

---

## ⚠️ IMPORTANTE

- **Site Key**: Público, vai no frontend (já está correto)
- **Secret Key**: Privado, vai no backend (precisa ser configurado)

**O secret key nunca deve ser exposto no frontend!**