import { shallow } from 'enzyme';
import React from 'react';
import { Link } from 'react-router-dom';
import { shallow } from 'enzyme';

import Header from './header';

describe('header', () => {
  it('renders a link to the about page', () => {
    const wrapper = shallow(<Header />);
    const link = (<Link to="/about">Info</Link>);
    expect(wrapper.containsMatchingElement(link)).toBe(true);
  });
});
