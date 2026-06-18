-- Criação do Banco de Dados
CREATE DATABASE IF NOT EXISTS hotel_nebula;
USE hotel_nebula;

-- 1. Tabela Hóspedes
CREATE TABLE hospedes (
    id_hospede INT AUTO_INCREMENT,
    nome VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    cpf VARCHAR(14) NOT NULL UNIQUE,
    telefone VARCHAR(20),
    data_nascimento DATE,
    data_cadastro TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT pk_hospedes PRIMARY KEY (id_hospede)
);

-- 2. Tabela Quartos
CREATE TABLE quartos (
    id_quarto INT AUTO_INCREMENT,
    numero VARCHAR(10) NOT NULL UNIQUE,
    tipo VARCHAR(50) NOT NULL,
    capacidade INT NOT NULL,
    preco_diaria DECIMAL(10,2) NOT NULL,
    status VARCHAR(20) DEFAULT 'Disponível',
    CONSTRAINT pk_quartos PRIMARY KEY (id_quarto),
    CONSTRAINT chk_status_quarto CHECK (status IN ('Disponível', 'Ocupado', 'Manutenção')),
    CONSTRAINT chk_preco CHECK (preco_diaria > 0)
);

-- 3. Tabela Funcionários
CREATE TABLE funcionarios (
    id_funcionario INT AUTO_INCREMENT,
    nome VARCHAR(100) NOT NULL,
    cargo VARCHAR(50) NOT NULL,
    salario DECIMAL(10,2),
    CONSTRAINT pk_funcionarios PRIMARY KEY (id_funcionario)
);

-- 4. Tabela Serviços
CREATE TABLE servicos (
    id_servico INT AUTO_INCREMENT,
    nome VARCHAR(50) NOT NULL,
    descricao VARCHAR(255),
    preco DECIMAL(10,2) NOT NULL,
    CONSTRAINT pk_servicos PRIMARY KEY (id_servico)
);

-- 5. Tabela Reservas
CREATE TABLE reservas (
    id_reserva INT AUTO_INCREMENT,
    id_hospede INT NOT NULL,
    id_quarto INT NOT NULL,
    data_checkin DATE NOT NULL,
    data_checkout DATE NOT NULL,
    status VARCHAR(20) DEFAULT 'Pendente',
    data_criacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT pk_reservas PRIMARY KEY (id_reserva),
    CONSTRAINT fk_reservas_hospedes FOREIGN KEY (id_hospede) REFERENCES hospedes(id_hospede),
    CONSTRAINT fk_reservas_quartos FOREIGN KEY (id_quarto) REFERENCES quartos(id_quarto),
    CONSTRAINT chk_status_reserva CHECK (status IN ('Pendente', 'Confirmada', 'Cancelada', 'Concluída')),
    CONSTRAINT chk_datas CHECK (data_checkout > data_checkin)
);

-- 6. Tabela Hospedagens
CREATE TABLE hospedagens (
    id_hospedagem INT AUTO_INCREMENT,
    id_reserva INT NOT NULL UNIQUE, -- 1:1 com reserva
    id_funcionario_checkin INT NOT NULL,
    checkin_real DATETIME NOT NULL,
    checkout_real DATETIME,
    CONSTRAINT pk_hospedagens PRIMARY KEY (id_hospedagem),
    CONSTRAINT fk_hospedagens_reservas FOREIGN KEY (id_reserva) REFERENCES reservas(id_reserva),
    CONSTRAINT fk_hospedagens_funcionarios FOREIGN KEY (id_funcionario_checkin) REFERENCES funcionarios(id_funcionario)
);

-- 7. Tabela de Associação: Hospedagens e Serviços (N:M)
CREATE TABLE hospedagens_servicos (
    id_hospedagem_servico INT AUTO_INCREMENT,
    id_hospedagem INT NOT NULL,
    id_servico INT NOT NULL,
    quantidade INT DEFAULT 1,
    data_consumo DATETIME DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT pk_hospedagens_servicos PRIMARY KEY (id_hospedagem_servico),
    CONSTRAINT fk_hs_hospedagens FOREIGN KEY (id_hospedagem) REFERENCES hospedagens(id_hospedagem) ON DELETE CASCADE,
    CONSTRAINT fk_hs_servicos FOREIGN KEY (id_servico) REFERENCES servicos(id_servico),
    CONSTRAINT chk_qtd CHECK (quantidade > 0)
);

-- 8. Tabela Pagamentos
CREATE TABLE pagamentos (
    id_pagamento INT AUTO_INCREMENT,
    id_hospedagem INT NOT NULL,
    valor DECIMAL(10,2) NOT NULL,
    metodo VARCHAR(30) NOT NULL,
    data_pagamento TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT pk_pagamentos PRIMARY KEY (id_pagamento),
    CONSTRAINT fk_pagamentos_hospedagens FOREIGN KEY (id_hospedagem) REFERENCES hospedagens(id_hospedagem),
    CONSTRAINT chk_metodo CHECK (metodo IN ('Crédito', 'Débito', 'Pix', 'Dinheiro'))
);

-- 9. Tabela Feedbacks
CREATE TABLE feedbacks (
    id_feedback INT AUTO_INCREMENT,
    id_hospedagem INT NOT NULL UNIQUE, -- Garante uma avaliação por hospedagem
    nota INT NOT NULL,
    comentario TEXT,
    data_feedback TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT pk_feedbacks PRIMARY KEY (id_feedback),
    CONSTRAINT fk_feedbacks_hospedagens FOREIGN KEY (id_hospedagem) REFERENCES hospedagens(id_hospedagem),
    CONSTRAINT chk_nota CHECK (nota BETWEEN 1 AND 5)
);