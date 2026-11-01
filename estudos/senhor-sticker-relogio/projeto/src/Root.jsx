import React from 'react';
import {Composition} from 'remotion';
import {Relogio, DUR_RL} from './Relogio';
export const Root = () => (
  <>
    <Composition id="Relogio" component={Relogio} durationInFrames={DUR_RL} fps={30} width={1080} height={1920} />
  </>
);
