# 🎯 COMO RESOLVER - Guia Rápido

## 📌 O Problema
Não conseguir aceder a https://sindicato-dgci.free.nf/

## ✅ A Solução (3 passos, ~10 minutos)

---

## Passo 1️⃣: Reconstruir Frontend

### Automático (Recomendado):
```bash
cd ~/Documentos/PROJETOS/sindicato_dgci/Sistema_Sindicato
./build-frontend.sh
```

### Manual:
```bash
cd frontend
rm -rf dist node_modules
npm install
npm run build
```

**Resultado:** Pasta `dist/` com arquivos compilados ✅

---

## Passo 2️⃣: Upload para InfinityFree

### Opção A: File Manager (Fácil)
1. Abrir: https://www.infinityfree.net/
2. Login
3. Accounts > Your Websites > sindicato-dgci.free.nf
4. File Manager > public_html/
5. Selecionar tudo e deletar
6. Upload de `frontend/dist/*`
7. Aguardar conclusão

### Opção B: FTP (Rápido)
```bash
# Se tiver FileZilla ou similar:
# Host: ftpXX.infinityfree.net
# User: seu username
# Pass: sua password
# Copiar frontend/dist/* para /htdocs/
```

**Resultado:** Arquivos enviados para InfinityFree ✅

---

## Passo 3️⃣: Verificar

### Testar:
```bash
# Abrir browser
open https://sindicato-dgci.free.nf/

# OU verificar via terminal
curl https://sindicato-dgci.free.nf/
```

### Verificar erros:
- Pressione `F12` (ou Cmd+Option+I no Mac)
- Aba **Console**
- Procurar por erros vermelhos

---

## ✨ Pronto!

Se tudo correu bem:
- ✅ Página carrega
- ✅ Sem erros de CORS
- ✅ Login funciona
- ✅ Dashboard acessível

---

## 🚨 Se Ainda Não Funcionar

### 1️⃣ Verificar Erros (F12 Console)
**Erro:** "Cannot find module" ou 404
→ Reconstruir com: `./build-frontend.sh`

**Erro:** "CORS error"
→ Backend está offline (verificar Render)

**Erro:** "API undefined"
→ `.env.production` não foi lido

### 2️⃣ Verificar Backend
```bash
curl https://sf-dgci-backend.onrender.com/api/health
# Esperado: {"status":"OK"}
```

Se retornar erro → Backend offline (restart em Render)

### 3️⃣ Verificar InfinityFree

Upload não completou?
- Tentar novamente
- Usar FTP se File Manager falhar
- Verificar storage (limite 5GB)

---

## 📚 Documentação Completa

Para mais detalhes, ver:
- `TROUBLESHOOTING_ACESSO.md` - Diagnóstico completo
- `DEPLOY_INFINITYFREE.md` - Instruções detalhadas
- `PROBLEMAS_ACESSO.md` - Problemas e soluções

---

## 💡 Dica
Se precisar fazer mais deploys no futuro:
```bash
# Mais rápido:
cd frontend
npm run build
# E fazer upload de dist/
```

---

## ✅ Checklist

- [ ] `./build-frontend.sh` executado
- [ ] `dist/` contém arquivos
- [ ] Upload em InfinityFree completo
- [ ] Página carrega: https://sindicato-dgci.free.nf/
- [ ] F12 > Console: sem erros
- [ ] Login funciona
- [ ] Dashboard acessível

---

## 🚀 Próximas Ações

1. **Agora:** Execute `./build-frontend.sh`
2. **Depois:** Faça upload em InfinityFree (Passo 2)
3. **Por fim:** Teste em browser (Passo 3)

Caso algo não funcione, reveja o passo anterior!

