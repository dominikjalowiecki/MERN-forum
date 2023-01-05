import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import axios from 'axios';
import reportWebVitals from './reportWebVitals';

axios.defaults.baseURL = (process.env.NODE_ENV === 'production') ? process.env.REACT_APP_API_URI : '';
axios.defaults.withCredentials = true;

ReactDOM.render(
  <React.Fragment>
    <App />
  </React.Fragment>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
// reportWebVitals();
