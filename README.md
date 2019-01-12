
<h1 align="center">
  <img
      src="https://developers.google.com/web/updates/images/2015-08-27-using-requestidlecallback/frame.jpg"
      alt="bta"
      title="bta"
      width="500"
  >
</h1>
<p align="center" style="font-size: 1.2rem;">
    Execute background tasks on main thread's idle periods
</p>


>Task scheduler api which executes given tasks during main thread's idle periods by using
[**window.requestIdleCallback**](https://developer.mozilla.org/en-US/docs/Web/API/Window/requestIdleCallback) method.
As long as tasks exists, each will be scheduled for the next idle period.

## Installation

```sh
npm install background-tasks-api --save
```

## Usage
```js
Import scheduleTasks from 'background-tasks-api';

var nonEssentialWork1 = () => {/* do something */};
var nonEssentialWork2 = () => {/* do something */};
var tasks = [ nonEssentialWork1, nonEssentialWork2 ];
var isFIFO = false;

scheduleTasks(tasks, isFIFO);
```

## API
`background-tasks-api` accepts two parameters:

* `tasks`: An *array* of functions which are going to be executed on main thread's idle periods.
* `isFIFO`: A *boolean* to decide task execution order. Defaults to *false*.

## Notes

In order to use it efficiently, it is crucial to have multiple small partitioned tasks, instead of long-running ones
as each idle period has at most 50ms deadlines. Tasks will be executed in *Last In First Out Order* by default.


# License

Licensed under the MIT License, Copyright © 2019-present.

See [LICENSE](./LICENSE) for more information.
