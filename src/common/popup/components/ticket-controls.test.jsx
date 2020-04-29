import { shallow } from 'enzyme';
import React from 'react';

import { ticket as make } from '../../../../test/factories';
import TicketControls from './ticket-controls';

describe('ticket-controls', () => {
  function render(overrides) {
    const defaults = {
      tickets: ['raz', 'dva', 'tri'].map((title, i) =>
        make({ id: `${i + 1}`, title })
      ),
    };
    const props = { ...defaults, ...overrides };
    return shallow(<TicketControls {...props} />);
  }

  it('renders', () => {
    expect(() => render({})).not.toThrow();
  });
});
