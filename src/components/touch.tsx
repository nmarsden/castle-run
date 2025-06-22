import {useDrag} from "@use-gesture/react";
import {GlobalState, useGlobalStore} from "../stores/useGlobalStore";

export default function Touch() {
  const setPlayerAction = useGlobalStore((state: GlobalState) => state.setPlayerAction);

  const bind = useDrag(
    ({ swipe: [swipeX, swipeY], last }) => {

      if (last && swipeX === -1) {
        setPlayerAction('MOVE_LEFT');
        setTimeout(() => setPlayerAction('NONE'), 200);
        return;
      }
      if (last && swipeX === +1) {
        setPlayerAction('MOVE_RIGHT');
        setTimeout(() => setPlayerAction('NONE'), 200);
        return;
      }
      if (last && swipeY === +1) {
        setPlayerAction('MOVE_BACKWARD');
        setTimeout(() => setPlayerAction('NONE'), 200);
        return;
      }
      if (last && swipeY === -1) {
        setPlayerAction('MOVE_FORWARD');
        setTimeout(() => setPlayerAction('NONE'), 200);
        return;
      }
    },
    {
      threshold: 5,
      axis: 'lock',
      filterTaps: true,      
      swipe: {
        distance: [50, 50],   // Minimum distance for a swipe
        velocity: [0.2, 0.2], // Minimum velocity for a swipe
        duration: 250,        // Maximum duration for a swipe
      },
    }
  );

  return (
    <>
      <mesh 
        position={[0, 0, -2]} 
        {...bind()}
      >
        <planeGeometry args={[10, 10]} />
        <meshStandardMaterial
          color={"red"}
          opacity={0}
          transparent={true}
          depthWrite={false}
        />
      </mesh>
    </>
  )
}
