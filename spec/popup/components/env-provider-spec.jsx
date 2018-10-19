import React from 'react';
import PropTypes from 'prop-types';
import { mount, shallow } from 'enzyme';

import EnvProvider from '../../../src/common/popup/components/env-provider';

function EnvReceiver(props, ctx) {
  const { received } = props;
  received.context = ctx; // eslint-disable-line no-param-reassign
  return (<div>context receiver</div>);
}

EnvReceiver.propTypes = {
  received: PropTypes.object.isRequired, // eslint-disable-line react/forbid-prop-types
};

EnvReceiver.contextTypes = {
  openext: PropTypes.func.isRequired,
  grab: PropTypes.func.isRequired,
};

describe('env-provider', () => {
  const openext = () => {};
  const grab = () => {};

  const env = { openext, grab };

  it('renders its children', () => {
    const children = (<div>anything that requires access to env context</div>);
    const wrapper = shallow(<EnvProvider {...env}>{children}</EnvProvider>);
    expect(wrapper.contains(children)).toBe(true);
  });

  it('passes environment-specific values as context', () => {
    const received = {}; // EnvReceiver will expose the context on this object
    const children = (<EnvReceiver received={received} />);
    mount(<EnvProvider {...env}>{children}</EnvProvider>);
    expect(received.context.openext).toBe(env.openext);
    expect(received.context.grab).toBe(env.grab);
  });
});
