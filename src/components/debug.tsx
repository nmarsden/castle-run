import {Leva, useControls} from "leva";
import {useEffect, useState} from "react";
import {GlobalState, useGlobalStore} from "../stores/useGlobalStore";

export default function Debug (){
  const [hidden, setHidden] = useState(true);
  const colors = useGlobalStore((state: GlobalState) => state.colors);
  const setColors = useGlobalStore((state: GlobalState) => state.setColors);

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
      }
    });
  }, []);

  return (
    <Leva hidden={hidden} />
  )
}