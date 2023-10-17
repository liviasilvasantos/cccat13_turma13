# cccat13_turma13

subir docker postgres e depois executar arquivo create.sql

```
% psql -U postgres -d app
% \dn
% \dt cccat13.account
``````

## Executar testes backend:

```
cd backend/ride
npx jest test/AccountService.test.ts
```

## Executar aplicação:

```
cd cccat13_1-master/backend/ride
npx nodemon src/api.ts
```

## Extensions

Live Preview
Cmd + Shift + P > Live Preview: Start Server\

Browser Preview

## Executar fronted:

```
cd cccat13_1-master/fronted
yarn dev
```

## Executar testes fronted:

```
cd cccat13_1-master/fronted
yarn test
```