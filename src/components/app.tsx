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

export default function App() {
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
        </Suspense>
      </Canvas>
      <Ui />
      <Loader containerStyles={{ background: '#07046380' }}/>
    </>
  );
}

