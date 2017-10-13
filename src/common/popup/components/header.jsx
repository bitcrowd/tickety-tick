import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router';

import CopyButton from './copy-button';
import TicketShape from '../utils/ticket-shape';
import fmt from '../utils/format';

function Header(props) {
  const btn = ((tickets) => {
    if (tickets.length === 0) return null;

    const summary = tickets.map(fmt.commit).join(', ');

    return (
      <div>
        <CopyButton className="btn btn-secondary btn-sm" value={summary}>Summary</CopyButton>
        <span className="nav-text nav-text-sm">
          {tickets.length} {(tickets.length === 1 ? 'ticket' : 'tickets')}
        </span>
      </div>
    );
  })(props.tickets);

  /* eslint-disable jsx-a11y/anchor-is-valid */
  return (
    <div className="navbar navbar-light navbar-fixed-top navbar-tt">
      <ul className="nav navbar-nav pull-xs-right">
        <li className="nav-item text-xs-right">
          <Link className="nav-link" to="/about">Info</Link>
        </li>
      </ul>
      {btn}
    </div>
  );
  /* eslint-enable jsx-a11y/anchor-is-valid */
}

Header.propTypes = {
  tickets: PropTypes.arrayOf(TicketShape).isRequired, // eslint-disable react/no-typos
};

export default Header;
