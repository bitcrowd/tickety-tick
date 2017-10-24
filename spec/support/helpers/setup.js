import Enzyme from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

import { JSDOM } from 'jsdom';
import jquery from 'jquery';

Enzyme.configure({ adapter: new Adapter() });

global.window = new JSDOM('<html><body></body></html>').window;
global.document = global.window.document;
global.navigator = global.window.navigator;

global.$$$ = jquery(global.window);
