# Hotel Nebula — Modelo Lógico Relacional (Completo)

Este documento apresenta a estrutura de dados mapeada e normalizada para o sistema de gestão do Hotel Nebula, resolvendo o cenário de dados dispersos.

## Tabelas

### hospedes

| Coluna | Tipo | Restrições |
| --- | --- | --- |
| id_hospede | INT | PK, AUTO_INCREMENT |
| nome | VARCHAR(100) | NOT NULL |
| email | VARCHAR(100) | UNIQUE, NOT NULL |
| cpf | VARCHAR(14) | UNIQUE, NOT NULL |
| telefone | VARCHAR(20) |  |
| data_nascimento | DATE |  |
| data_cadastro | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP |

---

### quartos

| Coluna | Tipo | Restrições |
| --- | --- | --- |
| id_quarto | INT | PK, AUTO_INCREMENT |
| numero | VARCHAR(10) | UNIQUE, NOT NULL |
| tipo | VARCHAR(50) | NOT NULL |
| capacidade | INT | NOT NULL |
| preco_diaria | DECIMAL(10,2) | NOT NULL |
| status | VARCHAR(20) | DEFAULT 'Disponível' *(CHECK: Disponível, Ocupado, Manutenção)* |

---

### reservas

| Coluna | Tipo | Restrições |
| --- | --- | --- |
| id_reserva | INT | PK, AUTO_INCREMENT |
| id_hospede | INT | FK → hospedes(id_hospede), NOT NULL |
| id_quarto | INT | FK → quartos(id_quarto), NOT NULL |
| data_checkin | DATE | NOT NULL |
| data_checkout | DATE | NOT NULL *(CHECK: data_checkout > data_checkin)* |
| status | VARCHAR(20) | DEFAULT 'Pendente' *(CHECK: Pendente, Confirmada, Cancelada, Concluída)* |
| data_criacao | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP |

---

### hospedagens

| Coluna | Tipo | Restrições |
| --- | --- | --- |
| id_hospedagem | INT | PK, AUTO_INCREMENT |
| id_reserva | INT | UNIQUE, FK → reservas(id_reserva), NOT NULL |
| id_funcionario_checkin | INT | FK → funcionarios(id_funcionario), NOT NULL |
| checkin_real | DATETIME | NOT NULL |
| checkout_real | DATETIME | NULLABLE |

---

### pagamentos

| Coluna | Tipo | Restrições |
| --- | --- | --- |
| id_pagamento | INT | PK, AUTO_INCREMENT |
| id_hospedagem | INT | FK → hospedagens(id_hospedagem), NOT NULL |
| valor | DECIMAL(10,2) | NOT NULL *(CHECK: valor > 0)* |
| metodo | VARCHAR(30) | NOT NULL *(CHECK: Crédito, Débito, Pix, Dinheiro)* |
| data_pagamento | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP |

---

### funcionarios

| Coluna | Tipo | Restrições |
| --- | --- | --- |
| id_funcionario | INT | PK, AUTO_INCREMENT |
| nome | VARCHAR(100) | NOT NULL |
| cargo | VARCHAR(50) | NOT NULL |
| salario | DECIMAL(10,2) |  |

---

### servicos

| Coluna | Tipo | Restrições |
| --- | --- | --- |
| id_servico | INT | PK, AUTO_INCREMENT |
| nome | VARCHAR(50) | NOT NULL |
| descricao | VARCHAR(255) |  |
| preco | DECIMAL(10,2) | NOT NULL |

---

### hospedagens_servicos *(Tabela Associativa N:M)*

| Coluna | Tipo | Restrições |
| --- | --- | --- |
| id_hospedagem_servico | INT | PK, AUTO_INCREMENT |
| id_hospedagem | INT | FK → hospedagens(id_hospedagem) ON DELETE CASCADE, NOT NULL |
| id_servico | INT | FK → servicos(id_servico), NOT NULL |
| quantidade | INT | DEFAULT 1 *(CHECK: quantidade > 0)* |
| data_consumo | DATETIME | DEFAULT CURRENT_TIMESTAMP |

---

### feedbacks

| Coluna | Tipo | Restrições |
| --- | --- | --- |
| id_feedback | INT | PK, AUTO_INCREMENT |
| id_hospedagem | INT | UNIQUE, FK → hospedagens(id_hospedagem), NOT NULL |
| nota | INT | NOT NULL *(CHECK: nota BETWEEN 1 AND 5)* |
| comentario | TEXT |  |
| data_feedback | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP |

---

## Mapeamento Completo de Relacionamentos

```text
hospedes               ||--o{ reservas            : "faz"
quartos                ||--o{ reservas            : "recebe"
reservas               ||--|| hospedagens         : "gera (Check-in)"
funcionarios           ||--o{ hospedagens         : "realiza atendimento de"
hospedagens            ||--o{ pagamentos          : "gera faturamento"
hospedagens            ||--o| feedbacks           : "recebe avaliação da estadia"

-- Resolução do relacionamento Muitos para Muitos (N:M):
hospedagens            ||--o{ hospedagens_servicos : "registra consumo"
servicos               ||--o{ hospedagens_servicos : "é incluído em"

```

---

## 📐 Visualização Gráfica do Modelo Lógico

Para compreender visualmente as conexões de chaves estrangeiras e a cardinalidade do sistema do hotel, analise o diagrama abaixo: