import React from 'react';
import { shallow } from 'enzyme';

import Tool from './tool';
import TicketList from './ticket-list';
import NoTickets from './no-tickets';
import Header from './header';

import { ticket as make } from '../../../../test/factories';

describe('tool', () => {
  const tickets = ['un', 'deux', 'trois'].map((title, i) => make({ id: `${i + 1}`, title }));
  const errors = [new Error('ouch')];

  let wrapper;

  describe('with an array of tickets', () => {
    beforeEach(() => {
      wrapper = shallow(<Tool tickets={tickets} errors={errors} />);
    });

    it('renders the header and passes on the tickets', () => {
      expect(wrapper.find(Header).prop('tickets')).toBe(tickets);
    });

    it('renders a ticket list', () => {
      expect(wrapper.find(TicketList).prop('tickets')).toBe(tickets);
    });
  });

  describe('with no tickets found and no errors', () => {
    beforeEach(() => {
      wrapper = shallow(<Tool tickets={[]} errors={[]} />);
    });

    it('renders the header', () => {
      expect(wrapper.find(Header).prop('tickets')).toEqual([]);
    });

    it('renders the "no tickets" notification', () => {
      const notification = wrapper.find(NoTickets);
      expect(notification.exists()).toBe(true);
    });
  });

  describe('with no tickets found and errors', () => {
    beforeEach(() => {
      wrapper = shallow(<Tool tickets={[]} errors={errors} />);
    });

    it('renders the header', () => {
      expect(wrapper.find(Header).prop('tickets')).toEqual([]);
    });

    it('renders the "no tickets" notification', () => {
      const notification = wrapper.find(NoTickets);
      expect(notification.exists()).toBe(true);
      expect(notification.prop('errors')).toBe(errors);
    });
  });
});
