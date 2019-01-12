type RequestIdleCallbackHandle = any;
type RequestIdleCallbackOptions = { timeout: number; };
type RequestIdleCallbackDeadline = {
  readonly didTimeout: boolean;
  timeRemaining: (() => number);
};
declare global {
  interface Window {
    requestIdleCallback: ((
      callback: ((deadline: RequestIdleCallbackDeadline) => void),
      opts?: RequestIdleCallbackOptions,
    ) => RequestIdleCallbackHandle);
    cancelIdleCallback: ((handle: RequestIdleCallbackHandle) => void);
  }
}

// fallback shim implementation of the idleCallback
window.requestIdleCallback =
  window.requestIdleCallback ||
  function (cb) {
    const start = Date.now();
    return setTimeout(
      () => cb({
        didTimeout: false,
        timeRemaining: () => Math.max(0, 50 - (Date.now() - start)),
      }),
      1,
    );
  };

// Since we have at most 50ms idle periods,
// Last In First Out execution order is encouraged as selected by default.
export function scheduleTasks(tasks = [], isFIFO = false) {
  function nonEssentialWork(deadline: RequestIdleCallbackDeadline) {
    while (deadline.timeRemaining() > 0 && tasks.length > 0) {
      const task: any = tasks[isFIFO ? 'shift' : 'pop']();

      if (task) {
        task();
      }
    }

    if (tasks.length > 0) {
      window.requestIdleCallback(nonEssentialWork);
    }
  }

  window.requestIdleCallback(nonEssentialWork);
}
