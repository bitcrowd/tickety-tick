import { jsdom } from 'jsdom';
import jquery from 'jquery';

global.document = jsdom('<html><body></body></html>');
global.window = global.document.defaultView;
global.navigator = global.window.navigator;

global.$$$ = jquery(global.window);
