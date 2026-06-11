# Gestão Financeira

Aplicativo mobile de gestão financeira feito com Expo, React Native e Expo Router. O app permite registrar receitas e despesas, criar categorias, filtrar por mês/ano e visualizar um resumo com gráfico de pizza. Os dados são salvos em uma API própria com Node.js, Express, Prisma e MySQL.

Este guia foi escrito para uma pessoa sem experiência prévia conseguir rodar o projeto do zero.

## O Que O Projeto Tem

- Tela de login com validação pela API.
- Mensagem de boas-vindas com o nome do usuário autenticado.
- Cadastro de receitas e despesas.
- Listagem de transações.
- Edição e exclusão de transações por toque longo.
- Filtro de mês/ano nas telas de lista e resumo.
- Categorias padrão e categorias customizadas.
- Escolha de ícone e cor para categorias.
- Resumo financeiro com entradas, saídas, saldo e gráfico de pizza.
- Backend com rotas de login, categorias e transações.
- Banco de dados MySQL usando Prisma.
- Collection do Postman para testar a API.

## Estrutura Das Pastas

O projeto tem duas partes principais:

```text
praticas/
  gestao-financeira/       aplicativo mobile Expo/React Native
  gestao-financeira-api/   backend Node.js/Express/Prisma/MySQL
```

Você precisa rodar as duas partes ao mesmo tempo:

- A API fica ligada em `http://localhost:3000`.
- O aplicativo mobile abre pelo Expo.

## Programas Necessários

Antes de começar, instale:

- Node.js LTS.
- npm, que normalmente já vem junto com o Node.js.
- MySQL Server.
- MySQL Workbench ou outro cliente MySQL.
- Expo Go no celular, ou Android Studio com emulador Android.
- Postman, opcional, para testar a API.

Para conferir se o Node e o npm estão instalados, rode:

```bash
node -v
npm -v
```

Se aparecer uma versão em cada comando, está certo.

## 1. Preparar O Banco MySQL

Abra o MySQL Workbench e conecte no servidor local.

Crie o banco de dados:

```sql
CREATE DATABASE gestao_financeira;
```

Se quiser usar um usuário próprio para o projeto, rode também:

```sql
CREATE USER IF NOT EXISTS 'gestao_user'@'localhost' IDENTIFIED BY 'gestao123';
CREATE USER IF NOT EXISTS 'gestao_user'@'127.0.0.1' IDENTIFIED BY 'gestao123';
GRANT ALL PRIVILEGES ON gestao_financeira.* TO 'gestao_user'@'localhost';
GRANT ALL PRIVILEGES ON gestao_financeira.* TO 'gestao_user'@'127.0.0.1';
FLUSH PRIVILEGES;
```

Com isso, a conexão do projeto ficará assim:

```text
mysql://gestao_user:gestao123@127.0.0.1:3306/gestao_financeira
```

Se você preferir usar outro usuário ou outra senha, tudo bem. Só lembre de colocar os mesmos dados no arquivo `.env` da API.

## 2. Configurar E Rodar A API

Abra um terminal na raiz do repositório e entre na pasta da API:

```bash
cd praticas/gestao-financeira-api
```

Instale as dependências:

```bash
npm install
```

Crie o arquivo `.env` copiando o modelo:

```bash
cp .env.example .env
```

Abra o arquivo `.env` e configure a conexão com o banco. Um exemplo válido é:

```env
DATABASE_URL="mysql://gestao_user:gestao123@127.0.0.1:3306/gestao_financeira"
PORT=3000
JWT_SECRET="gestao-financeira-dev-secret"
```

Depois aplique as tabelas no banco:

```bash
npm run prisma:migrate
```

Agora rode o seed para criar as categorias padrão e o usuário de teste:

```bash
npm run prisma:seed
```

Inicie a API:

```bash
npm run dev
```

Se tudo estiver certo, deve aparecer uma mensagem parecida com:

```text
API rodando em http://localhost:3000
```

Abra no navegador:

```text
http://localhost:3000
```

A resposta esperada é:

```json
{
  "ok": true,
  "name": "gestao-financeira-api"
}
```

Deixe esse terminal aberto. A API precisa continuar rodando enquanto você usa o aplicativo.

## 3. Testar A API No Postman

Esta etapa é opcional, mas ajuda muito a confirmar que o backend está funcionando antes de abrir o app.

No Postman:

1. Clique em Import.
2. Importe o arquivo:

```text
praticas/gestao-financeira-api/postman/collection.json
```

3. Confira se a variável `baseUrl` está como:

```text
http://localhost:3000
```

4. Execute as requisições em ordem.

A requisição de login salva o token automaticamente. As rotas de categorias e transações usam esse token como Bearer Token.

Usuário de teste criado pelo seed:

