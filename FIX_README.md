# 🎯 FIX CRÍTICO - Sindicato DGCI Produção

## 🔴 PROBLEMA

**Tabela `landing_slider` não existe no Supabase em produção**

```
erro: relation "landing_slider" does not exist
URL: /api/slider/public
Frequência: 100+ erros diários desde 15/06/2026
```

### Impacto:
- ❌ Backend (Render): Erro HTTP 500
- ❌ Frontend (InfinityFree): Slider quebrado
- ❌ Landing page não carrega corretamente

---

## ✅ SOLUÇÃO

### Arquivos Criados/Atualizados:

```
backend/
  src/migrations/
    └── create-landing-slider.js          ← NOVO: Script de migração
  └── package.json                         ← ATUALIZADO: +npm script

Docs/
  ├── RESUMO_FIX.md                       ← NOVO: Resumo executivo
  ├── DEPLOYMENT_FIX.md                   ← NOVO: Instruções detalhadas
  ├── FIX_PRODUCAO.md                     ← NOVO: Guia rápido
  └── deploy-fix.sh                       ← NOVO: Script helper

```

---

## 🚀 COMO RESOLVER (5 minutos)

### **Opção 1: Via Script Helper (RECOMENDADO)**

```bash
cd ~/Documentos/PROJETOS/sindicato_dgci/Sistema_Sindicato
./deploy-fix.sh
```

O script irá:
1. ✅ Validar projeto
2. ✅ Fazer commit e push
3. ✅ Testar migração localmente
4. ✅ Mostrar próximos passos

---

### **Opção 2: Manual Rápido**

#### 1️⃣ **Git Push**
```bash
cd backend
git add src/migrations/create-landing-slider.js package.json
git commit -m "fix: criar script de migração para landing_slider"
git push origin main
```

#### 2️⃣ **Executar Migração em Render Shell**

1. Aceder: https://dashboard.render.com
2. Projeto: **sf-dgci-backend**
3. Clicar: **Shell** (canto superior direito)
4. Executar:
```bash
npm run migrate:slider
```

**Esperado:**
```
🔄 Executando migração: criar tabela landing_slider...
✅ Tabela landing_slider criada com sucesso!
✅ Dados de exemplo inseridos!
```

#### 3️⃣ **Verificar**
```bash
# Testar API
curl https://sf-dgci-backend.onrender.com/api/slider/public

# Testar Frontend
open https://sindicato-dgci.free.nf
```

---

### **Opção 3: Direto no Supabase**

Se Render Shell não funcionar, executar no Supabase SQL Editor:

1. https://supabase.com/dashboard > postgres
2. **SQL Editor** > **New Query**
3. Colar SQL do arquivo **DEPLOYMENT_FIX.md**

---

## 📚 Documentação Completa

| Arquivo | Descrição |
|---------|-----------|
| **RESUMO_FIX.md** | Resumo executivo em 2 minutos |
| **DEPLOYMENT_FIX.md** | Instruções passo-a-passo completas |
| **FIX_PRODUCAO.md** | Guia rápido em português |
| **deploy-fix.sh** | Script automático de deployment |

---

## ✨ O Que Foi Feito

### Script de Migração
```javascript
// backend/src/migrations/create-landing-slider.js
CREATE TABLE IF NOT EXISTS landing_slider (
  id SERIAL PRIMARY KEY,
  titulo VARCHAR(255) NOT NULL,
  descricao TEXT,
  imagem_url VARCHAR(255) NOT NULL,
  ativo BOOLEAN DEFAULT true,
  ordem INTEGER DEFAULT 0,
  criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Command npm
```json
"migrate:slider": "node src/migrations/create-landing-slider.js"
```

---

## 🎯 Checklist Verificação

Após seguir os passos acima:

- [ ] Tabela criada no Supabase
- [ ] Dados de exemplo inseridos
- [ ] `/api/slider/public` retorna 200 OK
- [ ] Frontend carrega slider
- [ ] Logs do Render limpos
- [ ] Teste em https://sindicato-dgci.free.nf

---

## 📞 Troubleshooting

### "Render Shell não abre"
- Verificar se backend está em estado "live" (verde)
- Esperar 2-3 min após push
- Tentar novamente

### "Erro: tabela já existe"
- Normal! `IF NOT EXISTS` evita este erro
- Você pode executar seguramente

### "Dados de exemplo duplicados"
```sql
DELETE FROM landing_slider WHERE id > 3;
VACUUM landing_slider;
```

---

## 🎓 Causa Raiz

O schema.sql define a tabela com `CREATE TABLE IF NOT EXISTS` no final, mas dentro de uma transação (TRANSACTION/COMMIT). Se qualquer erro ocorrer antes dessa linha, toda a transação falha e a tabela não é criada.

**Solução:** Migração separada e independente que pode ser executada a qualquer momento.

---

## ⏱️ Cronograma

| Etapa | Tempo |
|-------|-------|
| Git Push | 1 min |
| Render Auto-Deploy | 2-3 min |
| Execução Migração | < 1 min |
| Verificação | 1 min |
| **TOTAL** | **~5 min** ✅ |

---

## 📌 Status

```
⏳ Aguardando deployment
├─ [ ] Git push
├─ [ ] Render auto-deploy
├─ [ ] Migração executada
├─ [ ] API verificada
└─ [ ] Frontend testado
```

**Próximo passo:** Execute `./deploy-fix.sh` ou siga Opção 2 acima.

