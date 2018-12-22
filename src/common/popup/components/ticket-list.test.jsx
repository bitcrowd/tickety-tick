import React from 'react';
import { shallow } from 'enzyme';

import TicketList, { TicketListItem } from './ticket-list';
import CopyButton from './copy-button';

import { ticket as make } from '../../../../test/factories';

describe('ticket-list', () => {
  const tickets = ['uno', 'due', 'tre'].map((title, i) => make({ id: `${i + 1}`, title }));

  it('renders a list of tickets', () => {
    const wrapper = shallow(<TicketList tickets={tickets} />);
    const items = tickets.map(t => (<TicketListItem ticket={t} />));
    expect(wrapper.find('ul > li').containsAllMatchingElements(items)).toBe(true);
  });
});

describe('ticket-list-item', () => {
  const ticket = make({ id: '1', title: 'a ticket for señior developer' });

  let wrapper;

  beforeEach(() => {
    wrapper = shallow(<TicketListItem ticket={ticket} />);
  });

  it('renders the ticket title', () => {
    expect(wrapper.contains(ticket.title)).toBe(true);
  });

  it('renders a copy-button for the commit messsage', () => {
    const buttons = wrapper.find(CopyButton);
    expect(buttons.someWhere(b => b.prop('value') === ticket.fmt.commit)).toBe(true);
  });

  it('renders a copy-button for the branch name', () => {
    const buttons = wrapper.find(CopyButton);
    expect(buttons.someWhere(b => b.prop('value') === ticket.fmt.branch)).toBe(true);
  });

  it('renders a copy-button for the git commands', () => {
    const buttons = wrapper.find(CopyButton);
    expect(buttons.someWhere(b => b.prop('value') === ticket.fmt.command)).toBe(true);
  });
});
