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
import Touch from './touch.tsx';
import PlayerBounds from './playerBounds.tsx';
import Enemies from './enemies.tsx';
import PowerUps from './powerUps.tsx';
import Ui from './ui/ui.tsx';
import Background from './background.tsx';
import BloomEffect from './bloomEffect.tsx';
import Explosion from './explosion.tsx';

export default function App() {
  return (
    <>
      <Debug />
      <Canvas
        gl={{ logarithmicDepthBuffer: false }}
        shadows={true}
      >
        <Suspense>
          <Performance />
          <Lights />
          <Camera>
            <Touch />
          </Camera>
          <Background />
          <Ground />
          <Enemies />
          <PowerUps />
          <PlayerBounds />
          <Player />
          <Explosion />
          <Keyboard />
          <BloomEffect />
        </Suspense>
      </Canvas>
      <Ui />
      <Loader containerStyles={{ background: '#0A0A0A' }}/>
    </>
  );
}

