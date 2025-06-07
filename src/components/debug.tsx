import {Leva, useControls} from "leva";
import {useEffect, useRef, useState} from "react";
import {GlobalState, useGlobalStore} from "../stores/useGlobalStore";

export default function Debug (){
  const [hidden, setHidden] = useState(true);
  const [paused, setPaused] = useState(false);
  const colors = useGlobalStore((state: GlobalState) => state.colors);
  const setColors = useGlobalStore((state: GlobalState) => state.setColors);
  const groundSpeed = useGlobalStore((state: GlobalState) => state.groundSpeed);
  const setGroundSpeed = useGlobalStore((state: GlobalState) => state.setGroundSpeed);

  const initialGroundSpeed = useRef(groundSpeed);  

  useEffect(() => {
    if (paused) {
      setGroundSpeed(0);
    } else {
      setGroundSpeed(initialGroundSpeed.current)
    }
  }, [paused]);

  useControls(
    'Colors',
    {
      ground: { value: colors.ground, onChange: value => setColors({ ...colors, ground: value }) },
      player: { value: colors.player, onChange: value => setColors({ ...colors, player: value }) },
      enemy:  { value: colors.enemy,  onChange: value => setColors({ ...colors, enemy: value }) },
      threat: { value: colors.threat, onChange: value => setColors({ ...colors, threat: value }) }
    }
  );

  useEffect(() => {
    if (window.location.hash === '#debug') {
      setHidden(false)
    }
    window.addEventListener('keydown', (event: KeyboardEvent) => {
      if (event.key === 'd') {
        setHidden(hidden => !hidden);
      } else if (event.key === 'p') {
        setPaused(paused => !paused);
      }
    });
  }, []);

  return (
    <Leva hidden={hidden} />
  )
}