import React from 'react';
import {Composition} from 'remotion';
import {Ideia, DUR_ID} from './Ideia';
export const Root = () => (
  <>
    <Composition id="Ideia" component={Ideia} durationInFrames={DUR_ID} fps={30} width={1080} height={1920} />
  </>
);
