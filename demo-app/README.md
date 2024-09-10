# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type aware lint rules:

- Configure the top-level `parserOptions` property like this:

```js
export default {
  // other rules...
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
    project: ['./tsconfig.json', './tsconfig.node.json'],
    tsconfigRootDir: __dirname,
  },
}
```

- Replace `plugin:@typescript-eslint/recommended` to `plugin:@typescript-eslint/recommended-type-checked` or `plugin:@typescript-eslint/strict-type-checked`
- Optionally add `plugin:@typescript-eslint/stylistic-type-checked`
- Install [eslint-plugin-react](https://github.com/jsx-eslint/eslint-plugin-react) and add `plugin:react/recommended` & `plugin:react/jsx-runtime` to the `extends` list




Generator Functions:

Declarative Nature: Generator functions allow you to write asynchronous code in a synchronous style. Using yield, you can pause the function execution and wait for the result of an asynchronous operation, making the code easier to read and reason about.
Step-by-Step Execution: The yield keyword provides a clear, step-by-step execution flow, which is particularly useful for complex asynchronous logic involving multiple steps, retries, or conditional flows.

Promise-Based Functions:

Imperative Nature: Promise-based functions require chaining .then() and .catch() calls, which can become cumbersome and harder to follow, especially for complex flows.
Nested Callbacks: Handling multiple asynchronous operations often leads to deeply nested callbacks, making the code less readable and maintainable.

```

//app.jsx
map.on('moveend', () => {
      const { lng, lat } = map.getCenter();
      dispatch(panMap({ lng, lat }));
      dispatch(fetchDataRequest());
    });


// sagas.js
import { takeLatest, call, put, cancelled } from 'redux-saga/effects';
import { FETCH_DATA_REQUEST, fetchDataSuccess, fetchDataFailure } from './actions';

function* fetchDataSaga(action) {
  const abortController = new AbortController();
  try {
    const response = yield call(fetch, 'http://localhost:8080/api/data', {
      signal: abortController.signal,
    });
    const data = yield response.json();
    yield put(fetchDataSuccess(data));
  } catch (error) {
    if (yield cancelled()) {
      abortController.abort();
    } else {
      yield put(fetchDataFailure(error.message));
    }
  }
}

function* watchFetchData() {
  yield takeLatest(FETCH_DATA_REQUEST, fetchDataSaga);
}

export default watchFetchData;



How Cancellation Works?
takeLatest Effect: The takeLatest effect ensures that only the latest FETCH_DATA_REQUEST action is processed. If a new FETCH_DATA_REQUEST action is dispatched before the previous one completes, the previous saga is cancelled.

Saga Middleware: When the saga middleware detects a new FETCH_DATA_REQUEST action, it cancels the currently running fetchDataSaga and starts a new one.

Cancellation Handling: Inside the fetchDataSaga, the yield cancelled() effect checks if the saga was cancelled. If it returns true, the abortController.abort() method is called to abort the ongoing fetch request.



Detailed Flow

User Pans the Map:
The moveend event triggers, dispatching the PAN_MAP and FETCH_DATA_REQUEST actions.

Saga Middleware:
The middleware intercepts the FETCH_DATA_REQUEST action and starts executing fetchDataSaga.

First Fetch Request:
The saga creates an AbortController and initiates the fetch request with the abort signal.
The saga pauses at the yield call(fetch, ...) statement, waiting for the fetch promise to resolve.

User Pans Again:
Another moveend event triggers, dispatching a new FETCH_DATA_REQUEST action.
The takeLatest effect cancels the currently running fetchDataSaga.

Cancellation Handling:
The fetchDataSaga detects the cancellation via yield cancelled().
The abortController.abort() method is called, aborting the ongoing fetch request.

New Fetch Request:
A new fetchDataSaga starts, creating a new AbortController and initiating a new fetch request.

Summary
By using takeLatest, AbortController, and the cancelled effect, redux-saga ensures that any ongoing fetch requests are aborted when a new request is initiated. This prevents multiple overlapping API calls and ensures that only the latest request is processed.



Understanding Cancellation in Redux-Saga ?
When redux-saga cancels a running saga, it does so by throwing a special SagaCancellationException inside the generator function. This exception is caught by the try...catch block, allowing you to handle the cancellation appropriately.

Detailed Flow

Saga Execution:
When the saga middleware starts executing fetchDataSaga, it enters the try block and begins processing the yield statements.

Cancellation Trigger:
If a new FETCH_DATA_REQUEST action is dispatched while the previous fetchDataSaga is still running, the takeLatest effect cancels the currently running saga.
The cancellation is implemented by throwing a SagaCancellationException inside the generator function.

Exception Handling:
The SagaCancellationException is caught by the catch block in the fetchDataSaga.
This is why the code execution moves to the catch block when the saga is cancelled.

Cancellation Check:
Inside the catch block, the yield cancelled() effect is used to check if the saga was cancelled.
yield cancelled() returns true if the saga was indeed cancelled by the middleware.

AbortController:
If the saga was cancelled, the abortController.abort() method is called to abort the ongoing fetch request.
This ensures that the previous API request is terminated, preventing unnecessary network traffic and potential data inconsistencies.

```