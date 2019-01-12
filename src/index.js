"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// fallback shim implementation of the idleCallback
window.requestIdleCallback =
    window.requestIdleCallback ||
        function (cb) {
            var start = Date.now();
            return setTimeout(function () { return cb({
                didTimeout: false,
                timeRemaining: function () { return Math.max(0, 50 - (Date.now() - start)); },
            }); }, 1);
        };
function scheduleTasks(tasks, isFIFO) {
    if (tasks === void 0) { tasks = []; }
    if (isFIFO === void 0) { isFIFO = false; }
    function nonEssentialWork(deadline) {
        while (deadline.timeRemaining() > 0 && tasks.length > 0) {
            var task = tasks[isFIFO ? 'shift' : 'pop']();
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
exports.scheduleTasks = scheduleTasks;
