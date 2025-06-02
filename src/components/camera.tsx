import {CameraControls, PerspectiveCamera} from "@react-three/drei";
import {useControls} from "leva";
import {ReactNode, useEffect, useRef} from "react";
import {PerspectiveCamera as PerspectiveCameraType, Vector3} from "three";

export default function Camera({ children } : { children?: ReactNode }) {
  const cameraControls = useRef<CameraControls>(null!);
  const fov = useRef(100);
  const cameraPosition = useRef<Vector3>(new Vector3(0, 4.2, 0.7));
  const cameraTarget = useRef<Vector3>(new Vector3(0, 0, -2.2));
  
  useEffect(() => {
    setTimeout(() => {
      cameraControls.current.setTarget(cameraTarget.current.x, cameraTarget.current.y, cameraTarget.current.z, true);
    }, 300);
  }, []);
  
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
        max: 200, 
        step: 0.1, 
        onChange: (value) => {
          cameraPosition.current.y = value;
          cameraControls.current.setPosition(cameraPosition.current.x, cameraPosition.current.y, cameraPosition.current.z);
        }
      },
      positionZ: { 
        value: cameraPosition.current.z, 
        label: 'positionZ', 
        min: 0, 
        max: 100, 
        step: 0.1,
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
        step: 0.1,
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
        far={200}
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
