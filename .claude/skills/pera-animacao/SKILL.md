---
name: pera-animacao
description: Use ao animar qualquer cena 3D do Pera AI ou do Ponto Cifrão (Remotion + Three.js, personagens jogo de montar) - roteiro de planos, poses, câmera, acabamento do render e checagem da animação antes de "Status: pronto".
---

# Animação do Pera AI (regra 38 de log/decisoes.md)

Pedido do Sebastião em 30/10/2026: "as animações estão bem fracas". Este é o padrão para deixá-las com cara
de desenho animado bem feito, sem gastar nada (só Remotion, Three.js e bibliotecas MIT).

## Regra de ouro (Sebastião, 30/10)
- "Esse nível de detalhe e carinho precisa ser em todos os vídeos": nada de versão "boa o bastante" para cumprir
  horário. Todo vídeo passa pela checagem da seção 5 e pelas seções 6 e 7.
- "Sempre tente renderizar as coisas no computador, nuvem é último caso": render (inteiro, trechos, capa e quadros de
  conferência longos) no PC dele via Remote Control (~1 min para 2 min de vídeo). Nuvem só com o PC desligado ou
  falhando, e o motivo vai no relatório. Quadros soltos rápidos de conferência podem ser na nuvem com `nivel: nuvem`.

## Onde está o código
Modelo padrão em `/mnt/project-files/config/personagem-3d/blocos/fonte/src/` (copie para o `src/` do vídeo):
- `atuacao.jsx`: motor de atuação. `personagens-roblox.jsx` já usa; não precisa chamar direto.
- `cinema.jsx`: `fazCamera` (planos, câmera na mão, `segue`), `enquadra`, `Acabamento`, `Aquece`, `Borrao`.
- `cena-viva.jsx`: `Medidor`, `Etiqueta`, `Poeira`.
- Prévia antes x depois: `/mnt/project-files/testes/animacao-principios/`.

## 1. Atuação dos personagens (automática)
O `misturar` antigo trocava todas as juntas juntas em 0,25 s (cara de robô). Agora cada troca de pose tem:
olhos primeiro, depois corpo, cabeça, braço e antebraço por último (sobreposição); um contra-movimento
pequeno antes (antecipação); passa um pouco do ponto e assenta (follow-through); piscada na troca; pose viva
(cabeça e braços nunca congelam); estica e encolhe no pulo. O que você ainda precisa fazer:
- **Uma pose nova a cada frase**, ligada ao sentido da fala (pensa, surpresa, aponta, mostra, duvida,
  comemora, toca). Nunca o mesmo personagem parado na mesma pose por mais de ~3 s.
- **Pose de contato** (mão na maçaneta, botão, peça): ponha `firme: 1` na pose. Tira o passa-do-ponto e a
  pose viva do braço para a mão não atravessar nem escorregar do objeto.
- **Caminhada sem patinar**: `caminhada(dist)` de atuacao.jsx, com a distância andada até t
  (`POSES_BETO.anda = (l, t) => ({...parado(l, t), ...caminhada(distAte(t))})`). Velocidade do caminho
  0,6 a 1,2 un./s; caminho mais lento que isso vira "esteira" (pé andando e corpo parado).
- **Braço nunca atravessa o corpo**: `liberaBraco` (personagens-roblox.jsx) abre o ombro sozinho quando a pose, a mistura
  ou o passa-do-ponto levariam o braço para dentro do tronco. Não desligue; em pose nova, confira mesmo assim.
- **Exagere a reação**: surpresa com pulo, choque com tremida, alívio com ombro caindo. Personagem de
  brinquedo pede gesto grande.

## 2. Câmera e enquadramento
- Siga a regra 34 (corte só com motivo, em cima da palavra, empurrão em todo plano).
- Monte os planos com `enquadra(p, r, tipo)`: `rosto` (reação), `busto` (o padrão quando ele age),
  `corpo` (quando o corpo ou os pés contam), `conjunto` (2 a 3 personagens). Os olhos ficam no terço de cima.
  **Nunca** plano de tronco ou cintura sem rosto, a não ser que o assunto seja o objeto na mão ou nos pés
  (aí é `detalhe`, com o objeto no centro da zona de conteúdo).
- Rosto nunca dentro da faixa da legenda (y 1240 a 1410) nem cortado na altura dos olhos.
- Personagem andando: plano com `segue: (t) => eleEm(t).p` para a câmera acompanhar.
- A câmera na mão (`vivo`, ligada por padrão) dá vida ao plano; desligue com `vivo: 0` em macro.
- **Abra o plano**: o 9:16 corta o que acontece do lado. Depois de montar a lista, abra todo plano ~20% e o detalhe
  ~12% (laço `ABRE` no Video.jsx da maçaneta), sem deixar a câmera passar da parede do fundo.
- **Câmera nunca atrás da parede nem olhando para onde não há cenário** (tela vazia): use `enq()` do Video.jsx da
  maçaneta, que gira o lado do plano até caber. Personagem de perfil numa parede: ele vira corpo e cabeça para a câmera.
