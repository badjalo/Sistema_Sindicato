# 🔴 PROBLEMA: Desconexão Imediata após Login

## 📋 Sintomas
- ✅ Login funciona (credenciais aceitas)
- ❌ Após login, sistema desconecta quase imediatamente
- ❌ Dashboard não carrega ou redireciona para login
- ❌ Sessão não persiste

---

## 🔍 Causa Raiz Identificada

**Problema:** `SameSite=Strict` nos cookies de autenticação

Quando o frontend está em um domínio diferente do backend:
- Frontend: `https://sindicato-dgci.free.nf` (InfinityFree)
- Backend: `https://sf-dgci-backend.onrender.com` (Render)

O cookie com `SameSite=Strict` **NÃO é enviado** em requisições cross-site. Isto significa:
1. Login funciona (requisição POST ao mesmo tempo que cookie é setado)
2. Navegação para dashboard (requisição subsequente sem cookie)
3. `/api/auth/me` retorna 401 (sem cookie = não autenticado)
4. Frontend redireciona para login
5. Ciclo infinito = aparenta desconecção imediata

---

## ✅ Solução Aplicada

### 1️⃣ **Configuração do Backend**

**Arquivo:** `backend/.env`

**Adicionado:**
```env
# Cookie Configuration (para cross-site)
# Usar 'None' para permitir cookies entre domínios (frontend + backend diferentes)
# Requer Secure=true que já está configurado em produção
COOKIE_SAMESITE=None
COOKIE_SECURE=true
```

### 2️⃣ **Atualizado Controller de Autenticação**

**Arquivo:** `backend/src/controllers/auth.controller.js`

**Mudanças:**
- Padrão: `Strict` → `Lax` (fallback mais seguro)
- COOKIE_SAMESITE: `None` (permite cross-site com Secure)
- Aplicado em login e logout

**Configuração de Cookie:**
```javascript
res.cookie('authToken', token, {
  httpOnly: true,           // Protege contra XSS
  secure: cookieSecure,      // HTTPS apenas em produção
  sameSite: 'none',          // Permite cross-site com Secure
  maxAge: 24 * 60 * 60 * 1000,  // 24 horas
  path: '/'
});
```

---

## 🚀 Deploy da Solução

### Passo 1: Git Push

```bash
cd backend
git add .env src/controllers/auth.controller.js
git commit -m "fix: permitir cookies cross-site com SameSite=None"
git push origin main
```

**Resultado:** Render faz auto-deploy (~2 minutos)

### Passo 2: Verificar Backend

```bash
# Testar se backend está respondendo
curl https://sf-dgci-backend.onrender.com/api/health

# Esperado: {"status":"OK"}
```

### Passo 3: Testar Login

1. Abrir: https://sindicato-dgci.free.nf/login
2. Login com credenciais: `admin@sf-dgci.gw` / `Admin@2026!`
3. ✅ **Verificar se permanece logado no dashboard**

---

## 🔐 Segurança

A configuração **`SameSite=None; Secure`** é:
- ✅ **Segura** quando usada com `Secure=true` (HTTPS obrigatório)
- ✅ **Necessária** para cross-site com `withCredentials: true`
- ✅ **Compatível** com CORS (credentials: true no backend)

**Por que é seguro:**
1. Apenas HTTPS (Secure)
2. Cookie httpOnly (protege contra XSS)
3. Validação CORS via FRONTEND_URL
4. Token JWT assinado (protege contra CSRF)

---

## 📊 Checklist Verificação

Após deploy:

- [ ] Backend online: https://sf-dgci-backend.onrender.com/api/health
- [ ] Login funciona
- [ ] Dashboard carrega (não redireciona para login)
- [ ] Dados aparecem (membros, quotas, etc)
- [ ] Permanecer logado ao navegar
- [ ] Logout funciona
- [ ] F12 > Cookies: `authToken` presente (httpOnly)

---

## 🧪 Teste Manual

### Verificar Cookies no Browser

1. Abrir: https://sindicato-dgci.free.nf
2. F12 (Developer Tools)
3. Ir a: **Application** > **Cookies**
4. Procurar por `authToken`
5. Verificar:
   - ✅ HttpOnly: true
   - ✅ Secure: true
   - ✅ SameSite: None
   - ✅ Domain: `.free.nf` (cross-site)

### Verificar Resposta de Login

```bash
curl -i -X POST https://sf-dgci-backend.onrender.com/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email":"admin@sf-dgci.gw",
    "password":"Admin@2026!"
  }'

# Procurar por:
# Set-Cookie: authToken=...; Path=/; Secure; HttpOnly; SameSite=None
```

---

## 🛠️ Troubleshooting

### Problema: Ainda desconecta após login

**Solução:**
1. Limpar cache do browser (Ctrl+Shift+Delete)
2. Reabrir aba (Ctrl+T)
3. Tentar login novamente

Ou:
```bash
# Verificar que backend foi atualizado
grep COOKIE_SAMESITE backend/.env
# Deve mostrar: COOKIE_SAMESITE=None

# Se não for igual, fazer git pull e redeploy
git pull origin main
```

### Problema: CORS error nos cookies

**Solução:** Verificar FRONTEND_URL

```bash
# backend/.env
grep FRONTEND_URL backend/.env
# Deve mostrar: FRONTEND_URL=https://sindicato-dgci.free.nf
```

Se errado:
1. Editar `backend/.env`
2. `git push` (redeploy)

### Problema: Cookie não persiste

**Verificação:**
1. F12 > Network > `/api/auth/login` > Response Headers
2. Procurar: `Set-Cookie: authToken=...`
3. Se não aparecer → Backend não está com as mudanças

---

## 📚 Documentação Técnica

| Conceito | Explicação |
|----------|-----------|
| **SameSite=Strict** | Bloqueia cookies cross-site (problema original) |
| **SameSite=Lax** | Permite em navegação, bloqueia em AJAX |
| **SameSite=None** | Permite cross-site (requer Secure) |
| **Secure** | Cookie apenas em HTTPS |
| **HttpOnly** | Cookie não acessível via JavaScript |

---

## ✨ Resultado Esperado

Após deploy:
- ✅ Login bem-sucedido
- ✅ Sessão permanece ativa
- ✅ Navegação entre páginas funciona
- ✅ Logout funciona
- ✅ Sem desconexões inesperadas

---

## 📞 Próximos Passos

1. **Fazer git push** das mudanças
2. **Aguardar 2 minutos** pelo auto-deploy do Render
3. **Testar login** em https://sindicato-dgci.free.nf/
4. **Verificar dashboard** carrega corretamente

Se algo não funcionar, ver seção "Troubleshooting" acima! ✅

