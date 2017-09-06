import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import store from './chapter-03-redux_with_context/Store'
import Provider from './chapter-03-redux_with_context/Provider'
import ControlPanel from './chapter-03-redux_smart_dumb/views/CounterPanel.jsx'
ReactDOM.render(<Provider store={store}><ControlPanel /></Provider>, document.getElementById('root'));
