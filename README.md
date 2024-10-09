# EducaHub API

API desenvolvida para o projeto EducaHub, que tem como objetivo fornecer funcionalidades para autenticação de usuários, verificação de e-mail, recuperação de senha e outras operações relacionadas ao gerenciamento de usuários.

## Índice

- [EducaHub API](#educahub-api)
  - [Índice](#índice)
  - [Tecnologias Utilizadas](#tecnologias-utilizadas)
  - [Instalação](#instalação)
  - [Configuração](#configuração)
  - [Uso](#uso)
  - [Endpoints Principais](#endpoints-principais)
  - [Contribuição](#contribuição)
  - [Licença](#licença)

## Tecnologias Utilizadas

- Node.js
- Express.js
- MongoDB
- JWT (JSON Web Tokens)
- Swagger (Documentação da API)

## Instalação

1. Clone o repositório:
   ```bash
   git clone https://github.com/seu-usuario/seu-repositorio.git
   ```
2. Navegue até o diretório do projeto:
   ```bash
   cd seu-repositorio
   ```
3. Instale as dependências:
   ```bash
   npm install
   ```

## Configuração

1. Crie um arquivo `.env` na raiz do projeto e adicione as variáveis de ambiente necessárias:

   ```
   PORT=3000
   MONGODB_URI=sua_uri_do_mongodb
   JWT_SECRET=sua_chave_secreta_para_jwt
   ```

2. Certifique-se de configurar corretamente as variáveis de ambiente para os ambientes de desenvolvimento e produção.

## Uso

1. Inicie o servidor de desenvolvimento:
   ```bash
   npm start
   ```
2. Acesse a API localmente em: `http://localhost:3000`

## Endpoints Principais

Aqui estão alguns dos endpoints mais importantes da API:

- **Autenticação**

  - `POST /auth/signup`: Criação de conta de usuário
  - `POST /auth/login`: Login de usuário
  - `POST /auth/logout`: Logout do usuário
  - `GET /auth/check-auth`: Verifica o status de autenticação do usuário

- **Verificação de E-mail**

  - `POST /verify/email`: Verifica o endereço de e-mail do usuário

- **Recuperação de Senha**
  - `POST /recovery/password`: Solicita recuperação de senha
  - `POST /recovery/password/:verificationCode`: Redefine a senha do usuário

Para mais detalhes sobre todos os endpoints, consulte a [documentação Swagger](http://api.yanlima.com).

## Contribuição

Contribuições são bem-vindas! Siga os passos abaixo para contribuir com o projeto:

1. Faça um fork do repositório.
2. Crie uma nova branch com a sua feature ou correção (`git checkout -b minha-nova-feature`).
3. Commit suas mudanças (`git commit -m 'Adiciona nova feature'`).
4. Envie para a branch principal (`git push origin minha-nova-feature`).
5. Abra um Pull Request.

## Licença

Este projeto está licenciado sob a licença MIT - consulte o arquivo [LICENSE](LICENSE) para mais detalhes.
