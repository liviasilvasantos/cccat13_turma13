# cccat13_turma13

# aula 1 

Github: https://github.com/rodrigobranas/cccat13_1

subir docker postgres e depois executar arquivo create.sql

```
% psql -U postgres -d app
% \dn
% \dt cccat13.account
``````

# aula 2

Github: https://github.com/rodrigobranas/cccat13_2

## stub x mock x spy

**stub** = mock um comportamento. Retorna respostas prontas.

**spy** = espiona se o mock foi chamado, armazena os parâmetros e a quantidade de vezes que foi executado. Expectativa de comportamento no teste.

**mock** = manipula um comportamento específico, e verifica se aconteceu o que você determinou pro mock (stub + spy). Expectativa de comportamento na criação do mock.

## hexagonal x clean arch

toda clean arch é hexagonal.  
mas nem toda hexagona é clean arch.

# aula 3

Github: https://github.com/rodrigobranas/cccat13_3

# Artigos

https://khalilstemmler.com/articles/software-design-architecture/domain-driven-design-vs-clean-architecture/

https://codesoapbox.dev/ports-adapters-aka-hexagonal-architecture-explained/