// src/routes/dashboardRoutes.js
const express = require('express');
const router = express.Router();
const db = require('../database/conexao'); 

// Rota 1: Estatísticas Rápidas (/api/dashboard/metricas)
router.get('/metricas', async (req, res) => {
    try {
        // 1. Total de quartos e quantos estão ocupados para calcular a taxa de ocupação real
        const [[{ totalQuartos }]] = await db.execute('SELECT COUNT(*) AS totalQuartos FROM quartos');
        const [[{ ocupados }]] = await db.execute("SELECT COUNT(*) AS ocupados FROM quartos WHERE LOWER(status) = 'ocupado'");
        
        // 2. Contar check-ins agendados para a data de hoje (baseado na data atual do sistema)
        const [[{ checkinsHoje }]] = await db.execute("SELECT COUNT(*) AS checkinsHoje FROM reservas WHERE DATE(data_checkin) = CURDATE() AND status != 'Cancelada'");

        // 3. Contar quantos quartos estão em manutenção
        const [[{ quartosManutencao }]] = await db.execute("SELECT COUNT(*) AS quartosManutencao FROM quartos WHERE LOWER(status) LIKE '%manuten%'");

        // Cálculo da taxa matemática simples de ocupação
        const taxaOcupacao = totalQuartos > 0 ? Math.round((ocupados / totalQuartos) * 100) : 0;

        res.json({
            taxaOcupacao,
            checkinsHoje,
            quartosManutencao
        });

    } catch (error) {
        console.error("Erro ao processar as métricas:", error);
        res.status(500).json({ erro: "Erro no servidor ao calcular indicadores." });
    }
});

// Rota 2: Faturamento Histórico Agrupado por Mês (/api/dashboard/faturamento)
router.get('/faturamento', async (req, res) => {
    try {
        // Agrupa os pagamentos pelo mês e ano da hospedagem realizada
        const queryFaturamento = `
            SELECT 
                DATE_FORMAT(h.checkin_real, '%M %Y') AS mes_ano,
                SUM(p.valor) AS total
            FROM pagamentos p
            INNER JOIN hospedagens h ON p.id_hospedagem = h.id_hospedagem
            GROUP BY YEAR(h.checkin_real), MONTH(h.checkin_real), mes_ano
            ORDER BY YEAR(h.checkin_real) DESC, MONTH(h.checkin_real) DESC
        `;
        
        const [resultados] = await db.execute(queryFaturamento);
        res.json(resultados);
    } catch (error) {
        console.error("Erro ao consolidar faturamento:", error);
        res.status(500).json({ erro: "Erro ao buscar faturamento bruto." });
    }
});

module.exports = router;
