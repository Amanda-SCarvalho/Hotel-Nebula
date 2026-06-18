// frontend/app.js
const API_BASE_URL = 'http://localhost:3000';

document.addEventListener('DOMContentLoaded', () => {
    const mapaQuartos = document.getElementById('mapaQuartos');
    const formReserva = document.getElementById('formReserva');

    if (mapaQuartos) {
        carregarMetricas();
        carregarMapaQuartos();
        carregarClientesFieis();
        carregarFaturamento();
    }

    if (formReserva) {
        inicializarFormularioReserva(formReserva);
    }
});

/* ==========================================================================
   1. MÉTRICAS DO TOPO (Taxa de Ocupação, Check-ins, Manutenção)
   ========================================================================== */
async function carregarMetricas() {
    try {
        const response = await fetch(`${API_BASE_URL}/api/dashboard/metricas`);
        if (!response.ok) throw new Error('Erro ao buscar métricas');
        
        const dados = await response.json();

        // Vincula dinamicamente nos elementos do index.html se eles possuírem IDs
        const txtOcupacao = document.getElementById('taxaOcupacao') || document.querySelector('section.grid > div:nth-child(1) p.text-3xl');
        const txtCheckins = document.getElementById('checkinsHoje') || document.querySelector('section.grid > div:nth-child(2) p.text-3xl');
        const txtManutencao = document.getElementById('emManutencao') || document.querySelector('section.grid > div:nth-child(3) p.text-3xl');

        if (txtOcupacao) txtOcupacao.innerText = `${dados.taxaOcupacao}%`;
        if (txtCheckins) txtCheckins.innerText = dados.checkinsHoje;
        if (txtManutencao) txtManutencao.innerText = dados.quartosManutencao;

    } catch (error) {
        console.error('Erro ao carregar métricas:', error);
    }
}

/* ==========================================================================
   2. MAPA DE QUARTOS
   ========================================================================== */
async function carregarMapaQuartos() {
    const mapaContainer = document.getElementById('mapaQuartos');
    if (!mapaContainer) return;
    
    try {
        const response = await fetch(`${API_BASE_URL}/api/quartos`);
        if (!response.ok) throw new Error('Erro ao buscar quartos');
        
        const quartos = await response.json();
        mapaContainer.innerHTML = ''; 

        quartos.forEach(quarto => {
            const card = document.createElement('div');
            const statusMapeado = quarto.status ? quarto.status.toLowerCase() : '';
            
            let borderClass = 'border-l-emerald-600'; 
            let textClass = 'text-slate-900';

            if (statusMapeado.includes('ocupado')) {
                borderClass = 'border-l-slate-400';
                textClass = 'text-slate-500';
            } else if (statusMapeado.includes('manuten') || statusMapeado.includes('pendente')) {
                borderClass = 'border-l-amber-500';
                textClass = 'text-slate-900';
            }

            const numeroQuarto = quarto.numero || quarto.id_quarto || quarto.id;

            card.className = `bg-white border border-slate-200 border-l-4 ${borderClass} p-4 rounded-r-lg shadow-2xl shadow-slate-100/10 cursor-pointer hover:bg-slate-50/50 transition`;
            card.innerHTML = `
                <p class="text-sm font-bold ${textClass}">Quarto ${numeroQuarto}</p>
                <p class="text-[11px] text-slate-400 font-medium mt-0.5">${quarto.tipo || 'Standard'}</p>
            `;

            mapaContainer.appendChild(card);
        });
    } catch (error) {
        console.error('Erro ao renderizar mapa de quartos:', error);
        mapaContainer.innerHTML = `<p class="text-red-600 text-xs col-span-full">Erro de conexão ao carregar os quartos.</p>`;
    }
}

/* ==========================================================================
   3. CLIENTES MAIS FIÉIS
   ========================================================================== */
async function carregarClientesFieis() {
    const tabelaCorpo = document.querySelector('table tbody');
    if (!tabelaCorpo) return;

    try {
        const response = await fetch(`${API_BASE_URL}/api/clientes/fieis`);
        if (!response.ok) throw new Error();
        
        const clientes = await response.json();
        tabelaCorpo.innerHTML = '';

        clientes.forEach(cliente => {
            const iniciais = cliente.nome.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();

            tabelaCorpo.innerHTML += `
                <tr>
                    <td class="py-3 flex items-center space-x-2">
                        <span class="w-6 h-6 rounded-full bg-slate-100 text-slate-600 flex items-center justify-center text-[10px] font-bold">${iniciais}</span>
                        <span class="text-slate-900">${cliente.nome}</span>
                    </td>
                    <td class="py-3 text-right text-slate-500">${cliente.total_reservas} reservas</td>
                </tr>
            `;
        });
    } catch (error) {
        console.error('Erro ao buscar clientes fiéis:', error);
    }
}

/* ==========================================================================
   4. FATURAMENTO CONSOLIDADO
   ========================================================================== */
async function carregarFaturamento() {
    // Alvo: O container de faturamento que contém os blocos com valores
    const faturamentoContainer = document.querySelector('.space-y-3'); 
    if (!faturamentoContainer || faturamentoContainer.id === 'formReserva') return;

    try {
        const response = await fetch(`${API_BASE_URL}/api/dashboard/faturamento`);
        if (!response.ok) throw new Error();
        
        const historico = await response.json();
        faturamentoContainer.innerHTML = ''; // Limpa os dados estáticos anteriores

        historico.forEach(item => {
            // Formata o número vindo do banco como moeda brasileira (R$)
            const valorFormatado = Number(item.total).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

            faturamentoContainer.innerHTML += `
                <div class="flex justify-between items-center p-3 bg-slate-50/50 rounded-lg border border-slate-100">
                    <span class="text-xs font-semibold text-slate-700">${item.mes_ano}</span>
                    <span class="text-sm font-bold text-slate-900">${valorFormatado}</span>
                </div>
            `;
        });
    } catch (error) {
        console.error('Erro ao buscar faturamento consolidado:', error);
    }
}

/* ==========================================================================
   5. TELA DE REGISTRO DE RESERVA
   ========================================================================== */
function inicializarFormularioReserva(formReserva) {
    formReserva.addEventListener('submit', async (event) => {
        event.preventDefault();

        const dadosReserva = {
            id_hospede: parseInt(document.getElementById('id_hospede').value),
            id_quarto: parseInt(document.getElementById('id_quarto').value),
            data_checkin: document.getElementById('data_checkin').value,
            data_checkout: document.getElementById('data_checkout').value
        };

        try {
            const resposta = await fetch(`${API_BASE_URL}/api/reservas`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(dadosReserva)
            });

            const resultado = await resposta.json();

            if (resposta.ok) {
                exibirMensagem(resultado.mensagem || 'Reserva criada com sucesso!', 'bg-emerald-50 text-emerald-800 border-emerald-200');
                formReserva.reset(); 
            } else {
                exibirMensagem('Erro ao criar reserva no servidor.', 'bg-red-50 text-red-800 border-red-200');
            }
        } catch (error) {
            console.error('Erro de conexão:', error);
            exibirMensagem('Não foi possível conectar à API do Backend.', 'bg-red-50 text-red-800 border-red-200');
        }
    });
}

function exibirMensagem(texto, classesEstilo) {
    const mensagemStatus = document.getElementById('mensagemStatus');
    if (!mensagemStatus) return;
    mensagemStatus.innerText = texto;
    mensagemStatus.className = `mt-4 p-3 text-center text-xs font-semibold rounded-lg border block ${classesEstilo}`;
}