import './options.scss';

import React from 'react';
import ReactDOM from 'react-dom';

import store from '../store';
import Form from './components/form';

const root = document.getElementById('options-root');
const element = <Form store={store} />;
ReactDOM.render(element, root);
