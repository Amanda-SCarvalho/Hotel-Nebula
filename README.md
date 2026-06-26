# Hotel Nebula

Sistema de gestão hoteleira desenvolvido como projeto acadêmico, contemplando modelagem de banco de dados relacional, implementação física em MySQL e uma API REST em Node.js com frontend simples para visualização.

---

## Sobre o Projeto

O Hotel Nebula está expandindo suas operações e precisava organizar digitalmente seus dados para melhorar reservas, hospedagens, serviços, avaliações de clientes e gestão de quartos. O projeto percorre as etapas de:

- Compreensão do problema e levantamento de regras de negócio
- Modelagem conceitual e lógica dos dados
- Implementação física do banco de dados
- Extração e organização de dados via consultas SQL
- Desenvolvimento de API REST para consumo dos dados

---

## Estrutura do Repositório

```
Hotel-Nebula/
├── backend/
│   ├── src/
│   │   ├── server.js               # Ponto de entrada da API
│   │   └── routes/
│   │       ├── quartoRoutes.js     # Rotas de quartos
│   │       ├── reservaRoutes.js    # Rotas de reservas
│   │       ├── clienteRoutes.js    # Rotas de clientes/hóspedes
│   │       └── dashboardRoutes.js  # Rotas de métricas/dashboard
│   ├── .env                        # Variáveis de ambiente
│   └── package.json
├── database/
│   ├── ddl_criacao.sql             # Script de criação do banco
│   ├── dml_insercao.sql            # Script de inserção de dados
│   └── modelagem/
│       ├── README.md               # Documentação do modelo
│       └── modelo_logico.png       # Diagrama do modelo lógico
├── frontend/
│   ├── index.html                  # Página principal
│   ├── nova-reserva.html           # Formulário de reservas
│   └── app.js                      # Lógica do frontend
├── queries/
│   └── radar_comando.sql           # Consultas analíticas
├── modelo-logico.md                # Modelo lógico relacional documentado
└── Instrucoes.md                   # Instruções do projeto
```

---

## Banco de Dados

### Entidades Principais

| Tabela | Descrição |
|---|---|
| `hospedes` | Cadastro de hóspedes com dados pessoais |
| `quartos` | Quartos disponíveis com tipo, capacidade e preço |
| `reservas` | Reservas feitas por hóspedes para quartos |
| `hospedagens` | Check-in efetivo gerado a partir de uma reserva |
| `pagamentos` | Pagamentos vinculados a hospedagens |
| `funcionarios` | Funcionários responsáveis pelos atendimentos |
| `servicos` | Serviços extras disponíveis no hotel |
| `hospedagens_servicos` | Consumo de serviços durante hospedagens (N:M) |
| `feedbacks` | Avaliações dos hóspedes por hospedagem |

### Relacionamentos

```
hospedes          ||--o{ reservas             : "faz"
quartos           ||--o{ reservas             : "recebe"
reservas          ||--|| hospedagens          : "gera (Check-in)"
funcionarios      ||--o{ hospedagens          : "realiza atendimento de"
hospedagens       ||--o{ pagamentos           : "gera faturamento"
hospedagens       ||--o| feedbacks            : "recebe avaliação"
hospedagens       ||--o{ hospedagens_servicos : "registra consumo"
servicos          ||--o{ hospedagens_servicos : "é incluído em"
```

### Status dos Quartos
`Disponível` | `Ocupado` | `Manutenção`

### Status das Reservas
`Pendente` | `Confirmada` | `Cancelada` | `Concluída`

### Métodos de Pagamento
`Crédito` | `Débito` | `Pix` | `Dinheiro`

---

## Como Executar

### Pré-requisitos

- [Node.js](https://nodejs.org/) v18+
- [MySQL](https://www.mysql.com/) 8.0+

### 1. Configurar o Banco de Dados

```sql
-- No MySQL, execute na ordem:
source database/ddl_criacao.sql
source database/dml_insercao.sql
```

### 2. Configurar Variáveis de Ambiente

Edite o arquivo `backend/.env` com as credenciais do seu banco:

```env
PORT=3000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=sua_senha
DB_NAME=hotel_nebula
```

### 3. Instalar Dependências e Iniciar a API

```bash
cd backend
npm install
npm run dev     # desenvolvimento (nodemon)
# ou
npm start       # produção
```

A API estará disponível em `http://localhost:3000`.

### 4. Abrir o Frontend

Abra o arquivo `frontend/index.html` diretamente no navegador.

---

## 🛣️Rotas da API

| Método | Rota | Descrição |
|---|---|---|
| `GET` | `/` | Health check da API |
| `GET` | `/api/quartos` | Listar quartos |
| `POST` | `/api/quartos` | Cadastrar quarto |
| `GET` | `/api/reservas` | Listar reservas |
| `POST` | `/api/reservas` | Criar nova reserva |
| `GET` | `/api/clientes` | Listar hóspedes |
| `POST` | `/api/clientes` | Cadastrar hóspede |
| `GET` | `/api/dashboard` | Métricas e indicadores |

---

## Consultas Analíticas (Radar de Comando)

O arquivo `queries/radar_comando.sql` contém consultas para responder perguntas gerenciais como:

- Quais quartos estão disponíveis em determinado período?
- Quais hóspedes mais realizaram reservas?
- Qual foi o faturamento por mês?
- Quais serviços extras são mais consumidos?
- Quais quartos receberam melhores avaliações?
- Quais reservas foram canceladas?
- Quantas hospedagens cada funcionário atendeu?

---

## Tecnologias Utilizadas

| Camada | Tecnologia |
|---|---|
| Banco de Dados | MySQL 8.0 |
| Backend | Node.js + Express |
| Frontend | HTML, CSS, JavaScript |
| Dev Tool | Nodemon |

---

## Licença

Este projeto está sob a licença MIT. Consulte o arquivo [LICENSE](LICENSE) para mais detalhes.
