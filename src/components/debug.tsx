import {Leva, useControls} from "leva";
import {useEffect, useRef, useState} from "react";
import {GlobalState, useGlobalStore} from "../stores/useGlobalStore";

export default function Debug (){
  const [hidden, setHidden] = useState(true);
  const [paused, setPaused] = useState(false);
  const colors = useGlobalStore((state: GlobalState) => state.colors);
  const setColors = useGlobalStore((state: GlobalState) => state.setColors);
  const bloomEffect = useGlobalStore((state: GlobalState) => state.bloomEffect);
  const setBloomEffect = useGlobalStore((state: GlobalState) => state.setBloomEffect);
  const emissiveIntensity = useGlobalStore((state: GlobalState) => state.emissiveIntensity);
  const setEmissiveIntensity = useGlobalStore((state: GlobalState) => state.setEmissiveIntensity);
  const groundSpeed = useGlobalStore((state: GlobalState) => state.groundSpeed);
  const setGroundSpeed = useGlobalStore((state: GlobalState) => state.setGroundSpeed);
  const toggleSoundFx = useGlobalStore((state: GlobalState) => state.toggleSoundFx);  

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
      ground:         { value: colors.ground,         onChange: value => setColors({ ...colors, ground: value }) },
      player:         { value: colors.player,         onChange: value => setColors({ ...colors, player: value }) },
      playerFlash:    { value: colors.playerFlash,    onChange: value => setColors({ ...colors, playerFlash: value }) },
      enemy:          { value: colors.enemy,          onChange: value => setColors({ ...colors, enemy: value }) },
      threat:         { value: colors.threat,         onChange: value => setColors({ ...colors, threat: value }) },
      threatFlash:    { value: colors.threatFlash,    onChange: value => setColors({ ...colors, threatFlash: value }) },
      healthOn:       { value: colors.healthOn,       onChange: value => setColors({ ...colors, healthOn: value }) },
      healthOff:      { value: colors.healthOff,      onChange: value => setColors({ ...colors, healthOff: value }) },
      powerUpHealth:  { value: colors.powerUpHealth,  onChange: value => setColors({ ...colors, powerUpHealth: value }) },
    }
  );

  useControls(
    'Bloom',
    {
      enabled:           { value: bloomEffect, onChange: value => setBloomEffect(value) },
      emissiveIntensity: { value: emissiveIntensity, min: 0.0, max: 10.0, step: 0.01, onChange: value => setEmissiveIntensity(value) }
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
      } else if (event.key === 's') {
        toggleSoundFx();
      }
    });
  }, []);

  return (
    <Leva hidden={hidden} />
  )
}