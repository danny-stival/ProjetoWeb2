# ProjetoWeb2
Projeto Final disciplina Programação Web 2, professor Braully Rocha.

# Diário de Histórias

Uma aplicação web full stack para gerenciamento de coleções pessoais de livros, mangás, séries, filmes e jogos. O projeto foi desenvolvido para a disciplina de Programação Web II do curso de Sistemas de Informação, com o objetivo de aplicar conceitos de desenvolvimento web, arquitetura em camadas, persistência de dados e segurança.

## Objetivo

Proporcionar ao usuário um ambiente personalizado para organizar suas histórias favoritas, acompanhar seu progresso e visualizar estatísticas sobre sua coleção.

## Funcionalidades

### Autenticação e segurança

- Cadastro de usuários.
- Login e logout.
- Autenticação utilizando JWT.
- Proteção de senhas com BCrypt.
- Revogação de tokens após alteração de credenciais.
- Controle de acesso aos dados individuais.

### Biblioteca pessoal

- Cadastro, consulta, edição e exclusão de obras.
- Pesquisa por título e criador.
- Filtros por categoria e status.
- Ordenação das obras.
- Registro de progresso.
- Registro de datas de início e conclusão.
- Personalização de capas.

### Perfil do usuário

- Edição de informações pessoais.
- Alteração de nome de usuário e senha.
- Upload e remoção de fotografia.
- Estatísticas individuais da coleção.
- Gráficos de acompanhamento.
- Exclusão definitiva da conta.

## Tecnologias utilizadas

### Backend

- Java 21
- Spring Boot
- Spring Web
- Spring Security
- Spring Data JPA
- Hibernate
- Jakarta Validation
- JWT
- Lombok
- Maven

### Frontend

- React
- TypeScript
- Vite
- Axios
- HTML5
- CSS3

### Banco de dados

- PostgreSQL

### Ferramentas de desenvolvimento

- IntelliJ IDEA
- Insomnia
- GitHub

## Arquitetura

O backend utiliza uma arquitetura em camadas, permitindo a separação de responsabilidades e facilitando a manutenção do sistema.

- **Controller:** recebe requisições HTTP e disponibiliza os endpoints da API REST.
- **Service:** concentra as regras de negócio e validações.
- **Repository:** realiza a comunicação com o banco de dados.
- **Model:** representa as entidades do sistema.
- **DTO:** controla a transferência de dados entre as camadas e o cliente.
- **Security:** gerencia autenticação, autorização e validação de tokens.
- **Config:** concentra as configurações da aplicação.
- **Exception:** centraliza o tratamento de exceções.

## Como executar o projeto

### Pré-requisitos

- Java JDK 21
- Node.js e npm
- PostgreSQL
- Git

### Banco de dados

Crie um banco de dados PostgreSQL chamado `projeto_web2`.

Configure as credenciais de conexão e a chave secreta JWT nas configurações locais do backend.

### Backend

Na pasta que contém o arquivo `pom.xml`, execute:

```bash
./mvnw spring-boot:run
```

A API estará disponível em:

`http://localhost:8080/api`

### Frontend

Acesse a pasta `frontend` e execute:

```bash
npm install
npm run dev
```

A aplicação estará disponível, por padrão, em:

`http://localhost:5173`

## Identidade visual

A interface foi desenvolvida com inspiração na estética retrô editorial, utilizando tons de creme, mostarda, verde, laranja e marrom. A proposta visual busca transmitir a sensação de uma coleção pessoal, aproximando o sistema da experiência de organizar um diário ou uma biblioteca física.