- Para conferir câmera sem renderizar: empacote o Video.jsx com esbuild e imprima `CAM.em(t)` e `CAM.projeta(t, cabeça)`
  (a cabeça do boneco fica a ~2,1 de altura).

## 3. Cena viva (informação dentro da cena)
- **Cada número da fala vira um medidor que muda diante do olho**: `<Medidor t p valor unidade a />` espetado
  no objeto (termômetro, voltímetro, cronômetro), com o valor animado em função de t.
- Nome de peça em `<Etiqueta>` (pílula presa ao objeto), não solto no topo da tela.
- **Consequência concreta e múltipla**: várias gotas, faíscas, poças, rachaduras de tamanhos diferentes,
  nunca uma mancha só.
- **Três camadas sempre**: principal (a ação), secundária (sombra, objeto reagindo, partícula) e ambiente
  (`<Poeira>`, planta balançando, relógio, cortina, vapor). Fundo nunca morto.

## 4. Acabamento do render
`Q` em personagens-roblox.jsx tem 3 níveis (`--props='{"nivel":"pc"}'`):
- `pc` (padrão do render no PC do Sebastião, regra 30): resolução cheia, sombra 2048, oclusão de
  ambiente N8AO, antisserrilhado SMAA, cor e vinheta. Profundidade de campo fica desligada (`dof: false`):
  nos testes ela pintou a parede de preto no primeiro quadro e nos chicotes de câmera.
- `nuvem+` (reserva na nuvem): o mesmo a 85% da resolução e sombra 1024. Lento na nuvem (~2 s/quadro).
- `nuvem` (o antigo, sem acabamento): é o padrão quando não se passa `nivel`, para as rotinas na nuvem não
  ficarem mais lentas. Use só quando o PC estiver desligado e o prazo não deixar outra opção.
Ponha `{Q.pos && <><Aquece /><Acabamento cam={CAM} t={t} dof={Q.dof} /></>}` no fim do `<ThreeCanvas>` e
`<LuzJogo>` já traz a luz de recorte. Rode `ferramentas/brilho.sh` depois (o acabamento muda o brilho).

## 5. Checagem da animação (caça-erros, antes de "Status: pronto")
Além da checagem de 2 quadros/s, extraia **8 quadros/s nos 0,5 s depois de cada troca de pose e de cada
corte** e procure: mão atravessando objeto, objeto flutuando, pé patinando, junta torta no passa-do-ponto,
rosto cortado ou atrás da legenda, plano sem rosto e sem objeto-assunto, tela parada mais de 3 s,
personagem congelado. Pergunta final: "se eu tirar o som, cada frase tem algo mudando na tela?"
Se não, ponha medidor, etiqueta, consequência ou reação.

## 6. Voz com vida (pedido de 30/10: "falta detalhar entonação, tenta ser mais humano")
- Marca de entonação em quase toda frase, não só no começo do bloco: `[playfully]`/`[mischievously]` na piada,
  `[laughs]` logo antes da palavra que fecha a piada, `[whispers]` no laço aberto, `[sighs]` no acidente,
  `[surprised]` na virada ("Pera aí!"), `[dramatic]`/`[suspenseful]` antes do número forte, `[warmly]` no fecho;
  número que importa em MAIÚSCULAS; reticências antes da palavra-surpresa.
- `stability: 0.0` na chamada (mais expressiva; mesma voz de config/voz.json). Pausas: encurte só acima de 0,30 s
  (para 0,24 s), senão o tempo da piada some.
- Confira com a transcrição do ElevenLabs (speech-to-text, scribe_v1): todas as palavras certas e `[riso]`/`[suspiro]`
  onde deviam. Se trocar a narração de um vídeo já animado, recalcule os tempos casando palavra com palavra
  (warp linear entre os inícios e fins das palavras) em vez de remarcar à mão: T, legenda, efeitos e respiros.

## 7. Efeito sonoro só com algo na tela
Cada efeito precisa de algo acontecendo no mesmo instante: objeto mexendo, número mudando, faísca, rótulo ou
personagem entrando. Antes de mixar, percorra a lista de efeitos com a grade de quadros do mesmo tempo e tire o que
não tem par na tela (porta parada, "ar seco", moeda que não cai, bipe solto).

## Skills de apoio instaladas neste repositório
- `remotion-best-practices` (oficial do Remotion): timing, `spring`, sequências, transições, 3D no Remotion.
- `motion-design` (LottieFiles, MIT): personalidade de movimento, tabelas de duração e easing, 3 camadas.
- Princípios da Disney (dylantarre, MIT): `anticipation-mastery`, `follow-through-overlapping`,
  `squash-stretch-mastery`, `staging-mastery`, `timing-principle-mastery`, `arc-mastery`,
  `exaggeration-mastery`, `secondary-action-mastery`.
- `r3f-animation`, `r3f-postprocessing` (EnzeD, MIT) e `threejs-lighting` (CloudAI-X, MIT).
As regras do projeto (instruções e log/decisoes.md) sempre valem acima delas: por exemplo, a voz é só a do
ElevenLabs em config/voz.json e nada pago fora dela, mesmo que uma skill sugira outra ferramenta.
