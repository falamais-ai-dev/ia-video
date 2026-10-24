import React from 'react';
import {Composition} from 'remotion';
import {D1Pares, D1_DUR} from './D1Pares';
import {D2Calendario, D2_DUR} from './D2Calendario';
import {D3Grafico, D3_DUR} from './D3Grafico';
import {D4Parallax, D4_DUR} from './D4Parallax';
import {D5Estilhaco, D5_DUR} from './D5Estilhaco';
import {Reel, REEL_DUR} from './Reel';
const c = {fps: 30, width: 1080, height: 1920};
export const Root = () => (
  <>
    <Composition id="D1Pares" component={D1Pares} durationInFrames={D1_DUR} {...c} />
    <Composition id="D2Calendario" component={D2Calendario} durationInFrames={D2_DUR} {...c} />
    <Composition id="D3Grafico" component={D3Grafico} durationInFrames={D3_DUR} {...c} />
    <Composition id="D4Parallax" component={D4Parallax} durationInFrames={D4_DUR} {...c} />
    <Composition id="D5Estilhaco" component={D5Estilhaco} durationInFrames={D5_DUR} {...c} />
    <Composition id="Reel" component={Reel} durationInFrames={REEL_DUR} {...c} />
  </>
);
