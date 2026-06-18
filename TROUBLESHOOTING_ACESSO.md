# 🔧 TROUBLESHOOTING - Acesso ao Sistema

## ❓ O que está acontecendo?

Quando acesso https://sindicato-dgci.free.nf/ não consigo entrar.

---

## 🔍 Diagnóstico Rápido (5 minutos)

### 1️⃣ **Verificar se o site carrega**

Abra: https://sindicato-dgci.free.nf/

- ✅ **Página carrega?** → Ir para passo 2
- ❌ **Erro 404 ou branco?** → Problema de deployment (ver seção "Build não executado")

---

### 2️⃣ **Verificar erros no browser**

Pressione: `F12` (ou Cmd+Option+I no Mac)

1. Abra a aba **"Console"**
2. Recarregue a página (F5)
3. Procure por erros vermelhos

**Erros Comuns:**

#### ❌ "Failed to fetch" ou "CORS error"
```
Access to XMLHttpRequest at 'https://sf-dgci-backend.onrender.com/api/...' 
has been blocked by CORS policy
```
**Solução:** Backend não está reconhecendo o domínio do InfinityFree
→ Verificar `FRONTEND_URL` em `backend/.env`

#### ❌ "Cannot find module" ou "404 Not Found"
```
GET https://sindicato-dgci.free.nf/src/main.jsx 404
```
**Solução:** Frontend não foi compilado
→ Ver seção "Rebuild Necessário"

#### ❌ "Invalid API URL" ou "Undefined API"
**Solução:** `.env.production` não foi lido
→ Reconstruir com: `npm run build`

---

### 3️⃣ **Verificar Network (Aba Network)**

Na aba **"Network"** do F12:

1. Recarregue a página
2. Procure requisição para `/api/` (ex: `/api/auth/me`)
3. Clique nela e veja:

**Status esperado:**
- ✅ **200 OK** → Backend respondendo normalmente
- ✅ **401 Unauthorized** → Normal (precisa login)
- ❌ **0 (Failed)** → Backend offline ou problema de rede
- ❌ **CORS error** → Problema de configuração

**Headers importantes:**
- Response header: `access-control-allow-origin: https://sindicato-dgci.free.nf`

---

## 🔴 Problemas Comuns & Soluções

### Problema 1: "Frontend não foi compilado"

**Sintoma:** 
- Página branca ou 404
- Console mostra "Cannot find module"

**Solução:**

Recompile o frontend com a URL correta:

```bash
cd frontend

# 1. Verificar que .env.production está correto
cat .env.production
# Deve ter: VITE_API_URL=https://sf-dgci-backend.onrender.com/api

# 2. Reconstruir
npm install
npm run build

# 3. Resultado deve estar em:
# dist/ ← Estes arquivos vão para InfinityFree
```

**Depois fazer upload em InfinityFree:**
1. Aceder painel de controlo InfinityFree
2. File Manager
3. Deletar tudo em `public_html/`
4. Upload dos arquivos de `dist/`

---

### Problema 2: "CORS error"

**Sintoma:**
```
Access to XMLHttpRequest at 'https://sf-dgci-backend.onrender.com...'
has been blocked by CORS policy
```

**Verificação:**

1. Confirmar `FRONTEND_URL` no backend:
```bash
cd backend
echo "FRONTEND_URL=$(grep FRONTEND_URL .env | cut -d= -f2)"
# Deve mostrar: FRONTEND_URL=https://sindicato-dgci.free.nf
```

2. Se estiver errado, atualizar:
```bash
# Editar backend/.env
FRONTEND_URL=https://sindicato-dgci.free.nf
```

3. Fazer redeploy em Render (git push)

---

### Problema 3: "Backend offline"

**Sintoma:**
- Network mostra erro "0 (Failed)" para requests de API

**Verificação:**

```bash
# Testar se backend está online
curl -i https://sf-dgci-backend.onrender.com/api/health

# Esperado: HTTP 200 OK com {"status":"OK"}
```

Se não responder:
1. Ir a https://dashboard.render.com
2. Verificar status de **sf-dgci-backend**
3. Se em vermelho: restartar serviço

---

### Problema 4: "Autenticação não funciona"

**Sintoma:**
- Login falha com "Invalid credentials"
- Mesmo com credenciais corretas

**Verificação:**

1. Ir a backend/.env e conferir:
```
ADMIN_EMAIL=admin@sf-dgci.gw
ADMIN_PASSWORD=Admin@2026!
```

2. Testar credenciais:
```bash
curl -X POST https://sf-dgci-backend.onrender.com/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email":"admin@sf-dgci.gw",
    "password":"Admin@2026!"
  }'

# Esperado: 
# {
#   "success": true,
#   "data": { "id": "...", "email": "...", "perfil": "administrador" }
# }
```

---

## 🚀 Rebuild Completo (Quando nada funciona)

```bash
# 1. Atualizar código
git pull origin main

# 2. Frontend
cd frontend
rm -rf dist node_modules
npm install
npm run build

# 3. Upload em InfinityFree (se houver mudanças)
# File Manager > Delete public_html/* > Upload dist/*

# 4. Backend
cd ../backend
git push origin main  # Render faz auto-deploy

# 5. Testar
sleep 30  # Esperar pelo deploy
curl https://sf-dgci-backend.onrender.com/api/health
open https://sindicato-dgci.free.nf
```

---

## 📋 Checklist Verificação

- [ ] Frontend carrega (F12 > Console)
- [ ] Sem erros de CORS
- [ ] Backend responde em `/api/health`
- [ ] Login aceita credenciais
- [ ] Dashboard carrega após login
- [ ] Dados aparecem (membros, financeiro, etc)

---

## 💬 Informações para Suporte

Se ainda não funcionar, recolher:

1. **Erro exato (screenshot F12 Console):**
```
Abrir F12 > Console > Clicar Ctrl+A > Ctrl+C
```

2. **Testar conexão:**
```bash
curl -v https://sf-dgci-backend.onrender.com/api/health
curl -v https://sindicato-dgci.free.nf
```

3. **Verificar versão:**
```bash
cd backend && git log --oneline -5
cd ../frontend && git log --oneline -5
```

4. **Status dos serviços:**
- Render: https://status.render.com/
- InfinityFree: https://ifastatus.com/
- Supabase: https://status.supabase.com/

---

## 🎯 Próximos Passos

1. **Abra F12 e procure por erros** (passo 2 acima)
2. **Envie-me o erro específico**
3. Vou ajudar a resolver de imediato

