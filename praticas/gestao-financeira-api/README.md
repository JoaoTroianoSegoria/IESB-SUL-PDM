# Gestao Financeira

Aplicativo de gestao financeira feito com Expo/React Native, integrado a uma API REST em Express com Prisma e MySQL.

Este repositorio esta organizado assim:

```text
gestao-financeira-api/
├── app/                  # Telas do app Expo
├── components/           # Componentes visuais do app
├── contexts/             # Estado global que consome a API
├── services/api.js       # Cliente HTTP do app
├── api/                  # Backend Express + Prisma + MySQL
└── README.md             # Este manual
```

Observacao: no tutorial do professor, a pasta `gestao-financeira-api` era apenas a API. Neste projeto, a pasta com esse nome contem o app completo e a API ficou dentro de `api/`.

## O que o projeto entrega

- App mobile com Expo Router.
- Cadastro, listagem e exclusao de transacoes.
- Cadastro e exclusao de categorias personalizadas.
- Categorias carregadas do banco, sem lista fixa no front.
- Resumo financeiro por categoria e saldo geral.
- Grafico simples de transacoes por categoria.
- API REST com rotas `/categories` e `/transactions`.
- Banco MySQL acessado via Prisma.
- Seed com categorias iniciais: Renda, Alimentacao, Casa, Educacao e Viagens.

## Pre-requisitos

Instale antes de rodar:

- Node.js LTS.
- MySQL Server rodando localmente.
- MySQL Workbench ou DBeaver para criar/inspecionar o banco.
- Expo Go no celular ou um emulador Android.
- Postman ou Insomnia, opcional, para testar os endpoints.

## 1. Criar o banco MySQL

Abra o MySQL Workbench, conecte no MySQL local e execute:

```sql
CREATE DATABASE gestao_financeira
CHARACTER SET utf8mb4
COLLATE utf8mb4_unicode_ci;
```

Guarde o usuario e a senha do MySQL. Eles serao usados no arquivo `.env` da API.

Exemplos de `DATABASE_URL`:

```env
DATABASE_URL="mysql://root:Senha10adaps@localhost:3306/gestao_financeira"
DATABASE_URL="mysql://root:iesb@localhost:3306/gestao_financeira"
```

Use apenas uma delas, de acordo com a senha configurada na sua maquina.

## 2. Instalar e configurar a API

Entre na pasta da API:

```bash
cd gestao-financeira-api/api
npm install
```

Copie o arquivo de exemplo:

```bash
copy .env.example .env
```

No macOS/Linux, o comando equivalente e:

```bash
cp .env.example .env
```

Edite o `.env`:

```env
DATABASE_URL="mysql://USUARIO:SENHA@localhost:3306/gestao_financeira"
PORT=3000
```

Depois gere o Prisma Client, rode a migration e execute o seed:

```bash
npx prisma generate
npx prisma migrate dev
npm run prisma:seed
```

Suba o servidor:

```bash
npm run dev
```

A API deve responder em:

```text
http://localhost:3000/
```

Resposta esperada:

```json
{ "ok": true, "name": "gestao-financeira-api" }
```

## 3. Instalar e configurar o app

Abra outro terminal na pasta raiz do projeto:

```bash
cd gestao-financeira-api
npm install
```

Copie o arquivo de ambiente do app:

```bash
copy .env.example .env
```

No macOS/Linux:

```bash
cp .env.example .env
```

O app tenta descobrir a URL automaticamente em desenvolvimento. Se precisar configurar manualmente, edite o `.env`:

```env
EXPO_PUBLIC_API_URL=http://10.0.2.2:3000
```

Use estes valores conforme o ambiente:

- Android Emulator: `http://10.0.2.2:3000`
- Expo Go em celular fisico: `http://IP_DA_SUA_MAQUINA:3000`
- Web ou iOS Simulator: `http://localhost:3000`

No Windows, descubra o IP da maquina com:

```bash
ipconfig
```

Depois de alterar o `.env`, reinicie o Expo.

## 4. Rodar tudo

Use dois terminais:

```bash
# Terminal 1
cd gestao-financeira-api/api
npm run dev
```

```bash
# Terminal 2
cd gestao-financeira-api
npm start
```

No Expo, abra no emulador Android ou escaneie o QR Code com o Expo Go.

## 5. Testar a API

Com a API rodando, teste:

```bash
GET http://localhost:3000/
GET http://localhost:3000/categories
GET http://localhost:3000/transactions
```

Criar categoria:

```http
POST http://localhost:3000/categories
Content-Type: application/json
```

```json
{
  "name": "health",
  "displayName": "Saude",
  "icon": "favorite",
  "background": "#FFB6B6",
  "isIncome": false
}
```

Criar transacao:

```http
POST http://localhost:3000/transactions
Content-Type: application/json
```

```json
{
  "description": "Salario",
  "value": 3500.5,
  "date": "2026-06-04",
  "categoryId": "COLE_AQUI_O_ID_DA_CATEGORIA"
}
```

O `categoryId` deve ser o `id` de uma categoria retornada em `GET /categories`.

## 6. Conferir no app

1. Abra a aba `Categorias` e confirme que aparecem as categorias iniciais.
2. Crie uma categoria personalizada, por exemplo `Transporte`.
3. Abra a aba `Adicionar` e crie uma transacao usando essa categoria.
4. Volte para `Transacoes` e confirme que a transacao aparece.
5. Abra `Resumo` e confira se o saldo e os totais foram atualizados.
6. No MySQL Workbench, rode:

```sql
SELECT * FROM Category;
SELECT * FROM `Transaction`;
```

## 7. Prisma Studio

Para abrir uma interface visual do banco:

```bash
cd gestao-financeira-api/api
npm run prisma:studio
```

Normalmente ele abre em:

```text
http://localhost:5555
```

## 8. Problemas comuns

Se a API nao conectar no banco, confira:

- O MySQL Server esta ligado.
- O banco `gestao_financeira` foi criado.
- O usuario e a senha do `.env` estao corretos.
- A porta do MySQL e `3306`.

Se o app mostrar erro de conexao:

- Confirme que `npm run dev` esta rodando dentro de `api/`.
- Confirme que a API abre em `http://localhost:3000/`.
- Em celular fisico, use o IP da maquina no `EXPO_PUBLIC_API_URL`.
- Depois de mudar `.env`, reinicie o Expo.

Se a migration falhar porque o banco ja tem tabelas antigas, a forma mais simples em ambiente de estudo e apagar o banco e criar de novo:

```sql
DROP DATABASE gestao_financeira;
CREATE DATABASE gestao_financeira
CHARACTER SET utf8mb4
COLLATE utf8mb4_unicode_ci;
```

Depois rode novamente:

```bash
npx prisma migrate dev
npm run prisma:seed
```

## 9. Comandos resumidos

```bash
# Banco: executar no MySQL Workbench
CREATE DATABASE gestao_financeira CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

# API
cd gestao-financeira-api/api
npm install
copy .env.example .env
npx prisma generate
npx prisma migrate dev
npm run prisma:seed
npm run dev

# App
cd gestao-financeira-api
npm install
copy .env.example .env
npm start
```

## 10. Status em relacao ao tutorial do professor

O app ja esta integrado com uma API e nao usa mais `AsyncStorage` como fonte principal dos dados. As categorias tambem nao ficam mais fixas no front: elas vem do MySQL pela API.

O ponto que faltava era o backend Express/Prisma/MySQL dentro do projeto. Ele foi adicionado em `api/`, com schema Prisma, seed, rotas, validacoes e scripts de execucao.
