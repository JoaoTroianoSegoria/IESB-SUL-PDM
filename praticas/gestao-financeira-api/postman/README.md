# Postman - Gestao Financeira API

Esta pasta documenta as rotas testadas no Postman.

## Como usar

1. Inicie a API:

```bash
cd praticas/gestao-financeira-api
npm run dev
```

2. Importe `collection.json` no Postman.
3. Confira a variavel `baseUrl`. O padrao e `http://localhost:3000`.
4. Execute as requisicoes em ordem.

## Autenticacao

Use a requisicao `02 - Login` antes das rotas protegidas. Ela salva automaticamente o JWT na variavel `apiToken`, usada como Bearer Token nas rotas de categorias e transacoes.

Credenciais do seed:

```text
email: aluno@iesb.com
senha: 123456
```

## Observacoes

Se `05 - Criar categoria` retornar `409 Registro duplicado`, provavelmente uma categoria `health` ficou salva de um teste anterior. Apague essa categoria no banco ou altere o campo `name` antes de rodar novamente.

As rotas protegidas devem retornar `401` quando o token nao for enviado.
