-- Quais quartos estão disponíveis em determinado período?
-- (Exemplo para o período de 2026-07-01 a 2026-07-10)

SELECT * FROM quartos
WHERE status != 'Manutenção'
  AND id_quarto NOT IN (
    SELECT id_quarto FROM reservas
    WHERE status IN ('Pendente', 'Confirmada')
      AND (data_checkin < '2026-07-10' AND data_checkout > '2026-07-01')
  );

--Quais hóspedes mais realizaram reservas?
SELECT h.nome, COUNT(r.id_reserva) AS total_reservas
FROM hospedes h
LEFT JOIN reservas r ON h.id_hospede = r.id_hospede
GROUP BY h.id_hospede, h.nome
ORDER BY total_reservas DESC;

--Qual foi o faturamento por mês?
SELECT 
    DATE_FORMAT(data_pagamento, '%Y-%m') AS mes,
    SUM(valor) AS faturamento_total
FROM pagamentos
GROUP BY DATE_FORMAT(data_pagamento, '%Y-%m')
ORDER BY mes DESC;

--Quais serviços extras são mais consumidos?
SELECT s.nome, SUM(hs.quantidade) AS total_consumido, SUM(hs.quantidade * s.preco) AS receita_gerada
FROM servicos s
JOIN hospedagens_servicos hs ON s.id_servico = hs.id_servico
GROUP BY s.id_servico, s.nome
ORDER BY total_consumido DESC;

--Quais quartos receberam melhores avaliações?
SELECT q.numero, q.tipo, AVG(f.nota) AS media_avaliacao
FROM quartos q
JOIN reservas r ON q.id_quarto = r.id_quarto
JOIN hospedagens h ON r.id_reserva = h.id_reserva
JOIN feedbacks f ON h.id_hospedagem = f.id_hospedagem
GROUP BY q.id_quarto, q.numero, q.tipo
ORDER BY media_avaliacao DESC;

--Quais reservas foram canceladas?
SELECT r.id_reserva, h.nome AS hospede, q.numero AS quarto, r.data_checkin
FROM reservas r
JOIN hospedes h ON r.id_hospede = h.id_hospede
JOIN quartos q ON r.id_quarto = q.id_quarto
WHERE r.status = 'Cancelada';

--Quantas hospedagens cada profissional atendeu no Check-in?
SELECT f.nome, f.cargo, COUNT(h.id_hospedagem) AS checkins_realizados
FROM funcionarios f
LEFT JOIN hospedagens h ON f.id_funcionario = h.id_funcionario_checkin
GROUP BY f.id_funcionario, f.nome, f.cargo
ORDER BY checkins_realizados DESC;