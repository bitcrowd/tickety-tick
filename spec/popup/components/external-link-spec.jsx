import React from 'react';
import { shallow } from 'enzyme';

import EnvContext from '../../../src/common/popup/env-context';

import ExternalLink from '../../../src/common/popup/components/external-link';

describe('external-link', () => {
  function render(overrides, env) {
    const defaults = { children: 'link text', href: 'https://github.com/bitcrowd/tickety-tick' };

    const props = { ...defaults, ...overrides };

    // Enzyme does not fully support the new React Context API at the moment.
    // We work around this limitation by directly passing in the context value
    // to the `EnvContext.Consumer` child function for rendering.
    //
    // See https://github.com/airbnb/enzyme/issues/1553.
    const outer = shallow(<ExternalLink {...props} />);
    const children = outer.find(EnvContext.Consumer).prop('children');
    const wrapper = shallow(children(env));

    return wrapper;
  }

  let openext;

  beforeEach(() => {
    openext = jasmine.createSpy('openext');
  });

  it('calls the context openext function with the provided href on click', () => {
    const href = 'https://bitcrowd.net/';
    const wrapper = render({ href }, { openext });
    wrapper.simulate('click');
    expect(openext).toHaveBeenCalledWith(href);
  });

  it('sets the link href attribute', () => {
    const href = 'https://github.com/';
    const wrapper = render({ href }, { openext });
    expect(wrapper.find('a').prop('href')).toBe(href);
  });

  it('sets the target to "_blank"', () => {
    const wrapper = render({}, { openext });
    expect(wrapper.find('a').prop('target')).toBe('_blank');
  });

  it('renders the link children', () => {
    const wrapper = render({ children: 'neat' }, { openext });
    expect(wrapper.find('a').prop('children')).toBe('neat');
  });

  it('passes on any other properties to the rendered link', () => {
    const wrapper = render({ 'data-moar': 'yep' }, { openext });
    expect(wrapper.find('a').prop('data-moar')).toBe('yep');
  });
});
