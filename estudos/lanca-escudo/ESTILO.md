# Estilo Senhor Sticker: guia completo (base: lança x escudo v17, aprovado em 31/10/2026)

Este guia descreve tudo o que foi feito no vídeo "lança x escudo" v17, que o Sebastião aprovou ("acho que assim ficou bom"). O objetivo é que uma sessão nova consiga fazer outro vídeo no mesmo padrão sem precisar perguntar nada.

Onde está cada coisa:
- **Código aprovado:** repo `falamais-ai-dev/ia-video`, pasta `estudos/lanca-escudo/projeto-v17/`. É o projeto Remotion completo, com `src`, `public`, `audio/mix2.py`, `voz/palavras*.json` e o `remotion.config.js` do PC.
- **Uma cópia deste guia:** `estudos/lanca-escudo/ESTILO.md`.
- **Entregas da v17:** `/mnt/project-files/testes/estilo-toon-lanca-escudo/`
  - `teste-lanca-escudo-v17-70s.mp4`
  - `thumb-v17-1080x1920.png`
  - `titulo-descricao-v17.md`
  - `LEIA-ME.md`, com o histórico das versões v1 a v17
  - `METODO-QUALIDADE-10.md`
- **Marca do canal:** `/mnt/project-files/config/senhor-sticker/`, com o logo, a capa e o `fonte-3d/Marca.jsx`.
- **Método nota 10 (doc):** https://claude.ai/artifact/Ce2RZoj74rRakUvW7TeM88

Regras fixas do projeto:
- Só o ElevenLabs é pago; todo o resto tem que ser gratuito.
- A chave vem só do ambiente (`ELEVENLABS_API_KEY`) e nunca é gravada em arquivo.
- Todo crédito gasto é anotado em `/mnt/project-files/log/cotas.md`.
- Nada de whisper tags.
- Histórias originais: nunca copiar roteiro, imagem, áudio ou filmagem de outro criador. A referência serve só para estudar ritmo e qualidade.

---

## 1. O que é o estilo, em uma frase

É uma fábula curta de 60 a 70 s com um paradoxo ou uma "lógica de desenho", narrada rápido por um contador de história. O visual é **3D toon com contorno** (cel shading de 2 tons, traço ameixa, cores quentes, sol dourado baixo). Cada palavra concreta da fala tem um evento visual. A câmera nunca fica parada. O fecho é uma piada de callback.

Referência estudada: o Short "An Unstoppable Spear vs an Unbreakable Shield" (Ricks Clips). A análise está em `/mnt/project-files/pesquisa/estilo-toon-lanca-escudo/analise.md`.

---

## 2. Estrutura da história e da piada

### 2.1 O molde (os tempos são os da v17, com 191 palavras em 67 s)

| Bloco | Tempo | O que acontece | Função |
|---|---|---|---|
| 1. Premissa absurda | 0 a 7,7 s | "Um ferreiro vendeu uma lança que furava qualquer coisa pra um rei, e um escudo que nada furava pro pior inimigo dele!" | Gancho: o paradoxo inteiro já na primeira frase, com 2 piadas visuais (lança atravessa a bigorna, lança entorta no escudo). |
| 2. Contexto com piada visual | 7,8 a 14,5 s | "Os dois reinos tavam em guerra fazia cem anos…" | Piada só visual: o soldado velhíssimo, entediado, ao lado da placa "ANOS DE GUERRA" 099 → 100. Depois uma revelação de escala: a grua mostra que era uma ponte com patinhos. |
| 3. Preparação | 14,6 a 21 s | "Então os dois exércitos marcharam pro mesmo campo…" | Vista aérea dos exércitos e câmera baixa na trilha. Brilho na lança e depois no escudo. |
| 4. Confronto | 21,2 a 31 s | Os reis cara a cara, os gritos "essa lança fura qualquer coisa!" e "e esse escudo nada fura!" | Duelo de falas com o corpo atuando: quem grita inclina, quem ouve encolhe. |
| 5. Ação e virada | 31,3 a 39 s | "Ele pegou distância, correu, mirou… e no instante em que a ponta encostou… o mundo travou." | Clímax físico. O mundo congela e fica cinza, e a música para de repente. |
| 6. A explicação | 40 a 45,8 s | "Porque se a lança furasse, o escudo era mentira…" | A lógica do paradoxo, ilustrada com duas cartas carimbadas "MENTIRA!". |
| 7. Passagem do tempo | 45,9 a 54 s | "…ficaram ali, parados, esperando. Um dia. Uma semana. Um ano inteiro." | Montagem cômica com noites cada vez mais rápidas, barba crescendo, passarinho parado no ar, teia, ninho e neve. |
| 8. O vencedor de verdade | 54,4 a 64 s | "Enquanto isso, lá na ponte, o ferreiro contava o dinheiro…" | Segunda virada: quem ganhou foi o vendedor. Ele pendura a placa "espada que corta lança e escudo, pela metade do preço!". |
| 9. Callback | 64,3 a 70 s | "E o soldado velho? Só virou o contador pra cento e um." | Fecho com um personagem do começo. É a piada mais curta e seca. |

### 2.2 As regras da piada (medidas na referência e confirmadas nas notas)
1. **A premissa inteira vai na primeira frase.** Nada de introdução; o paradoxo é o gancho.
2. **Toda palavra concreta tem um evento visual.** Ele começa de 0 a 0,25 s depois do início da palavra: brilho em "lança", impacto em "qualquer", faísca em "nada", boing em "furava".
3. **A reação vem uma palavra depois do evento,** cerca de 7 a 8 quadros. O exemplo é o ferreiro, que arregala os olhos e sua em "coisa".
4. **Uma ou duas piadas só visuais a cada 15 s,** que a narração não cita: o soldado velho, os elmos com flor, os patinhos, o passarinho parado no ar.
5. **Rima visual espelhada.** A segunda piada repete a primeira ao contrário: a lança fura a bigorna, depois entorta no escudo.
6. **Duas viradas:** uma de escala (a grua revela a ponte) e uma de vencedor (o ferreiro lucra com os dois lados).
7. **Fecho com callback** de algo plantado nos primeiros 10 s, como o contador 100 → 101.
8. **Código de cor por lado** (vermelho x turquesa/verde): a história se entende sem som. Bandeiras, sacos de moeda, roupas e brilhos seguem a cor do lado.
9. **A piada é desenhada para a câmera.** O objeto fica grande, com linha de visão livre e o movimento no plano da tela. Faísca nunca cobre o furo.

### 2.3 O texto
- Português coloquial de contador de história: "tavam", "pra", "pro", "fazia cem anos". As frases são curtas e as exclamações vão nos gritos.
- Entre 180 e 200 palavras para cerca de 67 s de fala, ou seja, de 2,8 a 3 palavras por segundo já contando as pausas.
- Cada bloco começa com uma audio tag do eleven_v4: `[excited]`, `[mischievously]`, `[serious]`, `[curious]`, `[playfully]`. Uma tag por frase basta.
- Nomes que a voz lê errado são escritos para o ouvido no texto da voz, mas a legenda mostra a grafia certa. O caso medido foi "ferreiro", que saía "fereiro"; com "ferrreiro" (3 erres) o RR ficou forte. A escolha entre 3 grafias foi feita olhando o espectro do áudio.
- O texto completo da v17 está em `projeto-v17/voz/texto.txt`; uma cópia vai no apêndice A.

### 2.4 Para uma história nova
Escolha um paradoxo, um ditado ou uma "lógica de desenho" com:
- dois lados opostos com cor própria;
- um objeto-herói por lado;
- um terceiro personagem que lucra ou observa (o ferreiro);
- um figurante cômico que volta no fim (o soldado velho).

Escreva os 9 blocos acima e marque, palavra por palavra, qual evento visual cai em cada palavra concreta. Essa tabela vira o `TM` do código (seção 5.2).

---

## 3. Personagens (kit `toon2.jsx`)

- **Corpo "cabeça de lâmpada":**
  - A cabeça é grande, redonda e branca, com cerca de 30% da altura.
  - O corpo tem forma de feijão, na cor do lado, e os membros são de linha fina (`Linha`).
  - O braço é em cadeia e a mão é posicionada no mundo (`mP` e `mN`, com `maoRepouso` para a mão parada).
- **Componente:** `<Boneco pos ry c={{...}} />`. Opções principais de `c`:
  - `cor`, `olhos`, `boca`, `sob` (sobrancelha: + bravo, − assustado), `olhar` [x,y], `cab` [rx,ry,rz], `estica` (squash/stretch)
  - `resp` (fase da respiração), `inc` (inclinação do corpo para a frente ou para trás), `lat`
  - `mP`/`mN`, `abre` (abertura da boca), `trem` (tremor), `vivo` (micro-movimento), `palp` (pálpebra), `escOlho`, `bochecha`, `assim` (assimetria das sobrancelhas)
  - `roupa`, `capa`, `cabeca` (acessórios como filhos)
- **Acessórios prontos:** `CoroaOuro`, `CoroaPrata`, `Barba`, `Cavanhaque`, `BigodeGuidao`, `Avental`, `Elmo`, `Lanca` (com `dobra` para entortar), `pontaDe`.
- **Efeitos em sprite:**
  - `Brilho` (estrela na ponta, em palavra-chave), `Faisca` (impacto), `Gota` (suor no susto)
  - `Velocidade` (risco de corrida), `Nuvem`
- **Materiais:**
  - `T(cor)`: toon de 2 tons.
  - `B(cor)`: básico, sem luz.
  - `PRATA`, `OURO`, `FERRO`: metal em matcap pintado, nunca PBR.
  - `canvasTex`: placas e texto pintados em canvas dentro da cena.
- **Figurantes também têm rosto.** Os soldados dos exércitos ganham olhos, sobrancelhas e boca, com expressões sorteadas.
- **Rosto só de frente ou em 3/4.** De perfil, o rosto colado na esfera vira "adesivo", então nos closes a cabeça vira para a câmera.
- **Senhor Sticker (mascote do canal):** corpo roxo, chapéu-coco roxo com faixa amarela e adesivo de estrela, gravata-borboleta amarela, botões amarelos e adesivos colados no corpo. Ele está em `config/senhor-sticker/fonte-3d/Marca.jsx`. Pode aparecer como o "terceiro personagem" ou num cameo.

---

## 4. Expressões e atuação de corpo

### 4.1 O catálogo
- **Olhos:** `normal`, `grande` (susto), `bravo`, `feliz`, `semi`, `tedio`, `triste`, `fechado`, `pisca`.
- **Bocas:**
  - `sorriso`, `sorrisoD` (sorriso com dentes), `grito` (oval com língua), `nervoso` (ondulada e tremendo), `brava` (meia-lua para baixo com dentes de cima)
  - `dentes`, `O`, `reta`, `canto`, `triste`, `fechado`

### 4.2 A linha do tempo de expressões (função `expr` em `LancaEscudo2.jsx`)
Cada personagem tem uma lista `[[tempo, {rosto}], ...]` presa às palavras (`TM`). Cada chave vale até a próxima.

Regras, todas aprendidas com erro:
1. **Mínimo de 0,23 s (7 quadros) por expressão.** Chaves mais próximas que isso são ignoradas. Na v12, a expressão trocava a cada quadro em 28,2 s.
2. **Toda troca passa por uma piscada de exatamente 2 quadros,** como no desenho. Piscada de 1 quadro parece glitch.
3. **Susto não pisca.** Um rosto com `semPisca: true` não pisca na troca nem na piscada natural, e isso vale tanto para o rosto antigo quanto para o novo.
4. **"Pop" na troca:** o olho cresce de 8% a 38% (`pop`) por 0,05 s e volta em 0,25 s.
5. **Piscada natural** dura cerca de 0,09 s a cada 2,6 s, com uma fase diferente por personagem.
6. **Micro-movimento:** sacadas de olho (`sacada`), sobrancelhas assimétricas, balanço leve da cabeça e respiração. Ninguém fica congelado, a não ser no "mundo travou", que é de propósito.
7. **A reação vem uma palavra depois do evento,** e o susto é exagerado: olho `grande`, sobrancelha −1, `trem` de 0,7 a 1, gota de suor.

