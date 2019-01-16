type RequestIdleCallbackHandle = any;
type RequestIdleCallbackOptions = { timeout: number; };
export type RequestIdleCallbackDeadline = {
  readonly didTimeout: boolean;
  timeRemaining: (() => number);
};
export type tasks = any | [() => void] | [];

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
export default function scheduleTasks(tasks: tasks = [], isFIFO: boolean = false) {
  if (!Array.isArray(tasks) || tasks.length === 0) return;

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