```text
E-mail: aluno@iesb.com
Senha: 123456
```

## 4. Configurar E Rodar O Aplicativo

Abra outro terminal. Não feche o terminal da API.

Volte para a raiz do repositório e entre na pasta do app:

```bash
cd praticas/gestao-financeira
```

Instale as dependências:

```bash
npm install
```

Crie o arquivo `.env` copiando o modelo:

```bash
cp .env.example .env
```

### Usando Emulador Android

Se você estiver usando emulador Android, pode deixar o `.env` assim:

```env
EXPO_PUBLIC_API_URL=
```

O app usa automaticamente `http://10.0.2.2:3000` no emulador Android.

Agora inicie o Expo:

```bash
npm start
```

Depois, no terminal do Expo, pressione:

```text
a
```

Isso abre o app no emulador Android.

Também dá para iniciar direto com:

```bash
npm run android
```

### Usando Celular Físico

Se você estiver usando o Expo Go no celular, o celular e o computador precisam estar na mesma rede Wi-Fi.

Descubra o IP do computador.

No Linux:

```bash
hostname -I
```

No Windows, use:

```bash
ipconfig
```

Depois edite o `.env` do app:

```env
EXPO_PUBLIC_API_URL=http://SEU_IP_AQUI:3000
```

Exemplo:

```env
EXPO_PUBLIC_API_URL=http://192.168.0.10:3000
```

Reinicie o Expo depois de alterar o `.env`:

```bash
npm start
```

Escaneie o QR Code com o Expo Go.

## 5. Entrar No Aplicativo

Use as credenciais criadas pelo seed:

```text
E-mail: aluno@iesb.com
Senha: 123456
```

Depois do login, você pode:

- criar transações;
- criar categorias;
- editar ou excluir transações com toque longo;
- trocar mês/ano no filtro;
- ver o gráfico na aba Resumo.

## Comandos Úteis

Na pasta da API:

```bash
npm run dev
npm run prisma:migrate
npm run prisma:seed
npm run prisma:studio
```

Na pasta do app:

```bash
npm start
npm run android
npm run web
npm run lint
```

## Como Saber Se Está Salvando No Banco

Você pode conferir de três formas:

1. Pelo app: crie uma transação, feche e abra o app novamente.
2. Pelo Postman: rode `GET /transactions`.
3. Pelo Prisma Studio:

```bash
cd praticas/gestao-financeira-api
npm run prisma:studio
```

O Prisma Studio abre uma tela no navegador para visualizar as tabelas.

## Problemas Comuns

### Access denied for user no MySQL

O usuário ou senha do `.env` não bate com o MySQL.

Confira esta parte:

```env
DATABASE_URL="mysql://USUARIO:SENHA@127.0.0.1:3306/gestao_financeira"
```

Se você criou o usuário sugerido neste README, use:

```env
DATABASE_URL="mysql://gestao_user:gestao123@127.0.0.1:3306/gestao_financeira"
```

### O app fica carregando

Normalmente isso acontece quando o app não consegue acessar a API.

Confira:

- A API está rodando?
- `http://localhost:3000` abre no navegador?
- No emulador Android, o app deve usar `http://10.0.2.2:3000`.
- No celular físico, `EXPO_PUBLIC_API_URL` deve usar o IP do computador.
- Depois de mudar o `.env`, reinicie o Expo.

### Porta 3000 já está em uso

Algum outro programa já está usando a porta da API.

Você pode parar o outro programa ou alterar o `PORT` no `.env` da API. Se mudar a porta da API, também ajuste `EXPO_PUBLIC_API_URL` no app.

### Categoria health já existe ao testar no Postman

Se a criação da categoria retornar `409 Registro duplicado`, é porque a categoria já ficou salva de um teste anterior.

Você pode apagar pelo app, pelo Postman ou pelo Prisma Studio.

### Alterei o `.env`, mas nada mudou no app

Pare o Expo com `Ctrl+C` e inicie novamente:

```bash
npm start
```

## Checklist Para Rodar Do Zero

Use esta lista rápida quando for apresentar ou testar o projeto:

- MySQL Server ligado.
- Banco `gestao_financeira` criado.
- `.env` da API configurado.
- `npm install` rodado na API.
- `npm run prisma:migrate` rodado na API.
- `npm run prisma:seed` rodado na API.
- API rodando com `npm run dev`.
- Health-check abrindo em `http://localhost:3000`.
- `.env` do app configurado.
- `npm install` rodado no app.
- App iniciado com `npm start`.
- Login feito com `aluno@iesb.com` e `123456`.

## Tecnologias Usadas

- Expo.
- React Native.
- Expo Router.
- AsyncStorage para guardar o token localmente.
- Node.js.
- Express.
- Prisma.
- MySQL.
- Zod.
- JWT.
- Postman.
