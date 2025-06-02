import {Suspense} from 'react';
import {Canvas} from "@react-three/fiber";
import {Loader} from "@react-three/drei";
import Debug from "./debug.tsx";
import Performance from "./performance.tsx";
import Lights from "./lights.tsx";
import Camera from "./camera.tsx";
import Ground from "./ground.tsx";
import Enemy from './enemy.tsx';
import Player from "./player.tsx";

export default function App() {
  return (
    <>
      <Debug />
      <Canvas
        shadows={true}
      >
        <Suspense>
          <Performance />
          <Lights />
          <Camera />
          <Ground />
          <Enemy position={[0, 0, -9]}/>
          <Enemy position={[-2, 0, -9]}/>
          <Enemy position={[2, 0, -9]}/>
          <Enemy position={[0, 0, -2]}/>
          <Enemy position={[-2, 0, -2]}/>
          <Enemy position={[2, 0, -2]}/>
          <Player />
        </Suspense>
      </Canvas>
      <Loader containerStyles={{ background: '#07046380' }}/>
    </>
  );
}

