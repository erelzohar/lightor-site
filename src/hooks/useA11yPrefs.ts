import { useSyncExternalStore } from 'react';
import { DEFAULT_PREFS, getA11yPrefs, subscribeA11yPrefs, subscribeSystemMotion, systemReducedMotion, type A11yPrefs } from '../services/a11yPrefs';

/** LT-357: the visitor's accessibility-menu choices, re-rendering on change. */
// The pages are drawn at build time with no choices made (LT-430, LT-579):
// the browser's first render matches that, then takes the visitor's.
export const useA11yPrefs = (): A11yPrefs => useSyncExternalStore(subscribeA11yPrefs, getA11yPrefs, () => DEFAULT_PREFS);

/**
 * LT-357: hold still - the device asks for less motion, or the visitor chose
 * "stop animations" in the menu. Live: flips the moment either changes.
 */
export const useStill = (): boolean => {
  const system = useSyncExternalStore(subscribeSystemMotion, systemReducedMotion, () => false);
  return useA11yPrefs().still || system;
};
