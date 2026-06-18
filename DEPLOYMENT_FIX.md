# 📦 Deploy Fix - Instruções Detalhadas

## ✅ Status do Fix

### Arquivos Criados/Atualizados:
- ✅ `backend/src/migrations/create-landing-slider.js` - Script de migração
- ✅ `backend/package.json` - Adicionado comando `npm run migrate:slider`
- ✅ Migração testada e funcionando localmente

---

## 🚀 Como Aplicar em Produção (Render)

### **Passo 1: Fazer Push das Mudanças**

```bash
git add backend/src/migrations/create-landing-slider.js backend/package.json
git commit -m "fix: criar script de migração para tabela landing_slider"
git push origin main
```

O Render fará auto-deploy automaticamente quando o código for empurrado.

---

### **Passo 2: Executar a Migração em Produção**

Opção A (Recomendado) - Via Render Shell:

1. Aceder a: https://dashboard.render.com
2. Selecionar: **sf-dgci-backend**
3. Clicar em: **"Shell"** (canto superior direito)
4. Executar:
```bash
npm run migrate:slider
```

5. Verificar output:
```
🔄 Executando migração: criar tabela landing_slider...
✅ Tabela landing_slider criada com sucesso!
✅ Dados de exemplo inseridos!
```

---

Opção B - Direto no Supabase SQL Editor:

1. Aceder a: https://supabase.com/dashboard
2. Selecionar projeto
3. **SQL Editor** > **New Query**
4. Executar este SQL:

```sql
-- Criar tabela landing_slider
CREATE TABLE IF NOT EXISTS landing_slider (
    id SERIAL PRIMARY KEY,
    titulo VARCHAR(255) NOT NULL,
    descricao TEXT,
    imagem_url VARCHAR(255) NOT NULL,
    link_url VARCHAR(255),
    ativo BOOLEAN DEFAULT true,
    ordem INTEGER DEFAULT 0,
    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Inserir slides de exemplo
INSERT INTO landing_slider (titulo, descricao, imagem_url, ativo, ordem)
VALUES 
  ('Bem-vindo ao Sindicato DGCI', 'Gestão moderna e transparente para os nossos membros', '/assets/slider-default.jpg', true, 1),
  ('Cotizações ao Dia', 'Consulte suas contribuições e saldo atualizado', '/assets/slider-default.jpg', true, 2),
  ('Comunicados Importantes', 'Fique informado com os últimos avisos e circulares', '/assets/slider-default.jpg', true, 3);
```

---

### **Passo 3: Verificar se Funcionou**

#### 🔗 Testar API Backend

```bash
# Diretamente
curl https://sf-dgci-backend.onrender.com/api/slider/public

# Com jq para formatar
curl -s https://sf-dgci-backend.onrender.com/api/slider/public | jq '.'
```

**Esperado:**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "titulo": "Bem-vindo ao Sindicato DGCI",
      "descricao": "Gestão moderna e transparente para os nossos membros",
      "imagem_url": "/assets/slider-default.jpg",
      "ativo": true,
      "ordem": 1
    }
  ]
}
```

#### 🌐 Testar Frontend (InfinityFree)

1. Aceder a: https://sindicato-dgci.free.nf
2. ✅ Slider da landing page deve carregar
3. ✅ Sem erros no console (F12 > Console)

---

### **Passo 4: Verificar Logs do Render**

1. Render Dashboard > **sf-dgci-backend**
2. Clicar em **"Logs"**
3. Procurar por erros (deve estar limpo após o fix)

```
❌ Antes:
error: relation "landing_slider" does not exist

✅ Depois:
[sem erros relacionados a landing_slider]
```

---

## 🛡️ Troubleshooting

### Problema: "Tabela já existe"
**Solução:** Normal! Usar `CREATE TABLE IF NOT EXISTS` evita erros.

### Problema: Render Shell não abre
1. Verificar se backend está em estado **"live"** (verde)
2. Esperar 2-3 minutos após push
3. Tentar novamente

### Problema: Dados de exemplo duplicados
1. Executar em Supabase SQL Editor:
```sql
DELETE FROM landing_slider WHERE id > 3;
VACUUM landing_slider;
```

---

## 📊 Checklist Final

- [ ] Git push realizado
- [ ] Render auto-deployed (verificar status)
- [ ] Migração executada (sem erros)
- [ ] `/api/slider/public` retorna dados
- [ ] Frontend carrega slider
- [ ] Logs limpos (sem erros landing_slider)
- [ ] Testar em https://sindicato-dgci.free.nf

---

## 📞 Suporte

Se persistirem problemas:

1. **Verificar conexão Supabase:**
```sql
SELECT * FROM landing_slider LIMIT 1;
```

2. **Ver logs do backend em Render:**
```
Render Dashboard > sf-dgci-backend > Logs
```

3. **Verificar credenciais .env em Render:**
```
Render Dashboard > sf-dgci-backend > Environment
Verificar: DB_HOST, DB_USER, DB_PASSWORD
```

