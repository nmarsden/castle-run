import {CameraControls, PerspectiveCamera} from "@react-three/drei";
import {useControls} from "leva";
import {ReactNode, useEffect, useRef} from "react";
import {PerspectiveCamera as PerspectiveCameraType, Vector3} from "three";
import {GlobalState, useGlobalStore} from "../stores/useGlobalStore";

export default function Camera({ children } : { children?: ReactNode }) {
  const playerZOffset = useGlobalStore((state: GlobalState) => state.playerZOffset);
  const cameraControls = useRef<CameraControls>(null!);
  const fov = useRef(100);
  const cameraTarget = useRef<Vector3>(new Vector3(0, 0, 1 - 2));
  const cameraPositionPresets = useRef<Map<number, Vector3>>(new Map<number, Vector3>([
    [2,  new Vector3(0, 3.5, -2 + 1)],
    [1,  new Vector3(0, 3.5, -1 + 1)],
    [0,  new Vector3(0, 3.5, 0 + 1)],
    [-1, new Vector3(0, 3.5, 1 + 1)],
    [-2, new Vector3(0, 3.5, 2 + 1)],
  ]));
  const cameraPosition = useRef<Vector3>(cameraPositionPresets.current.get(playerZOffset) as Vector3);

  useEffect(() => {
    setTimeout(() => {
      cameraControls.current.setTarget(cameraTarget.current.x, cameraTarget.current.y, cameraTarget.current.z, true);
    }, 300);
  }, []);

  useEffect(() => {
    const camPos = cameraPositionPresets.current.get(playerZOffset) as Vector3;
    cameraTarget.current.setZ(camPos.z - 2); 

    cameraControls.current.setPosition(camPos.x, camPos.y, camPos.z, true);
    cameraControls.current.setTarget(cameraTarget.current.x, cameraTarget.current.y, cameraTarget.current.z, true);
  }, [playerZOffset]);

  useControls(
    'Camera',
    {
      fov: { 
        value: fov.current, 
        label: 'fov', 
        min: 0, 
        max: 100, 
        step: 0.1,
        onChange: (value) => {
          (cameraControls.current.camera as PerspectiveCameraType).fov = value;
          (cameraControls.current.camera as PerspectiveCameraType).updateProjectionMatrix();
        }
      },
      positionY: { 
        value: cameraPosition.current.y, 
        label: 'positionY', 
        min: 0, 
        max: 50, 
        step: 0.01, 
        onChange: (value) => {
          cameraPosition.current.y = value;
          cameraControls.current.setPosition(cameraPosition.current.x, cameraPosition.current.y, cameraPosition.current.z);
        }
      },
      positionZ: { 
        value: cameraPosition.current.z, 
        label: 'positionZ', 
        min: -20, 
        max: 10, 
        step: 0.01,
        onChange: (value) => {
          cameraPosition.current.z = value;
          cameraControls.current.setPosition(cameraPosition.current.x, cameraPosition.current.y, cameraPosition.current.z);
        }
      },
      targetZ: { 
        value: cameraTarget.current.z, 
        label: 'targetZ', 
        min: -10, 
        max: 0, 
        step: 0.01,
        onChange: (value) => {
          cameraTarget.current.z = value;
          cameraControls.current.setTarget(cameraTarget.current.x, cameraTarget.current.y, cameraTarget.current.z);
        }
      }
    },
    {
      collapsed: true
    }
  );

  return (
    <>
      <PerspectiveCamera
        makeDefault={true}
        fov={fov.current}
        near={0.1}
        far={20}
        position={[cameraPosition.current.x, cameraPosition.current.y, cameraPosition.current.z]}
        rotation-x={Math.PI * -0.25}
      >
        { children }
      </PerspectiveCamera>
      <CameraControls 
        ref={cameraControls}
        // truckSpeed={0}
        // minPolarAngle={0}
        // maxPolarAngle={Math.PI * 0.45}
        // minDistance={0.1}
        // maxDistance={71.0}
        // draggingSmoothTime={0.3}
      />
    </>
  );
}
