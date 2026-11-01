# Estudo: cortes secos e conforto visual (01/11/2026)

Pedido do Sebastião: os vídeos têm cortes secos demais, e o do relógio chegou a fazer mal. Trocar por interpolação e por câmera andando no cenário.

## Como medi
`scene` do ffmpeg, quadro a quadro, em todos os vídeos. Conta como corte seco uma mudança acima de 0,28 entre dois quadros seguidos. É o mesmo critério para os três grupos.

## Resultado
| Vídeo | Cortes secos por minuto | Quadros com salto > 0,28 | Quadros com salto > 0,15 |
|---|---|---|---|
| Penicilina, antes | 34,7 | 44 | 50 |
| Relógio, antes | 36,3 | 47 | 54 |
| Ricks Clips, média de 10 Shorts | 0,6 | 0 a 5 por vídeo (9 de 10 com 0 ou 1) | 0 a 11 (4 vídeos medidos) |
| Penicilina, depois | 0 | 0 | 8 |
| Relógio, depois | 0 | 0 | 14 |

## O que o Ricks faz
Ele troca de plano com a mesma frequência que a gente (a cada 1 a 2 s), mas quase nunca com corte seco:
1. Trocas de lugar: fusão de ~0,3 s entre os dois planos.
2. Dentro do mesmo lugar: a câmera anda, gira ou aproxima até o novo enquadramento.

Ou seja, o problema não era o ritmo. Era o salto instantâneo de imagem, 35 vezes por minuto, e o chicote com borrão nas trocas de cenário.

## O que mudou (src/camera-suave.js, igual nos dois projetos)
- **Mesmo cenário:** a câmera anda do enquadramento atual até o próximo, em 0,55 a 1,15 s conforme a distância, começando 0,2 s antes da palavra.
- **Trocas de cenário, ou distância acima de 2,6 m ou giro acima de 70°:** fusão de 0,33 s, com os dois cenários desenhados ao mesmo tempo. A legenda fica fora da fusão, sempre nítida.
- **Plano marcado com `funde: true`:** fusão mesmo no mesmo cenário, onde o caminho atravessaria um objeto ou personagem. Marcados: a queda até o chão na bancada e o close do porco (penicilina); a saída do close do Dumont e a vitrine (relógio).
- **Saiu:** o chicote com borrão.
- **Reduzido:** o tremor de câmera (metade) e os flashes brancos (intensidade máxima de 0,8 para 0,45).
- **Sem pulo:** a queda de luz da penicilina e a tela preta do "PLOT TWIST" agora entram e saem aos poucos.

## Glitch da porta (penicilina)
- A folha da porta girava para dentro da sala e atravessava o arquivo e o Fleming. Agora ela abre para fora: a folha estreita sem sair da parede, e o vão fica claro.
- A maleta agora fica presa na mão do Fleming.

## Limites
- Medi quadros e diferenças entre quadros. O conforto de quem assiste só se confirma assistindo.
- As prévias são em baixa. O render final fica mais lento, porque as fusões desenham dois cenários.
- O número de planos não mudou. Se ainda cansar, o próximo passo é juntar planos curtos (menos de 1 s) em movimentos únicos mais longos.
