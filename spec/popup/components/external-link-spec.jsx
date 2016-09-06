import React from 'react';
import { shallow } from 'enzyme';

import ExternalLink from '../../../src/common/popup/components/external-link';

describe('external-link', () => {
  const href = 'https://github.com/bitcrowd/tickety-tick';

  it('calls the context openext function with the provided href on click', () => {
    const context = { openext: jasmine.createSpy('openext') };
    const wrapper = shallow(<ExternalLink href={href} />, { context });
    wrapper.simulate('click');
    expect(context.openext).toHaveBeenCalledWith(href);
  });

  it('sets the target to "_blank"', () => {
    const wrapper = shallow(<ExternalLink href={href} />);
    expect(wrapper.find('a').prop('target')).toBe('_blank');
  });

  it('passes on any other properties to the rendered link', () => {
    const wrapper = shallow(<ExternalLink href={href} data-moar="yep" />);
    expect(wrapper.find('a').prop('data-moar')).toBe('yep');
  });
});
