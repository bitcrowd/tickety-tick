import React from 'react';
import { Link } from 'react-router-dom';
import { shallow } from 'enzyme';

import Header from '../../../src/common/popup/components/header';
import CopyButton from '../../../src/common/popup/components/copy-button';
import fmt from '../../../src/common/popup/utils/format';

describe('header', () => {
  const tickets = ['jedan', 'dva', 'tri'].map((title, i) => ({ id: `${i + 1}`, title }));

  it('renders a link to the about page', () => {
    const wrapper = shallow(<Header tickets={tickets} />);
    const link = (<Link to="/about">Info</Link>);
    expect(wrapper.containsMatchingElement(link)).toBe(true);
  });

  it('displays the number of found tickets', () => {
    const plural = shallow(<Header tickets={tickets} />);
    expect(plural.find('.nav-text').text()).toBe(`${tickets.length} tickets`);
    const singular = shallow(<Header tickets={tickets.slice(0, 1)} />);
    expect(singular.find('.nav-text').text()).toBe('1 ticket');
  });

  it('renders a button for copying a summary of all tickets', () => {
    const wrapper = shallow(<Header tickets={tickets} />);
    const value = tickets.map(fmt.commit).join(', ');
    const button = (<CopyButton value={value}>Summary</CopyButton>);
    expect(wrapper.containsMatchingElement(button)).toBe(true);
  });

  it('hides the summary button when no tickets are found', () => {
    const wrapper = shallow(<Header tickets={[]} />);
    expect(wrapper.find(CopyButton).exists()).toBe(false);
  });
});
