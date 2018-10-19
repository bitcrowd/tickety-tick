import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

import CopyButton from './copy-button';
import TicketShape from '../utils/ticket-shape';

const button = (tickets) => {
  const summary = tickets.map(ticket => ticket.fmt.commit).join(', ');

  return (
    <div>
      <CopyButton className="btn btn-secondary btn-sm" value={summary}>Summary</CopyButton>
      <span className="nav-text nav-text-sm">
        {tickets.length}
        {' '}
        {tickets.length === 1 ? 'ticket' : 'tickets'}
      </span>
    </div>
  );
};

function Header({ tickets }) {
  return (
    <div className="navbar navbar-light navbar-fixed-top navbar-tt">
      <ul className="nav navbar-nav pull-xs-right">
        <li className="nav-item text-xs-right">
          <Link className="nav-link" to="/about">Info</Link>
        </li>
      </ul>
      {tickets.length > 0 ? button(tickets) : null}
    </div>
  );
}

Header.propTypes = {
  tickets: PropTypes.arrayOf(TicketShape).isRequired, // eslint-disable react/no-typos
};

export default Header;