### 4.3 Corpo (o que levou o item "corpo" de 7 para 9)
- **Grito:** quem grita inclina para a frente (`inc`) com o punho erguido. Quem ouve encolhe e recua. As curvas de `inc` usam keyframes com `kf`.
- **Recuo:** a personagem recua com pulinhos e os ombros encolhidos (`recuando`).
- **Resposta física à fala:** o escudo dá um empurrão no "fura!".
- **Antecipação e acomodação:** recua antes do golpe e balança depois (`settle(t, t0, amp)`, com seno amortecido).
- **Objeto na mão tem estado:**
  - A lança fica em pé ao lado do rei até o ataque e troca de posição em 7 quadros (`alto` e `deita`).
  - Ela só abaixa depois de pegar distância, então nunca atravessa o escudo.
  - Toda troca de pose de objeto é uma transição curta, nunca um salto.
- **Mão em repouso:** a transição sai de `maoRepouso(...)`, e não do zero, para não dar pulo.

---

## 5. Pipeline técnico

### 5.1 Stack
- Remotion 4, `@remotion/three` (R3F) e three r186, com `postprocessing`.
- Tudo é modelado em código: nada de IA de imagem, de modelo de vídeo ou de programa de animação.
- O Blender foi testado e rejeitado: levaria cerca de 18 h por vídeo. Só os aprendizados dele ficaram no traço (seção 7).
- **Estrutura do projeto** (copie `projeto-v17` como ponto de partida):
  - `src/LancaEscudo2.jsx`: a cena, com `TM`, câmera, personagens, cenário e legenda.
  - `src/toon2.jsx`: o kit.
  - `src/pos.jsx`: o pós-processamento.
  - `src/cinema.jsx`: desfoque e aquecimento.
  - `src/palavras.js`: o alinhamento das palavras.
  - `src/Root.jsx`: as composições.
  - `public/`: a fonte Montserrat embutida e a trilha.
  - `audio/mix2.py`: a mixagem.
- **Composição:** 1080x1920, 30 fps, 70 s (`DUR_LE2 = 70 * 30`).
- **Props de entrada:**
  - `dpr`: 1 para os testes, 2 para o final.
  - `semLegenda: true`: quadros sem legenda, usados na thumb.

### 5.2 Tempo vem da fala
- O `W_(palavra, n)` devolve o início da n-ésima ocorrência da palavra em `palavras.js`. O `TM` guarda todos os tempos-chave pelo nome.
- Câmera, expressões, efeitos e sons usam `TM.x ± desvio`. Se a voz muda, tudo se reajusta sozinho.

### 5.3 Render (no PC do Sebastião: RX 6700 XT, renderer `angle`)
- **Regra dos trechos primeiro.** Nas rodadas de teste, renderize só os quadros afetados (`--frames=a-b`) em dpr 2 e confira. O vídeo inteiro só sai quando os trechos passam. Com essa regra, um teste leva minutos e não 20.
- **Final:**

  ```
  npx remotion render src/index.js LancaEscudo2 out.mp4 --concurrency=8 --crf=14 --props='{"dpr":2}'
  ```

  Leva cerca de 21 min para 2100 quadros. O gargalo é a GPU, por causa do supersampling 2x.
- Uma cópia em crf 19 (cerca de 56 MB) vai para o Library e para o repo. A crf 14 fica no PC, em `~/Downloads/pera-estudo-referencia/`.
- **Quadros soltos e mosaicos:** `estudos/lanca-escudo/ferramentas/qs.sh nome f1 f2 ...`.
- **Na nuvem** só use stills, com `--gl=swangle`, porque o vídeo inteiro leva cerca de 30 min.
- O PC é acessado por Remote Control.

### 5.4 Qualidade de imagem
- Render a 2x com redução (supersampling) e SMAA por cima.
- O DOF roda **na resolução cheia** (`resolutionScale 1`). Em 720 ele borrava o contorno.
- **Contra z-fighting:** chão e ponte em alturas separadas e um corte de perto maior na câmera.
- **Contra sombra piscando:** o alvo da luz de sombra é fixo por cena e atualizado a cada quadro.

