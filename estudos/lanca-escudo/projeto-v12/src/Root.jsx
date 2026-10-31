import React from 'react';
import {Composition, Still} from 'remotion';
import {LancaEscudo, DUR_LE} from './LancaEscudo';
import {Elenco} from './Elenco';
import {LancaEscudo2, DUR_LE2} from './LancaEscudo2';
export const Root = () => (
  <>
    <Composition id="LancaEscudo" component={LancaEscudo} durationInFrames={DUR_LE} fps={30} width={1080} height={1920} />
    <Composition id="Elenco" component={Elenco} durationInFrames={60} fps={30} width={1080} height={1920} />
    <Composition id="LancaEscudo2" component={LancaEscudo2} durationInFrames={DUR_LE2} fps={30} width={1080} height={1920} />
  </>
);
