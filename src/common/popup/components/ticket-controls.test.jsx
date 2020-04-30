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

  it('renders for multiple tickets', () => {
    expect(render({})).toMatchSnapshot();
  });

  it('renders for a single ticket', () => {
    const tickets = [make({ id: '1', title: 'raz' })];
    expect(render({ tickets })).toMatchSnapshot();
  });

  it('renders a dropdown if there is more than one ticket', () => {
    const tickets = ['raz', 'dva', 'tri'].map((title, i) =>
      make({ id: `${i + 1}`, title })
    );
    const wrapper = render({ tickets });
    const select = wrapper.find('select');
    expect(select.prop('disabled')).toBe(false);
  });

  it('renders a disabled dropdown if there is only one ticket', () => {
    const tickets = [make({ id: '2', title: 'dva' })];
    const wrapper = render({ tickets });
    const select = wrapper.find('select');
    expect(select.prop('disabled')).toBe(true);
  });

  it('renders copy buttons for branch, commit and command of the selected ticket', () => {
    const ticket1 = make({ id: '1', title: 'raz' });
    const ticket2 = make({ id: '2', title: 'dva' });
    const wrapper = render({ tickets: [ticket1, ticket2] });
    const select = wrapper.find('select');
    let buttons = wrapper.find('TicketCopyButton');

    expect(buttons).toHaveLength(3);
    expect(buttons.map((button) => button.prop('value'))).toEqual([
      ticket1.fmt.branch,
      ticket1.fmt.commit,
      ticket1.fmt.command,
    ]);

    // select the second ticket (index = 1)
    select.simulate('change', { target: { value: 1 } });

    buttons = wrapper.find('TicketCopyButton');
    expect(buttons).toHaveLength(3);
    expect(buttons.map((button) => button.prop('value'))).toEqual([
      ticket2.fmt.branch,
      ticket2.fmt.commit,
      ticket2.fmt.command,
    ]);
  });

  it('allows to cycle through the buttons and the select via the tab key', () => {
    const wrapper = render({});
    const buttons = wrapper.find('TicketCopyButton');
    const select = wrapper.find('select');

    buttons.forEach((button) => expect(button.prop('tabIndex')).toEqual(1));
    expect(select.prop('tabIndex')).toEqual(1);
  });
});
