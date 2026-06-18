const sharp = require('sharp');
const fs = require('fs');

// Criar imagem JPEG 100x100 válida
sharp({
  create: {
    width: 100,
    height: 100,
    channels: 3,
    background: { r: 255, g: 0, b: 0 }
  }
})
  .jpeg({ quality: 90 })
  .toFile('/tmp/test_image.jpg')
  .then(() => {
    console.log('✅ Imagem criada: /tmp/test_image.jpg');
    const stats = fs.statSync('/tmp/test_image.jpg');
    console.log('📊 Tamanho:', stats.size, 'bytes');
  })
  .catch(err => console.error('❌ Erro:', err.message));
