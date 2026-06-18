/**
 * Migração: Criar tabela landing_slider
 * Executar com: node src/migrations/create-landing-slider.js
 */

require('dotenv').config();
const { query } = require('../config/database');

const createTableSQL = `
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
`;

async function migrate() {
    try {
        console.log('🔄 Executando migração: criar tabela landing_slider...');

        await query(createTableSQL);

        console.log('✅ Tabela landing_slider criada com sucesso!');

        // Adicionar dados de exemplo
        const insertExample = `
    INSERT INTO landing_slider (titulo, descricao, imagem_url, ativo, ordem)
    VALUES 
      ('Bem-vindo ao Sindicato DGCI', 'Gestão moderna e transparente para os nossos membros', '/assets/slider-default.jpg', true, 1),
      ('Cotizações ao Dia', 'Consulte suas contribuições e saldo atualizado', '/assets/slider-default.jpg', true, 2),
      ('Comunicados Importantes', 'Fique informado com os últimos avisos e circulares', '/assets/slider-default.jpg', true, 3)
    ON CONFLICT DO NOTHING;
    `;

        try {
            await query(insertExample);
            console.log('✅ Dados de exemplo inseridos!');
        } catch (err) {
            console.log('⚠️  Dados de exemplo já existem ou erro ao inserir');
        }

        process.exit(0);
    } catch (err) {
        console.error('❌ Erro na migração:', err.message);
        process.exit(1);
    }
}

migrate();
