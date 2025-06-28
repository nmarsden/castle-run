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
      background1:    { value: colors.background1,    onChange: value => setColors({ ...colors, background1: value }) },
      background2:    { value: colors.background2,    onChange: value => setColors({ ...colors, background2: value }) },
      player1:        { value: colors.player1,        onChange: value => setColors({ ...colors, player1: value }) },
      player2:        { value: colors.player2,        onChange: value => setColors({ ...colors, player2: value }) },
      playerFlash:    { value: colors.playerFlash,    onChange: value => setColors({ ...colors, playerFlash: value }) },
      thruster:       { value: colors.thruster,       onChange: value => setColors({ ...colors, thruster: value }) },
      ground:         { value: colors.ground,         onChange: value => setColors({ ...colors, ground: value }) },
      enemy:          { value: colors.enemy,          onChange: value => setColors({ ...colors, enemy: value }) },
      threat1:        { value: colors.threat1,        onChange: value => setColors({ ...colors, threat1: value }) },
      threat2:        { value: colors.threat2,        onChange: value => setColors({ ...colors, threat2: value }) },
      threatHit:      { value: colors.threatHit,      onChange: value => setColors({ ...colors, threatHit: value }) },
      health1:        { value: colors.health1,        onChange: value => setColors({ ...colors, health1: value }) },
      health2:        { value: colors.health2,        onChange: value => setColors({ ...colors, health2: value }) },
      healthContainer:{ value: colors.healthContainer,onChange: value => setColors({ ...colors, healthContainer: value }) },
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

  useControls(
    'Ground',
    {
      speed: { value: groundSpeed, min: 0.0, max: 10.0, step: 0.01, onChange: value => setGroundSpeed(value) },
    }
  );

  useEffect(() => {
    if (window.location.hash === '#debug') {
      setHidden(false)
    }
    window.addEventListener('keydown', (event: KeyboardEvent) => {
      if (event.key === 'd') {
        setHidden(hidden => !hidden);
      // } else if (event.key === 'p') {
      //   setPaused(paused => !paused);
      } else if (event.key === 's') {
        toggleSoundFx();
      }
    });
  }, []);

  return (
    <Leva hidden={hidden} />
  )
}