---

## 6. Câmera
1. **Um mundo só, com a câmera passeando:** travelling, grua e chicote. São cerca de 4 cortes secos em 16 s; o resto é movimento.
2. A câmera está sempre em movimento. Cada plano é uma lista de keyframes `[tempo, posição, alvo, fov]` em `PLANOS`, com fov entre 44 e 50.
3. **A câmera segue a ação.** Na corrida, `segueCorrida` acompanha o rei pelo x dele. No ninho, `segueNinho` acompanha o pássaro.
4. **Ninguém encosta na borda.** O personagem fica inteiro no quadro: na v11, o soldado velho ficava cortado pela metade e o rei encostava na borda. Punhos erguidos também ficam longe da borda.
5. **Plano aberto longo cansa.** Na espera, corte a cada batida da fala ("Um dia." "Uma semana." "Um ano inteiro.").
6. **No close de piada,** o objeto fica no terço central e a linha de visão fica livre.

---

## 7. Luz, cor e traço

### 7.1 Luz e cor
- O céu é azul em degradê e o sol dourado fica baixo, com sombras longas. As sombras são arroxeadas, nunca pretas.
- Cel de 2 tons, com oclusão de ambiente (N8AO).
- **Paleta:** um pouco menos saturada que a da v11, porque as bandeiras estouravam no vermelho. Use bandeira vermelha #D8323C, turquesa e verde e cinza-azulado nos metais.
- **Noite:**
  - Tingimento noturno no céu, nas placas pintadas e nas nuvens (`tingeNuvens(k)`, aplicado já na criação do material).
  - Cada ciclo de dia e noite dura pelo menos cerca de 0,5 s. Ciclo mais curto pisca.
  - Nunca deixe montanha de noite sob céu de dia.
- **"O mundo travou":** cena cinza e sem música, como um contraste forte.

### 7.2 Traço (pós-processamento `Contorno`, em `pos.jsx`)
- A cor é ameixa **#372C2E** (`LINHA`), nunca preto.
- As bordas vêm da profundidade e das normais, com largura constante em pixel na tela.
- **Peso de linha:**
  - linha fina de 0,8 px;
  - linha grossa de 1,55 px do lado da sombra, ponderada pela proximidade (`perto`) e pela luminância do objeto mais perto;
  - dobras internas de 0,6 px.
- **Aprendizados do piloto no Blender:**
  - largura constante em pixel;
  - mais grosso do lado da sombra;
  - sem linha dupla;
  - a linha some com a distância;
  - dobras;
  - nada de contorno em peças que já são linha.
- **Filete de luz (rim) de cerca de 2 px** em todas as silhuetas. Ele é desligado nas cores muito saturadas (`rim *= 1 - 0.75*smoothstep(0.35,0.55,satu)`).
- **Ordem da cadeia `PosToon`:** N8AO → Contorno (inclui rim e névoa creme em camadas) → DOF → HueSaturation → BrightnessContrast → Vignette → SMAA.
- **Sprites e Points (neve, brilho, poeira) não entram nos passes de normal e profundidade.** O hook em `THREE.Sprite.prototype.onBeforeRender` zera o drawRange nesses passes. Sem isso, aparece o contorno quadrado das placas transparentes.
- **Comentários dentro do GLSL são sempre `/* */`.** Um `//` já comentou uma linha inteira do shader e deu tela em branco.

### 7.3 Cenário
- **Fundo pintado (`FundoPintado`):**
  - Dois cilindros com pintura feita em canvas de 8192 px, sem traço e sem `depthWrite`.
  - Um tem vale e campos, o outro tem castelos e montanhas com vários picos e neve.
  - Os dois são tingidos à noite.
  - A resolução é dobrada para não dar faixas nem serrilhado nos picos.
