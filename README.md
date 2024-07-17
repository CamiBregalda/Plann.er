# Plann.er
Repositório destinado ao projeto de planejamento de viagens iniciado durante o evento NLW Journey  da Rocketseat e melhorado posteriormente para estudo das tecnologias

## Descrição

Plann.er é uma aplicação para organizar viagens, permitindo marcar o local e período da viagem, convidar amigos, cadastrar atividades e gerenciar links importantes relacionados à viagem.

## Requisitos

- Node 18

## Como Executar

1. Clone este repositório para o seu ambiente local.
2. Abra o terminal no diretório do projeto, a pasta `/Plann.er`.
3. Instale as dependências do projeto através do comando `npm install`.
4. Execute o comando  `npm run dev` para iniciar o projeto.
    - A aplicação frontend será executada na porta `5173`.
    - A aplicação backend será executada na porta `8080`.
5. Para visualizar e gerenciar as modificações do banco de dados, navegue até a pasta `/backend` e execute o comando `npx prisma studio`.
    - Acesse o Prisma Studio através da porta `5555` no localhost.
6. Para limpar os dados existentes no banco de dados, navegue a pasta `/backend` e execute o comando `npm run clear-db`.

## Estrutura do Projeto

- `/frontend`: Contém a aplicação frontend.
- `/backend`: Contém a aplicação backend.

## Tecnologias Utilizadas
### Backend
- **Node.js:** Runtime JS que permite executar código JavaScript no servidor.
- **Fastify:** Um framework web rápido e de baixo overhead para Node.js.
- **Prisma:** ORM que facilita a interação com o banco de dados.
- **SQLite:** Um banco de dados embutido que armazena os dados em um arquivo no projeto.
- **Nodemailer:** Um módulo para envio de e-mails gratuito através de Node.js.
- **Zod:** Biblioteca de validação de dados.
- **DayJs:** Biblioteca para manipulação de datas.

<hr>

### Frontend
- **React:** Biblioteca JavaScript para construir interfaces de usuário.
- **React Router Dom:** Um conjunto de ferramentas de navegação para React.
- **Vite:** Módulo que otimiza o desenvolvimento e a construção de aplicações web.
- **Axios:** Biblioteca para fazer requisições HTTP.
- **Tailwind Css:** Framework de CSS para estilização simplificada.
- **Lucide-react:** Biblioteca de ícones SVG para React.

## Funcionalidades

1. Marcar o local e período de uma viagem
2. Convidar amigos para irem a viagem através do e-mail
3. Receber a confirmação dos participantes da viagem através do e-mail
4. Cadastrar e remover atividades a serem realizadas durante a viagem
5. Adicionar links importantes para a viagem
