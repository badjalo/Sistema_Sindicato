const express = require('express');
const router = express.Router();
const { query } = require('../config/database');
const { authenticate } = require('../middleware/auth');

// ─── Auto-criar tabela ────────────────────────────────────────────────────────
const initTable = async () => {
    await query(`
        CREATE TABLE IF NOT EXISTS contacto_mensagens (
            id          SERIAL PRIMARY KEY,
            nome        VARCHAR(120) NOT NULL,
            email       VARCHAR(180) NOT NULL,
            assunto     VARCHAR(100) NOT NULL,
            mensagem    TEXT NOT NULL,
            estado      VARCHAR(20) NOT NULL DEFAULT 'pendente',  -- pendente | lida | respondida
            resposta    TEXT,
            respondido_por VARCHAR(120),
            respondido_em  TIMESTAMPTZ,
            criado_em   TIMESTAMPTZ NOT NULL DEFAULT NOW()
        )
    `);
};
initTable().catch(console.error);

// ─── PUBLIC: Enviar mensagem ──────────────────────────────────────────────────
router.post('/', async (req, res) => {
    const { nome, email, assunto, mensagem } = req.body;
    if (!nome || !email || !assunto || !mensagem) {
        return res.status(400).json({ success: false, message: 'Todos os campos são obrigatórios.' });
    }
    const result = await query(
        `INSERT INTO contacto_mensagens (nome, email, assunto, mensagem)
         VALUES ($1, $2, $3, $4) RETURNING id`,
        [nome.trim(), email.trim().toLowerCase(), assunto.trim(), mensagem.trim()]
    );

    // Enviar notificação para todos os administradores ativos
    try {
        const admins = await query("SELECT id FROM utilizadores WHERE perfil = 'administrador' AND ativo = true");
        for (const admin of admins.rows) {
            await query(
                `INSERT INTO notificacoes (utilizador_id, titulo, mensagem, tipo, lida, link)
                 VALUES ($1, $2, $3, $4, false, $5)`,
                [
                    admin.id,
                    'Nova Mensagem de Contacto',
                    `Recebeu uma nova mensagem de ${nome.trim()} (${email.trim().toLowerCase()}) sobre "${assunto.trim()}".`,
                    'contacto',
                    '/mensagens'
                ]
            );
        }
    } catch (err) {
        console.error('Erro ao gerar notificação no backend:', err.message);
    }

    res.status(201).json({ success: true, message: 'Mensagem enviada com sucesso.', id: result.rows[0].id });
});

// ─── ADMIN: Listar mensagens ──────────────────────────────────────────────────
router.get('/', authenticate, async (req, res) => {
    const { estado, page = 1, limit = 20 } = req.query;
    const offset = (page - 1) * limit;

    let where = '';
    const params = [];

    if (estado && estado !== 'todos') {
        params.push(estado);
        where = `WHERE estado = $${params.length}`;
    }

    const [rows, total] = await Promise.all([
        query(
            `SELECT * FROM contacto_mensagens ${where} ORDER BY criado_em DESC LIMIT $${params.length + 1} OFFSET $${params.length + 2}`,
            [...params, limit, offset]
        ),
        query(`SELECT COUNT(*) FROM contacto_mensagens ${where}`, params)
    ]);

    res.json({
        success: true,
        data: rows.rows,
        total: parseInt(total.rows[0].count),
        page: parseInt(page),
        totalPages: Math.ceil(total.rows[0].count / limit)
    });
});

// ─── ADMIN: Estatísticas ──────────────────────────────────────────────────────
router.get('/stats', authenticate, async (req, res) => {
    const result = await query(`
        SELECT 
            COUNT(*) FILTER (WHERE estado = 'pendente')   AS pendentes,
            COUNT(*) FILTER (WHERE estado = 'lida')       AS lidas,
            COUNT(*) FILTER (WHERE estado = 'respondida') AS respondidas,
            COUNT(*)                                       AS total
        FROM contacto_mensagens
    `);
    res.json({ success: true, data: result.rows[0] });
});

// ─── ADMIN: Ver mensagem individual ──────────────────────────────────────────
router.get('/:id', authenticate, async (req, res) => {
    const result = await query('SELECT * FROM contacto_mensagens WHERE id = $1', [req.params.id]);
    if (!result.rows.length) return res.status(404).json({ success: false, message: 'Mensagem não encontrada.' });

    // Marcar como lida se ainda pendente
    if (result.rows[0].estado === 'pendente') {
        await query('UPDATE contacto_mensagens SET estado = $1 WHERE id = $2', ['lida', req.params.id]);
        result.rows[0].estado = 'lida';
    }
    res.json({ success: true, data: result.rows[0] });
});

// ─── ADMIN: Responder mensagem ────────────────────────────────────────────────
router.post('/:id/resposta', authenticate, async (req, res) => {
    const { resposta } = req.body;
    if (!resposta?.trim()) return res.status(400).json({ success: false, message: 'A resposta não pode estar vazia.' });

    const check = await query('SELECT id FROM contacto_mensagens WHERE id = $1', [req.params.id]);
    if (!check.rows.length) return res.status(404).json({ success: false, message: 'Mensagem não encontrada.' });

    const respondidoPor = req.user?.nome || req.user?.email || 'Administrador';
    await query(
        `UPDATE contacto_mensagens
         SET estado = 'respondida', resposta = $1, respondido_por = $2, respondido_em = NOW()
         WHERE id = $3`,
        [resposta.trim(), respondidoPor, req.params.id]
    );
    res.json({ success: true, message: 'Resposta registada com sucesso.' });
});

// ─── ADMIN: Marcar estado ─────────────────────────────────────────────────────
router.patch('/:id/estado', authenticate, async (req, res) => {
    const { estado } = req.body;
    const estadosValidos = ['pendente', 'lida', 'respondida'];
    if (!estadosValidos.includes(estado)) return res.status(400).json({ success: false, message: 'Estado inválido.' });

    await query('UPDATE contacto_mensagens SET estado = $1 WHERE id = $2', [estado, req.params.id]);
    res.json({ success: true, message: 'Estado atualizado.' });
});

// ─── ADMIN: Eliminar mensagem ─────────────────────────────────────────────────
router.delete('/:id', authenticate, async (req, res) => {
    await query('DELETE FROM contacto_mensagens WHERE id = $1', [req.params.id]);
    res.json({ success: true, message: 'Mensagem eliminada.' });
});

module.exports = router;