- **Perto:** o mesmo carinho dos personagens. Por exemplo:
  - árvores, capim, flores, janelas e bandeiras nos castelos;
  - rio sinuoso com rampa de água e patinhos;
  - bigorna com chifre, barril com cintas e rebites, forja acesa;
  - moedas empilhando e sacos com a cor de cada rei;
  - trilha com textura e marcos de fronteira meio a meio.
- **Texto e placas como textura na cena** (`canvasTex`): "ANOS DE GUERRA", "MENTIRA!", a placa da espada.
- **Multidão:** milhares de soldados instanciados, todos com rosto.

---

## 8. Legenda
- Uma frase curta por vez, em grupos de palavras (`GRUPOS`).
- Fica no centro, em `top: 1300` e com 120 px de altura.
- **Fonte:** Montserrat Black embutida (`MontLE`, em `public/`), 80 px, branca, com contorno de 14 px #372C2E e sombra suave.
- Escrita em minúsculas, como no original, e com a grafia certa ("ferreiro", mesmo quando a voz lê "ferrreiro").
- Nunca confie na fonte instalada na máquina: no PC sem Montserrat, a v2 saiu com serifa.

---

## 9. Áudio

### 9.1 Voz (ElevenLabs, o único item pago)
- **Voz:** George, `JBFqnCBsd6RMkjVDRZzb`, com o modelo `eleven_v4` e `language_code: pt`.
- **Configuração:** `voice_settings: {stability: 0.5}`.
- **Endpoint:** `/v1/text-to-speech/{voz}/with-timestamps?output_format=mp3_44100_128`. A resposta já traz o alinhamento por caractere, e daí sai o `palavras.json`.
- **Custo:** uma geração única do texto inteiro custa cerca de 500 créditos para 70 s. Os testes de pronúncia ficam em frases curtas, de cerca de 15 a 20 créditos cada.
- Anote tudo em `log/cotas.md`.
- A v17 usou a voz sem aceleração. A v1 tinha `atempo=1.10`, mas no texto longo as tags já dão o ritmo.

### 9.2 Pausas (a lição da v17: "o áudio dá uma travada")
- As pausas dramáticas são inseridas depois da geração. Na v17 foram 4: depois de "dele!", depois de "outro.", no "travou…" (1,25 s) e depois de "dia.".
- **A pausa só entra em silêncio real, medido no RMS do áudio.** O fim da palavra no alinhamento erra em até 0,2 s. Na v16, cortar no fim do "travou" deixou solto o começo do "Po…rque".
- Cada corte e cada emenda leva um fade de 12 ms.
- **Onde a voz emenda as palavras, não ponha pausa,** porque ela soa como gaguejo. Na v16 isso aconteceu depois de "semana" e de "inteiro".
- **Remapeie o alinhamento:** `t' = t + soma(pausas antes de t)`. Gere de novo `palavras-final.json` e `src/palavras.js`.

### 9.3 Efeitos e trilha (`audio/mix2.py`, tudo CC0 ou de licença livre)
- Os efeitos vêm de `/mnt/project-files/acervo-sfx/`, lidos com `ferramentas/sfx.py`. Cada `put(arquivo, W('palavra') + desvio, ganho)` cai na palavra.
- **Mapa usado na v17:**

| Efeito | Arquivo | Onde cai |
|---|---|---|
| Brilho | `bell_02` / `bell_03` | "lança", "escudo", "arma", "espada" |
| Impacto metal | `metal_06`, `bfh1_metal_hit_05` | "qualquer", "nada", "encostou" |
| Entortar | `comedy-boing` | "furava" |
| Moeda | `money_money_24`, `coin_cluster`, `coin_double` | "rei", "contava", "dinheiro" |
| Batida seca | `wood_hit_01` | encarada, "MENTIRA!", placa |
| Chicote de câmera e passagem do tempo | `swish-11` | corte, "dia", "semana", "ano" |
| Contador virando | `button-46` (3x) | "cem", "cento" |
| Passos | `footstepsloop3_slow` / `fast` | marcha e corrida |
| Fofo | `cute_04` | patinhos |
| Preço | `retro_coin_01` | "metade" |

