/* eslint-env browser */

import React from 'react';
import ReactDOM from 'react-dom';

import './options.scss';
import Form from './components/form';
import store from '../store';

const root = document.getElementById('options-root');
const element = (<Form store={store} />);
ReactDOM.render(element, root);
