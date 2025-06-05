import {useCallback, useEffect, useState} from "react";
import { GlobalState, useGlobalStore } from "../stores/useGlobalStore";

export type Action = {
  moveLeft: boolean;
  moveRight: boolean;
  moveForward: boolean;
  moveBackward: boolean;
};

export type ActionField = keyof Action;

const Keyboard = () => {
  const setPlayerAction = useGlobalStore((state: GlobalState) => state.setPlayerAction);

  const keys = new Map<string, ActionField>([
    ['ArrowLeft', 'moveLeft'],
    ['ArrowRight', 'moveRight'],
    ['ArrowUp', 'moveForward'],
    ['ArrowDown', 'moveBackward']
  ]);

  const actionFieldByKey = (key: string): ActionField | undefined => keys.get(key);

  const [action, setAction] = useState<Action>({
    moveLeft: false,
    moveRight: false,
    moveForward: false,
    moveBackward: false
  });

  useEffect(() => {
    if (action.moveLeft) {
      setPlayerAction('MOVE_LEFT');
      return;
    }
    if (action.moveRight) {
      setPlayerAction('MOVE_RIGHT');
      return;
    }
    if (action.moveForward) {
      setPlayerAction('MOVE_FORWARD');
      return;
    }
    if (action.moveBackward) {
      setPlayerAction('MOVE_BACKWARD');
      return;
    }
    setPlayerAction('NONE');
  }, [action])

  const setActionValue = useCallback((keyCode: string, isKeyDown: boolean) => {
    setAction((m) => {
      return actionFieldByKey(keyCode) ? ({ ...m, [actionFieldByKey(keyCode) as string]: isKeyDown }) : m;
    })
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      setActionValue(e.code, true);
    };
    const handleKeyUp = (e: KeyboardEvent) => {
      setActionValue(e.code, false);
    };
    document.addEventListener('keydown', handleKeyDown)
    document.addEventListener('keyup', handleKeyUp)
    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      document.removeEventListener('keyup', handleKeyUp)
    }
  }, [])
  return <></>;
}

export default Keyboard;