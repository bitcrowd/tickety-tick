import { shallow } from 'enzyme';
import React from 'react';

import NoTickets from './no-tickets';

describe('no-tickets', () => {
  function render(overrides) {
    const defaults = { errors: [] };
    const props = { ...defaults, ...overrides };
    return shallow(<NoTickets {...props} />);
  }

  describe('with no errors', () => {
    it('renders a hint', () => {
      expect(render({ errors: [] })).toMatchSnapshot();
    });
  });

  describe('with errors', () => {
    it('renders an error report', () => {
      const errors = [new Error('An error to test error reporting')];
      expect(render({ errors })).toMatchSnapshot();
    });
  });
});
