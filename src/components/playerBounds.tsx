import { useMemo, useRef } from "react";
import { Vector3 } from "three";
import { Line } from "@react-three/drei";

export default function PlayerBounds() {
  const lineRef = useRef<typeof Line | null>(null!);
  const lineWidth = useRef(0.2);

  const { linePoints } = useMemo(() => {
    const lineWidthOffset = lineWidth.current * 0.2
    const bounds = { 
      left: -(2.5 + lineWidthOffset),
      right: 2.5 + lineWidthOffset,
      back: 1.5 + lineWidthOffset,
      forward: -(3.5 + lineWidthOffset)
    };
    const linePoints = []
    linePoints.push(new Vector3(bounds.left, 0, bounds.forward));
    linePoints.push(new Vector3(bounds.left, 0, bounds.back));
    linePoints.push(new Vector3(bounds.right, 0, bounds.back));
    linePoints.push(new Vector3(bounds.right, 0, bounds.forward));
    linePoints.push(new Vector3(bounds.left, 0, bounds.forward));
    linePoints.forEach(point => {
      point.add({ x: 0, y: -0.45 + lineWidthOffset, z: 0 });
    })

    return { linePoints };
  }, []);

  return (
    <Line
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-expect-error
      ref={lineRef} 
      points={linePoints}
      lineWidth={lineWidth.current}
      worldUnits={true}
      opacity={0.9}
      transparent={true}
      color={"#BABABA"}
    />
  )
}