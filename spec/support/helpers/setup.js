import { jsdom } from 'jsdom';

global.document = jsdom('<html><body></body></html>');
global.window = global.document.defaultView;
global.navigator = global.window.navigator;
