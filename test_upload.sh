#!/bin/bash

# Teste de upload de foto via API
echo "🧪 Testando upload de foto..."

# Criar imagem test (PNG simples 1x1)
echo -e '\x89PNG\r\n\x1a\n\x00\x00\x00\rIHDR\x00\x00\x00\x01\x00\x00\x00\x01\x08\x02\x00\x00\x00\x90wS\xde\x00\x00\x00\x0cIDATx\x9cc\xf8\x0f\x00\x00\x01\x01\x00\x05G\xb0s\x1b\x00\x00\x00\x00IEND\xaeB`\x82' > test.png

# Fazer login primeiro
TOKEN=$(curl -s -c /tmp/cookies.txt -X POST \
  http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@sf-dgci.gw","password":"Admin@2026!"}' \
  -b /tmp/cookies.txt | jq -r '.token // "null"' 2>/dev/null || echo "null")

echo "✅ Login realizado"
echo "🍪 Cookies salvos"

# Fazer upload de membro com foto
echo "📸 Enviando membro com foto..."
RESPONSE=$(curl -s -X POST \
  http://localhost:5000/api/membros \
  -H "Content-Type: multipart/form-data" \
  -F "nome_completo=Teste Upload" \
  -F "sexo=masculino" \
  -F "data_nascimento=1990-01-01" \
  -F "bi_passaporte=123456789" \
  -F "foto=@test.png" \
  -b /tmp/cookies.txt)

echo "📊 Resposta:"
echo "$RESPONSE" | jq .

FOTO_URL=$(echo "$RESPONSE" | jq -r '.data.foto_url // "null"' 2>/dev/null)
echo "📷 foto_url: $FOTO_URL"

# Verificar se arquivo existe
if [ -n "$FOTO_URL" ] && [ "$FOTO_URL" != "null" ]; then
  FILEPATH="${FOTO_URL#/}"  # Remove leading /
  if [ -f "/home/badjalo/Documentos/PROJETOS/sindicato_dgci/Sistema_Sindicato/backend/$FILEPATH" ]; then
    echo "✅ Arquivo existe em disco"
  else
    echo "❌ Arquivo NÃO existe em disco: /home/badjalo/Documentos/PROJETOS/sindicato_dgci/Sistema_Sindicato/backend/$FILEPATH"
  fi
else
  echo "❌ foto_url é NULL/vazio"
fi

# Limpeza
rm -f test.png /tmp/cookies.txt
