import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import FileUpload from './fileupload';
import Tiles from './Tiles'
import HoverCardGrid from './HoverCardGrid'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Routing from './RouteRouting'

import reportWebVitals from './reportWebVitals';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <Routing />
  </React.StrictMode>
);
reportWebVitals();
