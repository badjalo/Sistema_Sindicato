# 🚨 FIX URGENTE - Problema de Produção

## Status Encontrado
- ❌ **Tabela `landing_slider` não existe no Supabase**
- 🔴 **Render Backend**: Erro "relation landing_slider does not exist"
- 🔴 **InfinityFree Frontend**: Não consegue carregar slider da landing page

---

## ⚡ Solução IMEDIATA

### Opção 1: Via Terminal (Linux/Mac)

```bash
cd backend
npm run migrate:slider
```

**Esperado:** 
```
🔄 Executando migração: criar tabela landing_slider...
✅ Tabela landing_slider criada com sucesso!
✅ Dados de exemplo inseridos!
```

### Opção 2: Via Render Dashboard (Recomendado)

1. **Login em render.com**
2. **Ir para: sf-dgci-backend > Shell**
3. **Executar:**
```bash
npm run migrate:slider
```

### Opção 3: Via Supabase Console (SQL Editor)

1. **Login em supabase.com**
2. **Projeto: postgres**
3. **SQL Editor > New Query**
4. **Colar:**

```sql
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

5. **Clicar em "RUN"**

---

## 🔍 Verificar se Funcionou

### Backend (Render)
```bash
curl https://sf-dgci-backend.onrender.com/api/slider/public
```

**Esperado:**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "titulo": "Bem-vindo ao Sindicato DGCI",
      "ativo": true
    }
  ]
}
```

### Frontend (InfinityFree)
- Aceder a: `https://sindicato-dgci.free.nf`
- Verificar se o **slider da landing page** carrega corretamente

---

## 📋 Checklist Final

- [ ] Tabela `landing_slider` criada
- [ ] Dados de exemplo inseridos
- [ ] `/api/slider/public` retorna dados
- [ ] Frontend carrega o slider
- [ ] Sem erros nos logs do Render

---

## 🛡️ Preventivo Futuro

Para evitar isso novamente:

1. **Sempre testar migrações localmente:**
```bash
npm run migrate:slider
```

2. **Antes de deploy:**
- ✅ Testar schema.sql localmente
- ✅ Verificar todas as tabelas com `\dt` (psql)
- ✅ Rodar seeds/migrações

3. **Em Render Pós-Deploy:**
- ✅ Executar script de verificação
- ✅ Conferir logs por erros

