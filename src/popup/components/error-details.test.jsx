import { shallow } from 'enzyme';
import React from 'react';
import StackTrace from 'stacktrace-js';

import CopyButton from './copy-button';
import CopyErrorDetails from './error-details';

jest.mock('stacktrace-js', () => ({ fromError: jest.fn() }));

class MockStackFrame {
  constructor(functionName, fileName, lineNumber, columnNumber) {
    this.functionName = functionName;
    this.fileName = fileName;
    this.lineNumber = lineNumber;
    this.columnNumber = columnNumber;
  }

  getFunctionName() {
    return this.functionName;
  }

  getFileName() {
    return this.fileName;
  }

  getLineNumber() {
    return this.lineNumber;
  }

  getColumnNumber() {
    return this.columnNumber;
  }
}

describe('error-details', () => {
  function render(overrides) {
    const defaults = { errors: [new Error('WAT?')] };
    const props = { ...defaults, ...overrides };
    return shallow(<CopyErrorDetails {...props} />);
  }

  beforeEach(() => {
    StackTrace.fromError.mockResolvedValue(
      [
        ['scan', 'src/common/adapters/github.js', 74, 8],
        ['attempt', 'src/common/search.js', 12, 26],
        ['search', 'src/common/search.js', 27, 45],
        ['search', 'src/common/search.js', 27, 25],
        [
          'browser.runtime.onMessage.addListener',
          'src/web-extension/content.js',
          8,
          13,
        ],
        [
          'wrappedSendResponse',
          'node_modules/webextension-polyfill/dist/browser-polyfill.js',
          1057,
          null,
        ],
      ].map((args) => new MockStackFrame(...args))
    );
  });

  afterEach(() => {
    StackTrace.fromError.mockClear();
  });

  it('renders a button to copy the error details', async () => {
    const wrapper = render({ errors: [new Error('Boom!')] });
    await new Promise((resolve) => setTimeout(resolve, 0)); // wait for stacktrace-js processing
    expect(wrapper.find(CopyButton).prop('value')).toMatchSnapshot();
  });
});
