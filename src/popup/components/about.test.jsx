import { shallow } from 'enzyme';
import React from 'react';

import About from './about';

describe('about', () => {
  function render(props) {
    return shallow(<About {...props} />);
  }

  it('renders', () => {
    expect(render({})).toMatchSnapshot();
  });
});
