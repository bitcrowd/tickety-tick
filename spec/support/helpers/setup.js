import { JSDOM } from 'jsdom';
import jquery from 'jquery';

global.window = new JSDOM('<html><body></body></html>').window;
global.document = global.window.document;
global.navigator = global.window.navigator;

global.$$$ = jquery(global.window);
