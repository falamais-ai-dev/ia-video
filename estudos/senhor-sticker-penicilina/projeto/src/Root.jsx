import React from 'react';
import {Composition} from 'remotion';
import {Penicilina, DUR_PN} from './Penicilina';
export const Root = () => (
  <>
    <Composition id="Penicilina" component={Penicilina} durationInFrames={DUR_PN} fps={30} width={1080} height={1920} />
  </>
);
