import Enemy from "./enemy";
import { EnemyInfo, GlobalState, useGlobalStore } from "../stores/useGlobalStore";
import { useMemo } from "react";

export default function Enemies (){
  const generatedWaves = useGlobalStore((state: GlobalState) => state.generatedWaves);
  const playCount = useGlobalStore((state: GlobalState) => state.playCount);

  const enemies: EnemyInfo[] = useMemo(() => {
    const enemies = [...generatedWaves.values()].flatMap(wave => wave.enemies);

    // console.log('# enemies = ', enemies.length);
    // console.log('enemy ids = ', enemies.map(enemy => enemy.id));

    // const threats = enemies.flatMap(enemy => enemy.threats);

    // console.log('# threats = ', threats.length);
    // console.log('threat ids = ', threats.map(threat => threat.id));

    return enemies;

  }, [generatedWaves]);

  return (
    <>
      {enemies.map((enemy, index) => (
        <group key={`enemy-${playCount}-${enemy.id}`} renderOrder={index}>
          <Enemy {...enemy} />
        </group>
      ))}
    </>
  );
}