import { configure } from 'enzyme';
import Adapter from 'enzyme-adapter-react-15';

import { JSDOM } from 'jsdom';
import jquery from 'jquery';

// Configure Enzyme
configure({ adapter: new Adapter() });

// Configure test DOM replacement
global.window = new JSDOM('<html><body></body></html>').window;
global.document = global.window.document;
global.navigator = global.window.navigator;

global.$$$ = jquery(global.window);
