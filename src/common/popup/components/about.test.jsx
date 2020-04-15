import { shallow } from 'enzyme';
import React from 'react';

import About from './about';

describe('about', () => {
  function render(/* overrides */) {
    return shallow(<About />);
  }

  it('renders', () => {
    expect(render({})).toMatchSnapshot();
  });
});
