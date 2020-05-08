import { shallow } from 'enzyme';
import React from 'react';

import ExternalLink from './external-link';

describe('external-link', () => {
  function render(overrides) {
    const defaults = {
      children: 'link text',
      href: 'https://github.com/bitcrowd/tickety-tick',
    };
    const props = { ...defaults, ...overrides };
    return shallow(<ExternalLink {...props} />);
  }

  it('sets the link href attribute', () => {
    const href = 'https://github.com/';
    const wrapper = render({ href });
    expect(wrapper.find('a').prop('href')).toBe(href);
  });

  it('sets the target to "_blank"', () => {
    const wrapper = render({});
    expect(wrapper.find('a').prop('target')).toBe('_blank');
  });

  it('renders the link children', () => {
    const wrapper = render({ children: 'neat' });
    expect(wrapper.find('a').prop('children')).toBe('neat');
  });

  it('passes on any other properties to the rendered link', () => {
    const wrapper = render({ 'data-moar': 'yep' });
    expect(wrapper.find('a').prop('data-moar')).toBe('yep');
  });
});
