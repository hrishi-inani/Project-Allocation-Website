import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import styles from "./index.css"
import App from './App.js';
import store from './Redux/store';


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
      <Provider store={store}>
          <ToastContainer/>
          <App/>
      </Provider>
);
