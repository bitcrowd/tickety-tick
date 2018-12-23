import React from 'react';
import { shallow } from 'enzyme';

import NoTickets from './no-tickets';

describe('about', () => {
  function render(/* overrides */) {
    return shallow(<NoTickets />);
  }

  it('renders', () => {
    expect(render({})).toMatchSnapshot();
  });
});
