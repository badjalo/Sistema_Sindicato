# 📦 Deploy Frontend - InfinityFree

## 🎯 Objetivo
Deploy do frontend compilado em https://sindicato-dgci.free.nf/

---

## 📋 Pré-requisitos

- ✅ Backend rodando em Render: https://sf-dgci-backend.onrender.com
- ✅ Credenciais InfinityFree
- ✅ Node.js v18+ instalado

---

## 🚀 Passo 1: Preparar Build Local

```bash
cd frontend

# 1. Limpar builds anteriores
rm -rf dist node_modules package-lock.json

# 2. Instalar dependências
npm install

# 3. Verificar que .env.production está correto
cat .env.production
# Esperado:
# VITE_API_URL=https://sf-dgci-backend.onrender.com/api

# 4. Compilar para produção
npm run build

# 5. Verificar resultado
ls -lh dist/
# Deve ter arquivos .js, .css, index.html
```

---

## 📤 Passo 2: Upload em InfinityFree

### Opção A: Via File Manager (Fácil)

1. **Aceder ao painel InfinityFree:**
   - https://www.infinityfree.net/
   - Login com sua conta
   - Ir para: Accounts > Your Websites > sindicato-dgci.free.nf

2. **File Manager > public_html/**

3. **Deletar tudo:**
   - Selecionar todos os arquivos (Ctrl+A)
   - Delete

4. **Upload dos novos arquivos:**
   - Ir para: `frontend/dist/`
   - Selecionar todos
   - Drag & Drop no File Manager

5. **Aguardar upload** (~2 minutos)

---

### Opção B: Via FTP (Mais Rápido)

Se tiver FTP client (FileZilla, Cyberduck):

1. **Credenciais FTP InfinityFree:**
   - Host: `ftpXX.infinityfree.net` (ver em Settings)
   - User: seu username
   - Pass: sua password
   - Folder: `/htdocs/` (não `public_html`)

2. **Conectar e navegar até `/htdocs/`**

3. **Deletar conteúdo antigo** (exceto .htaccess)

4. **Copiar todos os arquivos de `frontend/dist/`**

5. **Esperar conclusão** (~5 minutos)

---

### Opção C: Automática (Script)

Se tiver SSH acesso:

```bash
cd frontend
npm run build

# Fazer upload via rsync/git/outro método
# Exemplo (se SSH disponível):
scp -r dist/* user@host:/home/infinityfree/htdocs/
```

---

## 🔧 Passo 3: Configuração InfinityFree

### Se página fica branca:

1. **Ir a Settings > Basic Settings**
2. **Primary domain:** `sindicato-dgci.free.nf`
3. **Document root:** `/htdocs/` (ou vazio)
4. **PHP:** Desativar (não é necessário para SPA)

### Se 404 em refresh:

Criar ou editar `public_html/.htaccess`:

```apache
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /
  
  # Não rewrite se for arquivo real
  RewriteCond %{REQUEST_FILENAME} !-f
  RewriteCond %{REQUEST_FILENAME} !-d
  
  # Redirecionar tudo para index.html (SPA)
  RewriteRule ^ index.html [QSA,L]
</IfModule>

# Gzip compression
<IfModule mod_deflate.c>
  AddOutputFilterByType DEFLATE text/plain
  AddOutputFilterByType DEFLATE text/html
  AddOutputFilterByType DEFLATE text/xml
  AddOutputFilterByType DEFLATE text/css
  AddOutputFilterByType DEFLATE text/javascript
  AddOutputFilterByType DEFLATE application/xml
  AddOutputFilterByType DEFLATE application/xhtml+xml
  AddOutputFilterByType DEFLATE application/rss+xml
  AddOutputFilterByType DEFLATE application/javascript
  AddOutputFilterByType DEFLATE application/x-javascript
  AddOutputFilterByType DEFLATE application/x-font-ttf
  AddOutputFilterByType DEFLATE font/opentype
</IfModule>

# Cache
<IfModule mod_expires.c>
  ExpiresActive On
  ExpiresByType image/jpg "access plus 1 year"
  ExpiresByType image/jpeg "access plus 1 year"
  ExpiresByType image/gif "access plus 1 year"
  ExpiresByType image/png "access plus 1 year"
  ExpiresByType text/css "access plus 1 month"
  ExpiresByType text/javascript "access plus 1 month"
  ExpiresByType application/javascript "access plus 1 month"
</IfModule>
```

---

## ✅ Verificação

### 1. Página carrega?
```bash
curl -I https://sindicato-dgci.free.nf/
# Esperado: HTTP 200
```

### 2. Sem erros de CORS?
```bash
# Abrir F12 > Console
# Recarregar página
# Procurar por erros de CORS
```

### 3. Login funciona?
- Ir a https://sindicato-dgci.free.nf/login
- Usar: admin@sf-dgci.gw / Admin@2026!
- Se funcionar: ✅ Deploy bem-sucedido!

---

## 🚨 Problemas Comuns

### Problema: "Página branca"

**Causa:** Build não executado ou .env.production errado

**Solução:**
```bash
cd frontend
cat .env.production
# Deve conter: VITE_API_URL=https://sf-dgci-backend.onrender.com/api

npm run build
# Upload de `dist/` novamente
```

---

### Problema: "404 em refresh"

**Causa:** .htaccess não configurado

**Solução:** Criar `.htaccess` na raiz (ver seção acima)

---

### Problema: "CORS error"

**Causa:** Backend não autoriza domínio do InfinityFree

**Solução:**
1. Verificar `backend/.env`:
```
FRONTEND_URL=https://sindicato-dgci.free.nf
```

2. Se errado, atualizar e fazer `git push`
3. Render faz auto-deploy
4. Tentar novamente

---

### Problema: "Muito lento"

**Dica:** InfinityFree é gratuito e tem limitações
- ✅ Gzip já configurado em .htaccess
- ✅ Cache já configurado
- Considerar upgrade se crescer muito

---

## 📋 Checklist

- [ ] `npm run build` sem erros
- [ ] `dist/` contém arquivos compilados
- [ ] Upload em `public_html/` completado
- [ ] .htaccess criado
- [ ] https://sindicato-dgci.free.nf/ carrega
- [ ] F12 Console sem erros
- [ ] Login funciona
- [ ] Dashboard carrega

---

## 🎯 Próximos Deploys

Para próximos deploys (mais rápido):

```bash
cd frontend
npm run build
# Upload `dist/*` novamente em InfinityFree
# OU: scp -r dist/* user@host:/home/infinityfree/htdocs/
```

Pronto! ✅

