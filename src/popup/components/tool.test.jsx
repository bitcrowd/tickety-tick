import { shallow } from 'enzyme';
import React, { useContext } from 'react';
import { Link } from 'react-router-dom';

import { ticket as make } from '../../../test/factories';
import EnvContext from '../env-context';
import NoTickets from './no-tickets';
import TicketControls from './ticket-controls';
import Tool from './tool';

jest.mock('react', () => ({
  ...jest.requireActual('react'),
  useContext: jest.fn(),
}));

describe('tool', () => {
  const tickets = ['un', 'deux', 'trois'].map((title, i) =>
    make({ id: `${i + 1}`, title })
  );
  const errors = [new Error('ouch')];

  let wrapper;

  beforeEach(() => {
    useContext.mockReset();
    useContext.mockReturnValue({});
  });

  describe('always', () => {
    const openopts = jest.fn();
    const close = jest.fn();

    beforeEach(() => {
      useContext.mockReturnValue({ close, openopts });
      wrapper = shallow(<Tool tickets={[]} errors={[]} />);
      openopts.mockReset().mockResolvedValue();
      close.mockReset();
    });

    it('renders a settings link', async () => {
      const link = wrapper.find('a').filter({ children: 'Settings' });
      expect(useContext).toHaveBeenCalledWith(EnvContext);
      expect(link.exists()).toBe(true);

      const preventDefault = jest.fn();
      link.simulate('click', { preventDefault });

      expect(preventDefault).toHaveBeenCalled();
      expect(openopts).toHaveBeenCalled();

      await openopts(); // wait for promise to settle

      expect(close).toHaveBeenCalled();
    });

    it('renders a help link', () => {
      const link = wrapper.find(Link).filter({ children: 'Help' });
      expect(link.prop('to')).toBe('/about');
    });
  });

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
