// src/routes/reservaRoutes.js
const express = require('express');
const router = express.Router();

// Rota para criar uma nova reserva (POST)
router.post('/', (req, res) => {
    const { id_hospede, id_quarto, data_checkin, data_checkout } = req.body;
    
    // Aqui aplicaria a validação de Overbooking antes do INSERT no banco
    res.status(201).json({ 
        mensagem: "Reserva criada com sucesso!",
        detalhes: { id_hospede, id_quarto }
    });
});

module.exports = router;