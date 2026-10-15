import { useSyncExternalStore } from 'react';
import { getA11yPrefs, subscribeA11yPrefs, subscribeSystemMotion, systemReducedMotion, type A11yPrefs } from '../services/a11yPrefs';

/** LT-357: the visitor's accessibility-menu choices, re-rendering on change. */
export const useA11yPrefs = (): A11yPrefs => useSyncExternalStore(subscribeA11yPrefs, getA11yPrefs, getA11yPrefs);

/**
 * LT-357: hold still - the device asks for less motion, or the visitor chose
 * "stop animations" in the menu. Live: flips the moment either changes.
 */
export const useStill = (): boolean => {
  const system = useSyncExternalStore(subscribeSystemMotion, systemReducedMotion, () => false);
  return useA11yPrefs().still || system;
};
