import { takeEvery, put, all, call, cancelled, takeLatest } from 'redux-saga/effects'
import counterSlice from './counterSlice'
import thumbnailsSlice from './thumbnailsSlice'

// ------------------------------------------------------------------------------------------
// Sagas for Counter component.
// ------------------------------------------------------------------------------------------

function* watchIncrementAsync() {
  //takeEvery
  yield takeLatest('incrementAsync', doIncrementAsync)
}

function* doIncrementAsync() {
  for (let i = 0; i < 10; i++) {
    yield delay(1000)
    yield put(counterSlice.actions.increment())
  }
}

function delay(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms))  // Promise is resolved after timeout
}


// ------------------------------------------------------------------------------------------
// Sagas for Thumbnails component.
// ------------------------------------------------------------------------------------------

function* watchGetThumbnailUrlsAsync() {
  // yield takeEvery('getThumbnailsAsync', doGetThumbnailUrlsAsync)
  yield takeLatest('getThumbnailsAsync', doGetThumbnailUrlsAsync);
}

function* doGetThumbnailUrlsAsync(): any {
  const abortController = new AbortController();
  try {
    const response = yield call(fetch, 'http://localhost:8080/api/thumbnailUrls', {
      signal: abortController.signal,
    });
    console.log("1");
    const urlsData = yield response.json()
    console.log("2");
    yield put(thumbnailsSlice.actions.setThumbnails(urlsData))
    console.log("3");
  }
  catch (e) {
    if (yield cancelled()) {
      abortController.abort();
    }
    console.log("doGetThumbnailUrlsAsync() error: " + e)
  }
}


// ------------------------------------------------------------------------------------------
// Root saga.
// ------------------------------------------------------------------------------------------
export default function* myRootSaga() {
  yield all([
    watchIncrementAsync(),
    watchGetThumbnailUrlsAsync()
  ])
}