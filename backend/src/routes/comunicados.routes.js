const router = require('express').Router();
const { authenticate } = require('../middleware/auth');
const { authorize } = require('../middleware/rbac');
const { query } = require('../config/database');
const ctrl = require('../controllers/comunicados.controller');

// ─── ROTA PÚBLICA (sem autenticação) para comunicados publicados ───────────
router.get('/publicos', async (req, res, next) => {
    try {
        const { tipo, search = '' } = req.query;
        let where = "WHERE c.estado = 'publicado'";
        const params = [];
        if (tipo) {
            params.push(tipo);
            where += ` AND c.tipo = $${params.length}`;
        }
        if (search) {
            params.push(`%${search}%`);
            where += ` AND c.titulo ILIKE $${params.length}`;
        }
        const result = await query(`
      SELECT c.id, c.titulo, c.tipo, c.conteudo, c.urgente,
             to_char(c.data_publicacao AT TIME ZONE 'UTC', 'YYYY-MM-DD"T"HH24:MI:SS"Z"') as data_publicacao,
             to_char(c.criado_em AT TIME ZONE 'UTC', 'YYYY-MM-DD"T"HH24:MI:SS"Z"') as criado_em,
             u.nome as autor_nome
      FROM comunicados c
      LEFT JOIN utilizadores u ON u.id = c.autor_id
      ${where} ORDER BY c.data_publicacao DESC NULLS LAST, c.criado_em DESC
    `, params);
        res.json({ success: true, data: result.rows });
    } catch (err) { next(err); }
});

router.get('/resumo-tipos', authenticate, authorize('comunicados:read'), ctrl.resumoTipos);
router.get('/', authenticate, authorize('comunicados:read'), ctrl.listar);
router.post('/', authenticate, authorize('comunicados:create'), ctrl.criar);
router.put('/:id', authenticate, authorize('comunicados:update'), ctrl.atualizar);
router.delete('/:id', authenticate, authorize('comunicados:delete'), ctrl.eliminar);

module.exports = router;
