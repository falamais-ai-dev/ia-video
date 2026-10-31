# Piloto de traço: v11 atual x Blender (Line Art)

Mesmos modelos e mesma câmera nos dois lados. Teste cego: `atual-*` x `blender-*`.

| Plano | Quadro v11 | O que é | Original (ref) |
|---|---|---|---|
| A | 790 (26,3 s, "fura") | rei vermelho de perto, gritando | 41,0 s |
| B | 680 (22,7 s, "cara a cara") | os dois reis frente a frente na trilha | 16,5 s |

O pedido dizia 735 e 900, mas 735 é o rei vermelho sorrindo de lado ("O vermelho") e 900 é o close do rei verde;
o grito do vermelho vai de 765 a 807 e o plano aberto da trilha com os dois reis é o de 680.

`ref-*.png` são quadros do vídeo original: só para comparação interna, nunca publicar.

## Como refazer
1. `exportador/`: entrada Remotion que roda a `LancaEscudo2` da v11 sem mudar o código dela, captura a cena three.js
   do quadro e manda `.glb` + câmera/sol/névoa em JSON para `servidor.py` (porta 8765). A casca invertida (HULL) não vai
   para o arquivo: vira o peso de traço da malha irmã. Instâncias (soldados, capim, árvores) são assadas numa malha só.
   ```
   python3 exportador/servidor.py <pasta> 8765 &
   cd ../projeto-v11 && npx remotion still ../piloto-traco/exportador/index.jsx Exporta /tmp/x.png --frame=790 --gl=angle --scale=0.1
   ```
2. `blender/montar.py` (Blender 4.5 LTS): `blender -b --factory-startup --python blender/montar.py -- q790.glb q790.json blender-A.png`
   - EEVEE, cel de 2 tons (Shader to RGB + rampa constante), sombra roxa, sol quente a 22° no mesmo azimute da v11.
   - Line Art #372C2E: 5,5 px nos reis, 3 px nos objetos, +45% só nos contornos do lado da sombra
     (segundo Line Art com sombra do sol, filtro "SHADED"); dobras (ângulo 120°), bordas de material e interseções.
     A largura é em pixel de verdade: um nó de geometria ajusta o raio de cada ponto pela profundidade na câmera.
   - Filete de luz (~2 px) nas cabeças claras, só do lado iluminado; névoa creme 6 m -> 90 m (máx. 60%), como o pós da v11.
