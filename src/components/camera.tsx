import {CameraControls, PerspectiveCamera} from "@react-three/drei";
import {useControls} from "leva";
import {ReactNode, useEffect, useRef} from "react";
import {Group, PerspectiveCamera as PerspectiveCameraType, Vector3} from "three";
import {GlobalState, useGlobalStore} from "../stores/useGlobalStore";
import gsap from "gsap";

export default function Camera({ children } : { children?: ReactNode }) {
  const playerZOffset = useGlobalStore((state: GlobalState) => state.playerZOffset);
  const threatHitId = useGlobalStore((state: GlobalState) => state.threatHitId);

  const cameraGroup = useRef<Group>(null!);
  const cameraControls = useRef<CameraControls>(null!);

  const fov = useRef(40);
  const cameraPosition = useRef<Vector3>(new Vector3(0, 5, 10));
  const cameraTarget = useRef<Vector3>(new Vector3(0, 0, -4));

  useEffect(() => {
    setTimeout(() => {
      cameraControls.current.setTarget(cameraTarget.current.x, cameraTarget.current.y, cameraTarget.current.z, true);
    }, 300);
  }, []);

  useEffect(() => {
    const newCamPos = cameraPosition.current.clone();
    newCamPos.z = newCamPos.z + playerZOffset;

    const newCamTarget = cameraTarget.current.clone();
    newCamTarget.z = newCamTarget.z + playerZOffset;

    cameraControls.current.setPosition(newCamPos.x, newCamPos.y, newCamPos.z, true);
    cameraControls.current.setTarget(newCamTarget.x, newCamTarget.y, newCamTarget.z, true);
    
  }, [playerZOffset, cameraPosition, cameraTarget]);

  useEffect(() => {
    if (threatHitId !== '') {
      // Hit Threat - Shake camera group
      gsap.to(
        cameraGroup.current.position,
        { 
          keyframes: [
            { x: 0.05 },
            { x: -0.05 }
          ],
          duration: 0.075, 
          ease: "power1.inOut",
          repeat: 5,
          onComplete: () => {
            cameraGroup.current.position.x = 0;
          }
        }
      );      
    }
  }, [threatHitId]);

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
      <group ref={cameraGroup}>
        <PerspectiveCamera
          makeDefault={true}
          fov={fov.current}
          near={0.1}
          far={150}
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
      </group>
    </>
  );
}
