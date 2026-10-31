# Método Qualidade 10 (pedido do Sebastião, 31/10: "se a nota está 6 ou 7, eu quero é 10")

Como chegar ao padrão da referência e não perder esse padrão nos próximos vídeos.
Base: as comparações v2 a v10 deste estudo e os recortes de `~/Downloads/pera-estudo-referencia/qualidade/`.

## 1. O que é 10
Um item tem nota 10 quando, lado a lado com a referência no mesmo momento da fala, em tamanho real e
ampliado 3x, ninguém consegue dizer qual dos dois está melhor. A nota vale **por item e por plano**,
sempre com o recorte como prova. Até agora as notas eram dadas por impressão e por vídeo inteiro, e por
isso subiam devagar (5, 6, 7) sem que soubéssemos exatamente onde estava a perda.

**Regra do portão:** nenhum plano avança para o acabamento com um item abaixo de 9, e nenhum vídeo vai
para a publicação com um plano abaixo de 9.

## 2. Bíblia visual (medida na referência, não no gosto)
Valores tirados dos recortes ampliados da referência, na escala de 1080 px de largura:

| Item | Referência (alvo) | v10 hoje |
|---|---|---|
| Traço dos personagens | 5 a 6 px, marrom-escuro #2E2124, borda suave | 3 a 4 px |
| Traço dos objetos | ~3 px | 2 a 3 px |
| Traço do fundo longe | nenhum | nenhum (ok) |
| Filete de luz | ~2 px claro por dentro do traço, em toda silhueta | sutil, só nas cabeças |
| Sombra projetada | roxo-azulada, longa (sol a ~35°) | lavanda leve, curta |
| Sombra de contato | todo pé e todo objeto | ok |
| Céu | degradê azul, nuvens fofas com barriga azulada | ok, nuvem sem barriga |
| Distância | névoa creme que tira a cor e clareia | leve |
| Saturação | quente, sem cor pura (nada #F00) | o vermelho ainda chega a puro |
| Cabeça | redonda e grande, ~1/3 da altura | ok |
| Olhos | grandes, pupila em ponto, sobrancelha grossa e independente | ok |
| Troca de expressão | a cada 0,4 a 0,6 s em quem fala; quem ouve reage | ok (v6 em diante) |
| Soldado do fundo | olhos, boca, elmo com nervura, escudo de frente, leve balanço | rosto na v9, falta o balanço |
| Castelo | janelas em arco, ameias, bandeirinha em cada torre | janelas na v9 |
| Metal | reflexo pintado em faixa diagonal + estrela de brilho | faixa na v10 |
| Antisserrilhado | nenhuma escada visível nem em 4x | resolvido (DOF em resolução cheia) |

Toda mudança de estilo atualiza esta tabela. Ela é a régua de todo vídeo, não só deste estudo.

## 3. Onde estão os pontos que faltam (diagnóstico honesto)
As notas pararam em 6 e 7 por três causas, e só uma delas é de ajuste fino:
1. **Cenário montado com primitivas 3D** (cilindro, cone, caixa). A referência tem um fundo pintado, com
   centenas de pequenos detalhes. Nenhum ajuste de luz transforma um cone liso num telhado pintado.
   **Caminho para o 10:** separar o plano longe (montanhas, vale, castelos, céu) em **placas pintadas em
   camadas, com parallax**, feitas uma vez e reaproveitadas, e deixar o 3D só para o plano próximo, onde a
   câmera gira. As placas podem ser pintadas em canvas no código (já fazemos as texturas assim) ou geradas
   como ilustração no Cloudflare Workers AI (as regras do canal permitem cena de IA ilustrada), sempre
   revisadas pela checagem de cena gerada.
2. **Traço por casca invertida e pós-processamento.** A casca dá espessura constante, e o pós-processamento
   desenha as dobras internas, mas nenhum dos dois imita o traço com peso da referência (mais grosso na
   sombra, mais fino na luz). **Caminho para o 10:** testar num plano o traço com peso, ou seja, espessura
   da casca modulada pela luz (lado da sombra 1,4x, lado da luz 0,7x), mais o filete de luz em toda
   silhueta. Comparar em 4x com a referência.
3. **Detalhe por plano abaixo da referência.** Na referência, cada plano tem pelo menos 3 detalhes de
   assinatura (flores, marcas na parede, patos, lampião, brilho de estrela). **Caminho para o 10:** a lista
   do item 5, conferida plano a plano.

## 4. O fluxo, plano a plano (não vídeo a vídeo)
Para cada plano (o trecho entre dois cortes):
1. **Blocagem:** câmera, poses e quem está no quadro. Conferir o rosto na zona segura e a legenda fora do assunto.
2. **Atuação:** a linha do tempo de expressões presa às palavras, o olhar dirigido e a reação de quem ouve.
3. **Cenário:** as três camadas (ação, secundária e ambiente), os 3 detalhes de assinatura e a placa
   pintada ao fundo.
4. **Luz e acabamento:** os valores da bíblia (item 2).
5. **Portão:** renderizar **só os quadros desse plano** (`--frames=a-b`, em segundos, não em 20 min), montar
   o par com a referência em 1x e 3x, dar nota a cada item da rubrica (item 6) e corrigir o que ficar abaixo
   de 9 antes de passar para o próximo plano.
6. **Quadro ouro:** quando o plano chega a 9 ou 10, guardar um quadro de cada plano em `qc/ouro/`. Nas
   versões seguintes, o caça-erros compara com esse quadro, e qualquer piora é regressão: volta.

O render inteiro (20 min) só acontece no fim, quando todos os planos passaram no portão.

## 5. Lista de "carinho" (conferir em todo plano)
- [ ] Algo vivo no fundo: bandeira ondulando, árvore balançando, fumaça, água, pássaro ou soldado respirando.
- [ ] Pelo menos 3 detalhes de assinatura: flor, marcas de contagem, sujeira, rachadura, lampião, pato,
      moeda, faísca, brilho de estrela.
- [ ] Todo personagem visível com rosto e reação, inclusive os do fundo.
- [ ] Material com acabamento: madeira com veio e prego, metal com reflexo pintado, tecido com dobra e friso.
- [ ] Profundidade: perto saturado e nítido, longe creme e suave.
- [ ] Sombra de contato em tudo o que toca o chão.
- [ ] Nenhuma cor pura, nenhum objeto liso sem traço no plano próximo.

## 6. Rubrica (âncoras para não dar nota por impressão)
| Item | 10 | 7 | 5 |
|---|---|---|---|
| Traço | espessura com peso e borda lisa em 4x, igual à referência | espessura certa, sem peso | fino e uniforme |
| Antisserrilhado | nenhuma escada em 4x | escada só em fio fino | escada nas cabeças |
| Rosto e expressão | troca a cada ~0,5 s, quem ouve reage, nunca sai da cabeça | troca a cada ~1 s | expressão parada |
| Corpo | inclina, encolhe e gesticula na reação | inclina pouco | duro |
| Cenário perto | 3 ou mais detalhes de assinatura, materiais com acabamento | materiais ok, pouco detalhe | primitivas lisas |
| Cenário longe | pintado, em camadas, com névoa | primitivas com névoa | primitivas chapadas |
| Luz | sombra roxa longa, filete de luz, névoa | 2 dos 3 | nenhum |
| Câmera | segue a ação, nunca corta o assunto | corta em 1 momento | corta várias vezes |
| Legibilidade da piada | entende-se sem som em 1 s | entende-se em 2 a 3 s | precisa do som |
| Estabilidade | 0 pops e 0 cintilação no caça-erros | 1 pop | listras ou sombra piscando |

## 7. Portões automáticos (antes de qualquer olho humano)
`python3 qc/qc_animacao.py video.mp4 pasta_saida --ffmpeg <caminho>` mede:
- **pop:** quadro isolado diferente dos vizinhos (alvo: só os cortes planejados).
- **cintila:** nitidez do chão e do meio da tela que salta num quadro só (alvo: nenhum).
- **tela parada:** trechos de mais de 3 s quase sem mudança (alvo: nenhum).
Também grava a grade de 2 quadros por segundo. A serrilha **não** entra no automático: testei uma medida por
"borda seca" e ela deu nota pior à referência (traço grosso e nítido) do que ao nosso vídeo, então não serve.
A serrilha se confere no olho, num recorte 4x de cabeça, lança e soldado distante por plano. Depois disso vem o olho: os pares com a referência em 1x e 3x,
e 8 quadros por segundo nos 0,5 s depois de cada corte.

## 8. Como o padrão se mantém nos próximos vídeos
- **O kit carrega a qualidade.** Todo acerto vira componente reutilizável no kit toon (Soldado com rosto
  e balanço, Castelo com janelas, Bandeira com dobra, Metal pintado, Placa pintada de fundo, Flores,
  Lampião), nunca um ajuste dentro da cena de um vídeo. O vídeo novo começa onde o último terminou.
- **A bíblia (item 2) e a rubrica (item 6)** valem para todo vídeo, e a nota de cada plano fica registrada
  no roteiro.md do vídeo.
- **Os quadros ouro** de cada componente (personagem de frente e em 3/4, castelo, soldado) são conferidos
  a cada mudança no kit: se piorou, a mudança volta.
- **Tempo:** com o portão por plano, a iteração custa segundos por plano em vez de 20 min por vídeo.
  O PC (RX 6700 XT) faz o render final de 70 s em ~20 min.

## 9. Próximos passos, do maior para o menor salto até o 10
1. Placas pintadas em camadas para o plano longe (castelos, montanhas, vale com plantação e o exército
   em multidão), com parallax. É o maior salto: cenário de 6 para 9.
2. Traço com peso, mais o filete de luz em toda silhueta. Traço de 7 para 9.
3. Soldados do fundo com balanço e piscada, e brilho de estrela nos escudos de vez em quando.
4. Saturação do pós-processamento limitada nas cores vivas, para nenhum vermelho chegar a puro.
5. Sombra mais longa e mais roxa (sol mais baixo).
6. Barriga azulada nas nuvens.
7. Portão por plano, com os quadros ouro, aplicado à v11 antes de qualquer outra mudança.
