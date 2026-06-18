#!/bin/bash

# 🚀 Build Frontend - Sistema Sindicato DGCI
# Script para compilar e preparar deployment

set -e

echo "╔═══════════════════════════════════════════════════════════╗"
echo "║   🚀 Build Frontend - Sistema Sindicato DGCI             ║"
echo "║   Compilando para produção (InfinityFree)                ║"
echo "╚═══════════════════════════════════════════════════════════╝"
echo ""

# Cores
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

status() { echo -e "${GREEN}✅${NC} $1"; }
error() { echo -e "${RED}❌${NC} $1"; exit 1; }
warning() { echo -e "${YELLOW}⚠️ ${NC} $1"; }

# 1. Validar ambiente
echo "📋 Validando ambiente..."
if [ ! -d "frontend" ]; then
  error "Não estou no diretório raiz do projeto"
fi
status "Diretório correto"

cd frontend

if [ ! -f ".env.production" ]; then
  error "Arquivo .env.production não encontrado"
fi
status ".env.production encontrado"

# Verificar URL
if ! grep -q "VITE_API_URL=https://sf-dgci-backend.onrender.com" .env.production; then
  warning "URL do backend pode estar desatualizada"
  echo "Conteúdo de .env.production:"
  cat .env.production
  echo ""
fi

# 2. Limpar builds anteriores
echo ""
echo "🧹 Limpando builds anteriores..."
rm -rf dist node_modules package-lock.json
status "Build anterior removido"

# 3. Instalar dependências
echo ""
echo "📦 Instalando dependências..."
npm install > /tmp/npm-install.log 2>&1 || error "Erro ao instalar dependências"
status "Dependências instaladas"

# 4. Verificar .env.production
echo ""
echo "🔍 Verificando configuração..."
echo "VITE_API_URL: $(grep VITE_API_URL .env.production)"

# 5. Compilar
echo ""
echo "🔨 Compilando frontend..."
npm run build > /tmp/npm-build.log 2>&1 || error "Erro ao compilar"
status "Frontend compilado com sucesso"

# 6. Verificar resultado
echo ""
echo "📊 Resultado do build:"
ls -lh dist/ | head -10
echo ""
du -sh dist/
echo ""

# 7. Informações úteis
echo "╔═══════════════════════════════════════════════════════════╗"
echo "║  ✨ Build Completo!                                      ║"
echo "╠═══════════════════════════════════════════════════════════╣"
echo "║  📦 Arquivos compilados em: frontend/dist/               ║"
echo "║                                                          ║"
echo "║  📤 Próximo passo: Upload em InfinityFree               ║"
echo "║                                                          ║"
echo "║  📖 Ver: DEPLOY_INFINITYFREE.md para instruções          ║"
echo "╠═══════════════════════════════════════════════════════════╣"
echo "║  Opção 1 - File Manager (Manual):                       ║"
echo "║    1. Ir para: https://www.infinityfree.net/             ║"
echo "║    2. File Manager > public_html/                        ║"
echo "║    3. Deletar tudo                                       ║"
echo "║    4. Upload de dist/*                                   ║"
echo "║                                                          ║"
echo "║  Opção 2 - FTP (Rápido):                                ║"
echo "║    scp -r dist/* user@host:/home/infinityfree/htdocs/  ║"
echo "║                                                          ║"
echo "║  Opção 3 - Verificar .htaccess:                         ║"
echo "║    Ver: DEPLOY_INFINITYFREE.md (seção .htaccess)        ║"
echo "╠═══════════════════════════════════════════════════════════╣"
echo "║  ✅ Testar após upload:                                  ║"
echo "║     https://sindicato-dgci.free.nf/                     ║"
echo "║                                                          ║"
echo "║  🔐 Login:                                              ║"
echo "║     admin@sf-dgci.gw / Admin@2026!                     ║"
echo "╚═══════════════════════════════════════════════════════════╝"
echo ""
status "Setup completo! Siga os próximos passos acima."
