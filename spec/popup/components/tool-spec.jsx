import React from 'react';
import { shallow } from 'enzyme';

import Tool from '../../../src/common/popup/components/tool';
import TicketList from '../../../src/common/popup/components/ticket-list';
import NoTickets from '../../../src/common/popup/components/no-tickets';
import Header from '../../../src/common/popup/components/header';

describe('tool', () => {
  const tickets = ['un', 'deux', 'trois'].map((title, i) => ({ id: `${i + 1}`, title }));

  let wrapper;

  describe('with an array of tickets', () => {
    beforeEach(() => {
      wrapper = shallow(<Tool tickets={tickets} />);
    });

    it('renders the header and passes on the tickets', () => {
      expect(wrapper.find(Header).prop('tickets')).toBe(tickets);
    });

    it('renders a ticket list', () => {
      expect(wrapper.find(TicketList).prop('tickets')).toBe(tickets);
    });
  });

  describe('with no tickets found', () => {
    beforeEach(() => {
      wrapper = shallow(<Tool tickets={null} />);
    });

    it('renders the header and passes on an empty array', () => {
      expect(wrapper.find(Header).prop('tickets')).toEqual([]);
    });

    it('renders the "no tickets" notification', () => {
      expect(wrapper.find(NoTickets).length).toBe(1);
    });
  });
});
