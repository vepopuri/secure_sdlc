// Shared helper for the mock service layer. Every service function returns a
// Promise so call sites already match the shape a real fetch()-backed
// implementation would have — swapping the body for an HTTP call later
// should not require touching any component.

export function withLatency<T>(value: T, ms = 220): Promise<T> {
  return new Promise((resolve) => {
    setTimeout(() => resolve(value), ms);
  });
}

export function simulateOutcome<T>(value: T, failureRate = 0.08, ms = 400): Promise<T> {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (Math.random() < failureRate) {
        reject(new Error('Demo mode: simulated connector timeout. This did not call a real system.'));
      } else {
        resolve(value);
      }
    }, ms);
  });
}
