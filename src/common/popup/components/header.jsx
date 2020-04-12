import PropTypes from 'prop-types';
import React from 'react';
import { Link } from 'react-router-dom';

import TicketShape from '../utils/ticket-shape';
import CopyButton from './copy-button';

const button = (tickets) => {
  const summary = tickets.map((ticket) => ticket.fmt.summary).join(', ');

  return (
    <div>
      <CopyButton className="btn btn-sm btn-outline-secondary" value={summary}>
        Summary
      </CopyButton>
      <span className="navbar-text ml-1 small">
        {/* eslint-disable-next-line prettier/prettier */}
        {tickets.length}
        {' '}
        {tickets.length === 1 ? 'ticket' : 'tickets'}
      </span>
    </div>
  );
};

function Header({ tickets }) {
  return (
    <div className="navbar navbar-light fixed-top bg-white border-bottom">
      {tickets.length > 0 ? button(tickets) : null}
      <ul className="nav navbar-nav ml-auto">
        <li className="nav-item">
          <Link className="nav-link" to="/about">
            Info
          </Link>
        </li>
      </ul>
    </div>
  );
}

Header.propTypes = {
  tickets: PropTypes.arrayOf(TicketShape).isRequired, // eslint-disable react/no-typos
};

export default Header;