- **Trilha:** Mixkit "Playful" (`acervo-trilhas/mixkit/mixkit-10.mp3`), em loop, cerca de 15 dB abaixo da voz.
  - Ducking de 50% quando a voz fala.
  - Para de repente no "mundo travou" e volta com fade no "porque".
  - Fade-out de 1,2 s no fim.
- **Master:**
  - `loudnorm` e `volume`, depois `alimiter 0.84`.
  - Alvo de cerca de −14 LUFS (a v17 ficou em −14,4) e nenhum clipping.

### 9.4 Checagem de áudio (obrigatória antes de entregar)
Ouça e meça cada pausa e emenda. Procure:
- clique;
- corte seco;
- sílaba solta antes da pausa;
- trecho repetido;
- clipping.

Toda pausa precisa cair em silêncio real no espectro.

---

## 10. Método nota 10 (como manter o padrão)
O detalhe está em `METODO-QUALIDADE-10.md` e no doc "Método nota 10". O resumo:

1. **Rubrica de 10 itens, cada um de 0 a 10, com âncoras:**
   - traço, serrilhado, rosto, corpo;
   - cenário perto, cenário longe;
   - luz, câmera, piada, estabilidade.
2. **Nota às cegas:** quem avalia não é quem fez, e tem que ver crops em 4x. A v17 teve média 8,5, com corpo 9, estabilidade 10 e cenário longe 7.
3. **Portões automáticos antes de qualquer olho humano** (`estudos/lanca-escudo/qc/qc_animacao.py`):
   - detecta pop, pisca (flicker), tela parada e quadro isolado;
   - a grade de 2 quadros por segundo é conferida inteira.
4. **Golden frames:** quadros-chave aprovados servem de régua para o vídeo seguinte.
5. **Folha de elenco e quadros-chave antes do vídeo.** Corrija a proporção e o rosto num quadro só, e confira 5 quadros nos momentos das piadas.
6. **Fluxo por plano, não por vídeo:** trechos primeiro, vídeo inteiro só no fim.
7. **Lista de carinho por plano:**
   - rosto vivo, ninguém congelado;
   - nada atravessando nada;
   - ninguém na borda;
   - texto legível;
   - brilho e som na palavra.

---

## 11. Armadilhas já pagas (não repetir)
| Sintoma | Causa | Correção |
|---|---|---|
| Listras no chão | z-fighting | alturas separadas, corte de perto maior |
| Sombra piscando | alvo da luz móvel | alvo fixo por cena |
| Borda embaçada | DOF em 720 | DOF em resolução cheia |
| Quadrado em volta da neve, do brilho e da poeira | sprite e points nos passes de normal | hook `onBeforeRender` com drawRange |
| Tela em branco | `//` no GLSL | usar `/* */` |
| Símbolo duplicado no bundle | dois `rnd` | nomes únicos (`rndP`) |
| Clarão de noite | ciclo curto demais | ciclo de no mínimo cerca de 0,5 s |
| Montanha escura sob céu de dia | tingimento fora de sincronia | tingir céu, placas e nuvens juntos |
| Expressão piscando quadro a quadro | chaves próximas | mínimo de 0,23 s |
| Piscada de 1 quadro | arredondamento | sempre 2 quadros, nunca em susto |
| Anel duplo no olho | pálpebra maior que o olho | escala da pálpebra [1.0, 0.62, 0.46] |
| Lança atravessando o escudo | pose sem estado | lança em pé até o ataque, abaixa só depois do recuo |
| Sílaba solta antes da pausa | corte no fim do alinhamento | cortar só em silêncio medido |
| Fonte com serifa | fonte do sistema | fonte embutida em `public/` |
| Bandeira estourada | reforço de saturação | paleta menos saturada, rim desligado em cor saturada |
| yt-dlp bloqueado na nuvem | checagem de bot | baixar referência pelo PC (Remote Control) |

---

## 12. Título, descrição e thumb (padrão do canal de referência)
- **Título:**
  - de 24 a 45 caracteres, com cada palavra em maiúscula;
  - sem emoji e sem "?";
  - promete um segredo ou uma explicação com objeto concreto ("A vs B", "Por que…", "Como um…");
  - na v17: **"Lança que Fura Tudo vs Escudo que Nada Fura"**.
