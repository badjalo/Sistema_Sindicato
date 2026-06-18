#!/bin/bash

# 🚀 Deploy Fix - Sindicato DGCI
# Script para fazer deploy do fix de produção

set -e

echo "╔═══════════════════════════════════════════════════════════╗"
echo "║   🚀 Deploy Fix - Tabela Landing Slider                  ║"
echo "║   Sindicato DGCI - 18/06/2026                            ║"
echo "╚═══════════════════════════════════════════════════════════╝"
echo ""

# Cores
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Função para imprimir status
status() {
  echo -e "${GREEN}✅${NC} $1"
}

error() {
  echo -e "${RED}❌${NC} $1"
  exit 1
}

warning() {
  echo -e "${YELLOW}⚠️ ${NC} $1"
}

# 1. Validar ambiente
echo "📋 Validando ambiente..."
if [ ! -f "backend/package.json" ]; then
  error "Não estou no diretório raiz do projeto"
fi
status "Diretório correto"

if [ ! -f "backend/src/migrations/create-landing-slider.js" ]; then
  error "Arquivo de migração não encontrado"
fi
status "Script de migração encontrado"

# 2. Verificar git
echo ""
echo "📦 Verificando Git..."
if ! git status > /dev/null 2>&1; then
  error "Não é um repositório Git"
fi
status "Repositório Git válido"

# 3. Verificar mudanças
if ! git diff --quiet backend/src/migrations/create-landing-slider.js 2>/dev/null || \
   ! git diff --quiet backend/package.json 2>/dev/null; then
  warning "Arquivos com mudanças não staged"
fi

# 4. Opção de commit
echo ""
read -p "📝 Fazer commit das mudanças? (s/n) " -n 1 -r
echo
if [[ $REPLY =~ ^[Ss]$ ]]; then
  git add backend/src/migrations/create-landing-slider.js backend/package.json
  git commit -m "fix: criar script de migração para tabela landing_slider" || warning "Nada para commitar"
  status "Commit realizado"
fi

# 5. Push
echo ""
read -p "🚀 Fazer push para origin/main? (s/n) " -n 1 -r
echo
if [[ $REPLY =~ ^[Ss]$ ]]; then
  git push origin main || error "Erro no push"
  status "Push realizado"
  echo ""
  echo "⏳ Render está fazendo auto-deploy..."
  echo "   Aguarde 2-3 minutos para o backend estar pronto"
fi

# 6. Testar localmente (opcional)
echo ""
read -p "🧪 Testar migração localmente? (s/n) " -n 1 -r
echo
if [[ $REPLY =~ ^[Ss]$ ]]; then
  cd backend
  npm run migrate:slider || error "Erro na migração"
  cd ..
  status "Migração testada localmente com sucesso"
fi

# 7. Instruções finais
echo ""
echo "╔═══════════════════════════════════════════════════════════╗"
echo "║  📌 Próximos Passos (Executar em Render Shell)           ║"
echo "╠═══════════════════════════════════════════════════════════╣"
echo "║  1. Aceder: https://dashboard.render.com                ║"
echo "║  2. Selecionar: sf-dgci-backend                         ║"
echo "║  3. Clicar: Shell                                       ║"
echo "║  4. Executar: npm run migrate:slider                    ║"
echo "║                                                         ║"
echo "║  Esperado: ✅ Tabela landing_slider criada com sucesso! ║"
echo "╠═══════════════════════════════════════════════════════════╣"
echo "║  🔗 Verificar API:                                       ║"
echo "║  curl https://sf-dgci-backend.onrender.com/api/slider/public ║"
echo "║                                                         ║"
echo "║  🌐 Verificar Frontend:                                 ║"
echo "║  https://sindicato-dgci.free.nf                        ║"
echo "╚═══════════════════════════════════════════════════════════╝"
echo ""
status "Setup completo! Siga os próximos passos acima."
