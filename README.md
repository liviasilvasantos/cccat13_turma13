# cccat13_turma13

subir docker postgres e depois executar arquivo create.sql

```
% psql -U postgres -d app
% \dn
% \dt cccat13.account
``````

## Executar teste:

```
cd backend/ride
npx jest test/AccountService.test.ts
```

## Executar aplicação:

```
cd backend/ride
npx nodemon src/api.ts
```