# Aprendizados do piloto de traço (31/10/2026)

Decisão do Sebastião: o Blender não entra na produção (~32 s por quadro, ~18 h por vídeo de 70 s).
Fica só o que ele ensinou. Nota do traço na rubrica do Método Qualidade 10: v11 atual 6, Blender 9.

## O que levou o traço de 6 para 9 (portar para o contorno da v11/v12)
1. **Largura em pixel de tela, não em metro.** Cada ponto do traço tem o raio ajustado pela profundidade na
   câmera: `raio = px/2 * profundidade * 2*tan(fov/2) / altura`. Close e plano aberto ficam com o mesmo
   5,5 px nos personagens e 3 px nos objetos. Na v11 equivale a escalar o deslocamento da casca por `-mv.z`
   sem o teto (`cap`) atual, ou a usar o mesmo `px` fixo no pós-processamento.
2. **Lado da sombra ~45% mais grosso.** O peso vem da luz de verdade (contorno na região sombreada pelo sol),
   não de pintura. Na v11: engrossar a casca onde `dot(normal, direção do sol) < 0`.
3. **Some com a distância:** traço vai a zero entre 30 e 60 m (igual ao `longe` do pós da v11). Sem isso o fundo
   fica riscado.
4. **Dobras e bordas de material contam:** ângulo de dobra ~120°, borda entre materiais e interseção
   (barba/cabeça, coroa/cabeça) dão o desenho interno que a casca não dá.
5. **Costuras viram traço falso:** vértices duplicados no torno/esfera geram uma linha no meio da cabeça. Qualquer
   detector de borda por geometria precisa de malha soldada.
6. **O que é traço não ganha traço:** membros, olhos, sobrancelhas e boca escuros já são linha; contorná-los
   engorda e borra.

## O que não ajudou ou atrapalhou
- Sol baixo (22°) deixa meia cara roxa no close. Para o rosto, sol mais alto ou rampa de sombra mais baixa.
- Sem nuvens, desfoque e oclusão o quadro parece mais chapado: esses três seguram muito da "riqueza" da v11.
- Cor do traço: o método diz #2E2124 e o pedido do piloto #372C2E. Escolher uma e travar na bíblia.

## Checagem que vale para todo plano
Recorte do traço em 4x ao lado da referência, nota na rubrica, recorte salvo como prova.
