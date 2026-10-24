// Rolo de demonstração: as 4 cenas em sequência, com transições.
import React from 'react';
import {TransitionSeries, linearTiming, springTiming} from '@remotion/transitions';
import {slide} from '@remotion/transitions/slide';
import {wipe} from '@remotion/transitions/wipe';
import {D1_DUR} from './D1Pares';
import {D2Calendario, D2_DUR} from './D2Calendario';
import {D3Grafico, D3_DUR} from './D3Grafico';
import {D4Parallax, D4_DUR} from './D4Parallax';
import {D5Estilhaco} from './D5Estilhaco';

const T = 12;
export const REEL_DUR = D4_DUR + D1_DUR + D2_DUR + D3_DUR - 2 * T;
export const Reel = () => (
  <TransitionSeries>
    <TransitionSeries.Sequence durationInFrames={D4_DUR}><D4Parallax /></TransitionSeries.Sequence>
    {/* corte seco para o estilhaço: o D5 começa com o último quadro do D4 */}
    <TransitionSeries.Sequence durationInFrames={D1_DUR}><D5Estilhaco /></TransitionSeries.Sequence>
    <TransitionSeries.Transition presentation={slide({direction: 'from-bottom'})} timing={springTiming({config: {damping: 200}, durationInFrames: T})} />
    <TransitionSeries.Sequence durationInFrames={D2_DUR}><D2Calendario /></TransitionSeries.Sequence>
    <TransitionSeries.Transition presentation={wipe({direction: 'from-left'})} timing={linearTiming({durationInFrames: T})} />
    <TransitionSeries.Sequence durationInFrames={D3_DUR}><D3Grafico /></TransitionSeries.Sequence>
  </TransitionSeries>
);
