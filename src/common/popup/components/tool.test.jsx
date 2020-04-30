import { shallow } from 'enzyme';
import React from 'react';

import { ticket as make } from '../../../../test/factories';
import NoTickets from './no-tickets';
import TicketControls from './ticket-controls';
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

    it('renders a ticket list', () => {
      expect(wrapper.find(TicketControls).prop('tickets')).toBe(tickets);
    });
  });

  describe('with no tickets found and no errors', () => {
    beforeEach(() => {
      wrapper = shallow(<Tool tickets={[]} errors={[]} />);
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

    it('renders the "no tickets" notification', () => {
      const notification = wrapper.find(NoTickets);
      expect(notification.exists()).toBe(true);
      expect(notification.prop('errors')).toBe(errors);
    });
  });
});
