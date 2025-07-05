import { Bloom, EffectComposer } from '@react-three/postprocessing';
import { KernelSize, Resolution } from 'postprocessing'
import { GlobalState, useGlobalStore } from '../stores/useGlobalStore.ts';
import { useControls } from 'leva';

export default function BloomEffect() {
  const bloomEffect = useGlobalStore((state: GlobalState) => state.bloomEffect);
  const setBloomEffect = useGlobalStore((state: GlobalState) => state.setBloomEffect);
  const emissiveIntensity = useGlobalStore((state: GlobalState) => state.emissiveIntensity);
  const setEmissiveIntensity = useGlobalStore((state: GlobalState) => state.setEmissiveIntensity);
    
  const mipmapBlur = useControls(
    'Bloom',
    {
      enabled:           { value: bloomEffect, onChange: value => setBloomEffect(value) },
      mipmapBlur:        { value: false },
      emissiveIntensity: { value: emissiveIntensity, min: 0.0, max: 50.0, step: 0.01, onChange: value => setEmissiveIntensity(value) }
    }
  );

  return (
    <EffectComposer enabled={bloomEffect}>
      <Bloom 
        intensity={0.125} 
        kernelSize={KernelSize.LARGE} // blur kernel size
        luminanceThreshold={0.9} // luminance threshold. Raise this value to mask out darker elements in the scene.
        luminanceSmoothing={0.025} // smoothness of the luminance threshold. Range is [0, 1]
        mipmapBlur={mipmapBlur} // Enables or disables mipmap blur.
        resolutionX={Resolution.AUTO_SIZE} // The horizontal resolution.
        resolutionY={Resolution.AUTO_SIZE} // The vertical resolution.              
      />
    </EffectComposer>
  );
}

