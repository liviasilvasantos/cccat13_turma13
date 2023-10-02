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

clean arch: desacoplamento entre as regras de negócio (domínio) da aplicação e os recursos externos como frameworks e banco de dados.

Entities > Use Cases > Controllers/Gateways/Presenters > Web/UI/Devices/DB/External Interfaces

Domain: cojunto de dados e comportamento

Use case: toda e qualquer interação de atores externos que executam algum comportamento no domínio.
Apenas uma classe com método execute, garatindo que faça uma coisa bem definida (SRP - Single Responsability Principle).

Screaming arch: tudo explícito e claro.

Interface Adapters: fazem a ponte entre os casos de uso e os recursos externos.

Pattern Adapter: faz um wrapper em uma dependência, oferecendo uma interface. Adapta uma interface em outra, para ficar livre de uma dependência.

# Artigos

https://khalilstemmler.com/articles/software-design-architecture/domain-driven-design-vs-clean-architecture/

https://codesoapbox.dev/ports-adapters-aka-hexagonal-architecture-explained/