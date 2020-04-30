import { shallow } from 'enzyme';
import React from 'react';

import Content from './content';

describe('Content', () => {
  function render(props) {
    return shallow(<Content {...props} />);
  }

  it('renders its children', () => {
    const children = 'nested content';
    const wrapper = render({ children });
    expect(wrapper.contains(children)).toBe(true);
  });
});
