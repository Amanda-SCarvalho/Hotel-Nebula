// src/server.js
const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

const cors = require('cors');
app.use(cors()); 

// Middleware essencial para o Express conseguir ler dados em formato JSON no corpo (body) das requisições
app.use(express.json());

// Importação dos módulos de rotas
const quartoRoutes = require('./routes/quartoRoutes');
const reservaRoutes = require('./routes/reservaRoutes');
const clienteRoutes = require('./src/routes/clienteRoutes');
const dashboardRoutes = require('./src/routes/dashboardRoutes');

// Vinculando as rotas à aplicação com prefixos
app.use('/api/quartos', quartoRoutes);   
app.use('/api/reservas', reservaRoutes); 
app.use('/api/clientes', clienteRoutes);
app.use('/api/dashboard', dashboardRoutes);

// Rota base para testar se o servidor está online
app.get('/', (req, res) => {
    res.send('API do Hotel Nebula está a rodar perfeitamente! 🌌');
});

// Inicialização do Servidor
app.listen(PORT, () => {
    console.log(`Servidor HTTP a correr na porta ${PORT}`);
});