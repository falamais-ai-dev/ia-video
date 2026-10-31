# Piloto do traço: resultado da nota cega (31/10/2026)

Um avaliador separado deu as notas sem saber qual imagem era qual. A ordem das imagens também mudava de um plano para o outro.

As imagens são as seguintes:
- `shotA.jpg` e `shotB.jpg`: REF, X, Y e Z lado a lado.
- `cropA.jpg`: recorte ampliado 2x.
- `cropRef.jpg`: recorte da referência.

| Versão | Traço A | Traço B | Média do traço | Fidelidade geral A | Fidelidade geral B |
|---|---|---|---|---|---|
| Blender (Line Art) | 6 | 6 | 6,0 | 3 | 3 |
| v12 (traço com peso no pós) | 5 | 5 | 5,0 | 5 | 5 |
| v11 (traço antigo) | 4 | 5 | 4,5 | 5 | 5 |

Gabarito: no plano A, X = Blender, Y = v11 e Z = v12. No plano B, X = v12, Y = Blender e Z = v11.

## O que o avaliador viu
- Na v11 há um contorno fantasma duplo no olho, o anel da boca sai irregular e há um halo na borda da cabeça. A causa é a casca invertida somada ao contorno do pós.
- O Blender tem a linha mais limpa, mas a espessura é quase igual em tudo e a tinta é mais fria. A sombra lilás corta o rosto ao meio, o que o original nunca faz.
- Nenhuma das três reproduz o fundo pintado, dessaturado e enevoado do original. Esse continua sendo o maior desvio.

## Decisão
1. **Ficamos no caminho atual.** No Blender, o traço ganhou só 1 ponto. Em troca, o visual geral perdeu 2 pontos, e o render custa 32 s por quadro (cerca de 18 h para 70 s).
2. **Trazemos do Blender o que funcionou:**
   - espessura constante em pixels;
   - o lado da sombra mais grosso, calculado pelo sol;
   - nenhuma linha dupla, ou seja, tirar a casca invertida onde o contorno do pós já desenha.
3. **Próximo salto, maior que o traço:**
   - fundo distante pintado em camadas;
   - paleta menos saturada, com o vermelho puro baixando para tijolo;
   - névoa quente.
