import React from 'react'
import ReactDOM from 'react-dom/client'

import { configureStore } from '@reduxjs/toolkit';
import { Provider } from 'react-redux';

import counterSlice from './counterSlice';
import productsSlice from './productsSlice';
import App from './App.tsx'
import './index.css'

const store = configureStore({
  reducer: {
    counter: counterSlice.reducer,
    products: productsSlice.reducer
  }
})

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </React.StrictMode>,
)