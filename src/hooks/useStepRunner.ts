import { useState } from 'react';

/**
 * Drives a client-side "live" step progression for a fixed number of steps,
 * one step per tick. Used to visually animate a run without a real backend —
 * pair it with a callback that persists each step transition via a service.
 */
export function useStepRunner(stepCount: number, intervalMs = 900) {
  const [runIndex, setRunIndex] = useState(-1);
  const [running, setRunning] = useState(false);

  function start(onStep?: (index: number) => void) {
    if (stepCount <= 0) return;
    setRunning(true);
    setRunIndex(0);
    onStep?.(0);
    let i = 0;
    const interval = setInterval(() => {
      i += 1;
      setRunIndex(i);
      onStep?.(i);
      if (i >= stepCount - 1) {
        clearInterval(interval);
        setRunning(false);
      }
    }, intervalMs);
  }

  return { runIndex, running, start };
}
