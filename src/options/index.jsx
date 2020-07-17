import './index.scss';

import React from 'react';
import ReactDOM from 'react-dom';

import store from '../store';
import Form from './components/form';

const root = document.createElement('div');
const element = <Form store={store} />;

document.body.appendChild(root);

ReactDOM.render(element, root);
