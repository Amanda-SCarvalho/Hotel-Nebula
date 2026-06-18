// src/routes/clienteRoutes.js
const express = require('express');
const router = express.Router();
// IMPORTANTE: Ajuste o caminho para o seu arquivo de conexão com o banco de dados
const db = require('../database/conexao'); 

// 1. Rota para listar os clientes mais fiéis (GET /api/clientes/fieis)
router.get('/fieis', async (req, res) => {
    try {
        // Query SQL baseada na sua massa de dados (DML)
        // Conta quantas reservas cada hóspede tem, agrupa pelo ID/Nome e ordena do maior para o menor
        const queryFieis = `
            SELECT 
                h.nome, 
                COUNT(r.id_reserva) AS total_reservas
            FROM hospedes h
            INNER JOIN reservas r ON h.id_hospede = r.id_hospede
            WHERE r.status != 'Cancelada'
            GROUP BY h.id_hospede, h.nome
            ORDER BY total_reservas DESC
            LIMIT 3
        `;

        // Executa a query no banco de dados
        // Nota: Se usar PostgreSQL, mude para: const resultado = await db.query(queryFieis); const dados = resultado.rows;
        const [dados] = await db.execute(queryFieis);

        // Retorna a lista de clientes para o app.js do frontend
        res.json(dados);

    } catch (error) {
        console.error("Erro ao buscar clientes fiéis no banco:", error);
        res.status(500).json({ erro: "Erro interno ao processar ranking de clientes." });
    }
});

// 2. Rota genérica para listar todos os hóspedes (Caso precise para um select ou busca)
router.get('/', async (req, res) => {
    try {
        const [hospedes] = await db.execute('SELECT id_hospede, nome, email FROM hospedes ORDER BY nome ASC');
        res.json(hospedes);
    } catch (error) {
        console.error("Erro ao listar hóspedes:", error);
        res.status(500).json({ erro: "Erro ao buscar hóspedes." });
    }
});

module.exports = router;