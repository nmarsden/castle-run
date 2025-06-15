import {Suspense} from 'react';
import {Canvas} from "@react-three/fiber";
import {Loader} from "@react-three/drei";
import Debug from "./debug.tsx";
import Performance from "./performance.tsx";
import Lights from "./lights.tsx";
import Camera from "./camera.tsx";
import Ground from "./ground.tsx";
import Player from "./player.tsx";
import Keyboard from './keyboard.tsx';
import PlayerBounds from './playerBounds.tsx';
import Enemies from './enemies.tsx';
import PowerUps from './powerUps.tsx';
import Ui from './ui/ui.tsx';
import Waves from './waves.tsx';
import Portal from './portal.tsx';
import { Bloom, EffectComposer } from '@react-three/postprocessing';
import { KernelSize, Resolution } from 'postprocessing'
import { GlobalState, useGlobalStore } from '../stores/useGlobalStore.ts';

export default function App() {
  const bloomEffect = useGlobalStore((state: GlobalState) => state.bloomEffect);

  return (
    <>
      <Debug />
      <Canvas
        gl={{ logarithmicDepthBuffer: true }}
        shadows={true}
      >
        <Suspense>
          <Performance />
          <Lights />
          <Camera />
          <Portal />
          <Ground />
          <Enemies />
          <PowerUps />
          <PlayerBounds />
          <Player />
          <Keyboard />
          <Waves />
          <EffectComposer enabled={bloomEffect}>
            <Bloom 
              intensity={0.125} 
              kernelSize={KernelSize.LARGE} // blur kernel size
              luminanceThreshold={0.9} // luminance threshold. Raise this value to mask out darker elements in the scene.
              luminanceSmoothing={0.025} // smoothness of the luminance threshold. Range is [0, 1]
              mipmapBlur={false} // Enables or disables mipmap blur.
              resolutionX={Resolution.AUTO_SIZE} // The horizontal resolution.
              resolutionY={Resolution.AUTO_SIZE} // The vertical resolution.              
            />
          </EffectComposer>
        </Suspense>
      </Canvas>
      <Ui />
      <Loader containerStyles={{ background: '#07046380' }}/>
    </>
  );
}