- **Descrição:** igual ao título.
- **Tags e hashtags:** nenhuma. A referência deixa tudo para o algoritmo. Categoria: Entretenimento.
- A referência publica Shorts de 56 a 66 s, um por dia.
- **Thumb 1080x1920:**
  - Um quadro do vídeo renderizado sem legenda (`--props='{"dpr":2,"semLegenda":true}' --frame=N`), escolhido com os dois rostos claros.
  - Texto em Montserrat Black com contorno #372C2E e sombra suave.
  - Em cima: a primeira metade do título, com a última linha em amarelo (255,214,64).
  - Embaixo: "VS" e a segunda metade, com a última linha em turquesa (78,214,206).
  - É composta com PIL.

---

## 13. Passo a passo para um vídeo novo
1. **História:** escreva uma original nos 9 blocos (seção 2), com cerca de 190 palavras e tags por frase. Faça a tabela palavra → evento visual → reação → som.
2. **Pronúncia:** teste em frases curtas os nomes difíceis e escolha a grafia pelo espectro.
3. **Voz:** uma geração única com timestamps. Anote os créditos em `log/cotas.md`.
4. **Pausas:** insira só em silêncio medido, com fade de 12 ms. Remapeie e gere `palavras-final.json` e `src/palavras.js`.
5. **Projeto:**
   - copie `projeto-v17` e renomeie a cena;
   - troque o `TM` pelas palavras novas;
   - monte a folha de elenco com os personagens novos a partir do `Boneco` e confira proporção e rostos em stills;
   - modele o cenário (perto em 3D, longe no `FundoPintado`).
6. **Animação:**
   - câmera em `PLANOS`;
   - expressões com `expr` (regras da seção 4.2);
   - corpo (seção 4.3);
   - efeitos nas palavras.
7. **Trechos primeiro:** renderize no PC só os quadros de cada piada, em dpr 2. Passe pela lista de carinho e pelo `qc_animacao.py`.
8. **Mix:** adapte o `mix2.py` (efeitos nas palavras, trilha com ducking, −14 LUFS). Faça a checagem de áudio da seção 9.4.
9. **Vídeo inteiro:** dpr 2, crf 14 (cerca de 21 min). Depois a grade de QC e a nota às cegas pela rubrica. Se algum item ficar abaixo de 9, volte ao passo 7 só no trecho afetado.
10. **Entrega:**
    - o mp4 em crf 19 vai para `/mnt/project-files/testes/<nome>/`;
    - junto vão a grade de QC, a thumb, `titulo-descricao.md` e um LEIA-ME com as notas;
    - depois, commit no repo em `estudos/<nome>/`.
11. Não publique sem a decisão do Sebastião.

---

## Apêndice A: texto da voz da v17
```
[excited] Um ferrreiro vendeu uma lança que furava qualquer coisa pra um rei, [mischievously] e um escudo que nada furava pro pior inimigo dele! [excited] Os dois reinos tavam em guerra fazia cem anos, e agora cada rei finalmente tinha a arma pra acabar com ela. [serious] Então os dois exércitos marcharam pro mesmo campo, a lança na frente de um, e o escudo na frente do outro. [excited] Os dois reis pararam cara a cara no meio da trilha. O vermelho gritou: essa lança fura qualquer coisa! E o verde gritou de volta: e esse escudo nada fura! [serious] Ele pegou distância, correu, mirou bem no meio do escudo, e no instante em que a ponta encostou... o mundo travou. [curious] Porque se a lança furasse, o escudo era mentira. E se o escudo aguentasse, a lança era mentira. [mischievously] Então os dois exércitos ficaram ali, parados, esperando alguém ganhar. Um dia. Uma semana. Um ano inteiro. [excited] Enquanto isso, lá na ponte, o ferrreiro contava o dinheiro dos dois reis, e já pendurava uma placa nova: espada que corta lança e escudo, pela metade do preço! [playfully] E o soldado velho? Só virou o contador pra cento e um.
```
