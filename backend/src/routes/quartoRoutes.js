const express = require('express');
const router = express.Router();
// IMPORTANTE: Ajuste o caminho abaixo para onde está o seu arquivo de conexão com o banco (ex: mysql ou pg)
const db = require('../database/conexao'); 

// 1. Rota para listar todos os quartos (GET) - ATUALIZADA PARA O DASHBOARD
router.get('/', async (req, res) => {
    try {
        // Executa a consulta real no banco de dados
        // Nota: Se usar PostgreSQL/pg, mude para: const resultado = await db.query('SELECT * FROM quartos ORDER BY numero ASC'); const quartos = resultado.rows;
        const [quartos] = await db.execute('SELECT numero, tipo, capacidade, preco_diaria, status FROM quartos ORDER BY numero ASC');
        
        // Envia a array diretamente para o frontend
        res.json(quartos); 
    } catch (error) {
        console.error("Erro ao buscar quartos no banco:", error);
        res.status(500).json({ erro: "Erro interno ao buscar quartos no servidor." });
    }
});

// 2. Rota do "Radar de Comando": Quartos disponíveis
router.get('/disponiveis', async (req, res) => {
    const { inicio, fim } = req.query;

    if (!inicio || !fim) {
        return res.status(400).json({ erro: "As datas de início e fim são obrigatórias." });
    }
    
    try {
        // Query clássica para ignorar quartos que já possuem reservas conflitantes no período
        const queryRadar = `
            SELECT * FROM quartos 
            WHERE status = 'Disponível' 
            AND numero NOT IN (
                SELECT id_quarto FROM reservas 
                WHERE status != 'Cancelada'
                AND (data_checkin < ? AND data_checkout > ?)
            )
        `;
        
        const [quartosDisponiveis] = await db.execute(queryRadar, [fim, inicio]);
        
        res.json(quartosDisponiveis);
    } catch (error) {
        console.error("Erro no radar de comando:", error);
        res.status(500).json({ erro: "Erro ao processar o radar de comando." });
    }
});

// 3. Rota para atualizar o status de um quarto (PATCH)
router.patch('/:id/status', async (req, res) => {
    const { id } = req.params; // número ou ID do quarto
    const { novoStatus } = req.body; 
    
    try {
        await db.execute('UPDATE quartos SET status = ? WHERE numero = ?', [novoStatus, id]);
        res.json({ mensagem: `Status do quarto ${id} atualizado para ${novoStatus} com sucesso.` });
    } catch (error) {
        console.error("Erro ao atualizar status:", error);
        res.status(500).json({ erro: "Não foi possível atualizar o status do quarto." });
    }
});

module.exports = router;