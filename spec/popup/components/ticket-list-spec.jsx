import React from 'react';
import { shallow } from 'enzyme';

import TicketList, { TicketListItem } from '../../../src/common/popup/components/ticket-list';
import CopyButton from '../../../src/common/popup/components/copy-button';
import fmt from '../../../src/common/popup/utils/format';

describe('ticket-list', () => {
  const tickets = ['uno', 'due', 'tre'].map((title, i) => ({ id: `${i + 1}`, title }));

  it('renders a list of tickets', () => {
    const wrapper = shallow(<TicketList tickets={tickets} />);
    const items = tickets.map((t) => (<TicketListItem ticket={t} />));
    expect(wrapper.find('ul').containsAllMatchingElements(items)).toBe(true);
  });
});

describe('ticket-list-item', () => {
  const ticket = { id: '1', title: 'a ticket for señior developer' };

  let wrapper;

  beforeEach(() => {
    wrapper = shallow(<TicketListItem ticket={ticket} />);
  });

  it('renders a list item', () => {
    expect(wrapper.is('li')).toBe(true);
  });

  it('renders the ticket title', () => {
    expect(wrapper.contains(ticket.title)).toBe(true);
  });

  it('renders a copy-button for the commit messsage', () => {
    const button = (<CopyButton value={fmt.commit(ticket)} >Commit message</CopyButton>);
    expect(wrapper.containsMatchingElement(button)).toBe(true);
  });

  it('renders a copy-button for the branch name', () => {
    const button = (<CopyButton value={fmt.branch(ticket)} >Branch name</CopyButton>);
    expect(wrapper.containsMatchingElement(button)).toBe(true);
  });
});
