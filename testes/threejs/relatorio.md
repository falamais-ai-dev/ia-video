# Teste: animações 3D (Three.js) e outras técnicas em código

24/10/2026. Tema de teste: o paradoxo do aniversário (pauta, #3). Sem narração e sem gastar cota: 0 créditos do ElevenLabs, 0 imagens do Cloudflare, 0 segundos do Hugging Face. Única cena IA usada já existia (A08 do vídeo do celular no arroz). Vídeos sem áudio; as legendas são de mentira, só para mostrar a composição (estilos A e B).

## O que foi entregue
| Arquivo | Técnica | Duração | Render |
|---|---|---|---|
| demo-1-anel-3d-253-pares.mp4 | 3D: 23 bonequinhos em roda, câmera girando, 253 arcos desenhados com contador | 7 s | 47 s |
| demo-2-calendario-3d.mp4 | 3D: cilindro com 365 dias, 23 bolinhas voam até o dia, duas caem no mesmo dia, confete 3D e círculo à mão que acompanha o ponto 3D na tela | 7,5 s | 47 s |
| demo-3-grafico-animado.mp4 | Gráfico SVG animado: curva que desacelera em 23 (50,7%), número que segue a ponta, selo "99,9% com 70" | 7 s | 35 s |
| demo-4-parallax-2-5d.mp4 | Parallax 2.5D: cena IA aprovada separada em fundo + pessoa, balões 3D entre as camadas, confete na frente, chapéu de festa 3D que cai e encaixa na cabeça (piada visual) | 6,5 s | 36 s |
| demo-5-transicao-estilhaco.mp4 | Transição 3D: o último quadro da cena vira vidro, estilhaça a partir de um ponto de impacto e revela a cena seguinte | 7 s | 54 s |
| rolo-demonstracao-27s.mp4 | As cenas emendadas: parallax → estilhaço → anel → deslize → calendário → cortina → gráfico | 27,2 s | 2 min 35 s |

Render na máquina da nuvem (4 núcleos, sem GPU), 1080x1920, 30 fps, H.264. Média ~1,3 s de render por segundo de vídeo nas cenas 3D. Um vídeo de 65 s todo em 3D levaria ~6 a 7 min; com 3 a 4 cenas 3D no meio das outras, soma ~1 a 2 min ao render atual.

## Como renderizar (o que foi preciso)
- Pacotes: remotion e @remotion/cli/three/transitions 4.0.538, three 0.186, @react-three/fiber 9, react 19 (ver fonte/package.json).
- WebGL sem GPU: só funciona com `--gl=swangle` (angle, angle-egl, swiftshader e vulkan falharam). Já está em fonte/remotion.config.js, junto com o Chromium que já vem na máquina.
- Usar `<ThreeCanvas flat ...>`: sem isso o three.js aplica tone mapping e as cores ficam lavadas (bate com a regra de cores saturadas).
- A câmera é posta a cada quadro (componente `Cam` em three-common.jsx) e todo movimento é função do número do quadro: nada de animação em tempo real.
- instancedMesh (365 peças) precisa ser atualizado num componente dentro do canvas (`Tiles`), senão a referência ainda não existe no 1º quadro.
- Texturas: `useTex` segura o render (delayRender) até a imagem carregar.
- Para pôr um desenho 2D (círculo, rótulo) em cima de um ponto 3D, projetar o ponto com uma câmera igual (THREE.PerspectiveCamera + project), como no demo 2.

## Recorte para parallax (grátis e local)
fonte/recortar.py usa rembg (modelo isnet-general-use, Apache 2.0, roda na CPU em ~10 s) para tirar a pessoa da cena e preencher o fundo (inpaint do OpenCV + leve desfoque). O recorte da A08 e da config/personagem.png ficou limpo, inclusive entre braço e corpo. O recorte por cor do fundo falhou (as sombras da camiseta somem junto).
Limite: o preenchimento do fundo é borrado. Com câmera que anda pouco (±0,6 unidade, como no demo 4) quase não aparece; com movimento maior aparece uma mancha atrás da pessoa.

## O que vale levar para o modelo de montagem
1. **Parallax 2.5D em toda cena IA com pessoa** (demo 4): custa ~10 s de recorte e zero cota, e transforma a cena parada em plano com profundidade. Dá para pôr objetos 3D entre as camadas (balões, gotas, fumaça) e a piada visual em 3D presa ao personagem.
2. **Uma cena 3D de "conta" por vídeo** quando o tema tem número (demos 1 e 2): mostra a quantidade de verdade (253 pares, 365 dias) em vez de só escrever o número. Serve para matemática do cotidiano, física de bolso e qualquer "quantos...".
3. **Gráfico animado com número que segue a curva** (demo 3): mais barato (35 s de render) e muito claro; bom para os temas úteis com dado (consumo de carregador, fila do mercado).
4. **Estilhaço como transição da virada** (demo 5): uma vez por vídeo, no "Mas essa ainda não é a melhor parte". Mais que isso cansa.
5. Transições prontas do @remotion/transitions (deslize, cortina) entre blocos, no lugar de corte seco em todas.

Cuidados: as cenas 3D são ilustração (selo "ILUSTRAÇÃO" quando mostrar fato histórico) e nunca substituem a prova real; checar a zona segura nos quadros, porque a câmera 3D pode levar objetos para os 10% da direita; arcos e confete demais deixam a tela poluída: no máximo 2 elementos gráficos novos por vez continua valendo.

## Problemas conhecidos dos demos (são testes, não vão ao ar)
- Demo 2: várias bolinhas caem no lado de trás do cilindro e quase não aparecem; no vídeo de verdade, girar o cilindro mais devagar.
- Demo 1: o contador de pares encosta nos bonequinhos da frente no fim.
- Demo 4: um fio de balão passa perto do queixo no último segundo.

Código: fonte/src (Root.jsx registra D1Pares, D2Calendario, D3Grafico, D4Parallax, D5Estilhaco e Reel). lib.jsx é o mesmo do Tiradentes; captions.jsx tem os estilos de legenda A e B.
