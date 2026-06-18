-- Massa de dados para teste
INSERT INTO hospedes (nome, email, cpf, telefone, data_nascimento) VALUES
('Luke Skywalker', 'luke@galaxy.com', '111.111.111-11', '11999999999', '1995-05-25'),
('Leia Organa', 'leia@galaxy.com', '222.222.222-22', '11988888888', '1995-05-25'),
('Han Solo', 'han@milennium.com', '333.333.333-33', '11977777777', '1990-10-12');

INSERT INTO quartos (numero, tipo, capacidade, preco_diaria, status) VALUES
('101', 'Standard', 2, 150.00, 'Disponível'),
('202', 'Luxo', 3, 350.00, 'Ocupado'),
('303', 'Presidencial', 4, 800.00, 'Disponível');

INSERT INTO funcionarios (nome, cargo, salario) VALUES
('Rey Skywalker', 'Recepcionista', 2500.00),
('Obi-Wan Kenobi', 'Gerente', 6000.00);

INSERT INTO servicos (nome, descricao, preco) VALUES
('Frigobar', 'Consumo de itens do frigobar', 25.00),
('Spa Estelar', 'Massagem e relaxamento', 150.00),
('Lavanderia', 'Lavagem de roupas', 40.00);

-- Reservas (Passadas, Atuais e Canceladas)
INSERT INTO reservas (id_hospede, id_quarto, data_checkin, data_checkout, status) VALUES
(1, 101, '2026-05-01', '2026-05-05', 'Concluída'),
(2, 202, '2026-06-08', '2026-06-15', 'Confirmada'),
(3, 303, '2026-07-01', '2026-07-05', 'Pendente'),
(1, 101, '2026-06-01', '2026-06-03', 'Cancelada');

-- Hospedagens vigentes e finalizadas
INSERT INTO hospedagens (id_reserva, id_funcionario_checkin, checkin_real, checkout_real) VALUES
(1, 1, '2026-05-01 14:00:00', '2026-05-05 11:00:00'),
(2, 1, '2026-06-08 13:30:00', NULL); -- Hospedagem ativa

-- Consumo de serviços
INSERT INTO hospedagens_servicos (id_hospedagem, id_servico, quantidade) VALUES
(1, 1, 2), -- 2 Frigobares na hospedagem 1
(1, 2, 1), -- 1 Spa na hospedagem 1
(2, 1, 4); -- 4 Frigobares na hospedagem 2 (em andamento)

-- Pagamentos efetuados
INSERT INTO pagamentos (id_hospedagem, valor, metodo) VALUES
(1, 600.00, 'Pix'),     -- Diárias do quarto 101 (4 x 150)
(1, 200.00, 'Crédito');  -- Serviços (2x25 + 150)

-- Feedbacks
INSERT INTO feedbacks (id_hospedagem, nota, comentario) VALUES
(1, 5, 'Experiência fantástica! O quarto 101 estava impecável e o Spa é maravilhoso.');