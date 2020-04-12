import { shallow } from 'enzyme';
import React from 'react';

import { ticket as make } from '../../../../test/factories';
import Header from './header';
import NoTickets from './no-tickets';
import TicketList from './ticket-list';
import Tool from './tool';

describe('tool', () => {
  const tickets = ['un', 'deux', 'trois'].map((title, i) =>
    make({ id: `${i + 1}`, title })
  );
  const errors = [new Error('ouch')];

  let wrapper;

  describe('with an array of tickets', () => {
    beforeEach(() => {
      wrapper = shallow(<Tool tickets={tickets} errors={errors} />);
    });

    it('renders the header', () => {
      expect(wrapper.find(Header).exists()).toBe(true);
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
      expect(wrapper.find(Header).exists()).toBe(true);
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
      expect(wrapper.find(Header).exists()).toBe(true);
    });

    it('renders the "no tickets" notification', () => {
      const notification = wrapper.find(NoTickets);
      expect(notification.exists()).toBe(true);
      expect(notification.prop('errors')).toBe(errors);
    });
  });
});
