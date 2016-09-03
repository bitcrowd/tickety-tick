import React from 'react';
import { Link } from 'react-router';

import CopyButton from './copy-button';
import TicketShape from '../utils/ticket-shape';
import fmt from '../utils/format';

function Header(props) {
  const actions = ((tickets) => {
    if (tickets.length === 0) return null;

    const summary = tickets.map(fmt.commit).join(', ');

    return (
      <ul className="action-list">
        <li className="action-list-item">
          <CopyButton value={summary}>Summary</CopyButton>
        </li>
        <li className="action-list-item">
          {tickets.length} {(tickets.length === 1 ? 'ticket' : 'tickets')}
        </li>
      </ul>
    );
  })(props.tickets);

  return (
    <div className="container header">
      <div className="header-actions">
        {actions}
      </div>
      <div className="header-info">
        <Link to="/about">Info</Link>
      </div>
    </div>
  );
}

Header.propTypes = {
  tickets: React.PropTypes.arrayOf(TicketShape).isRequired
};

export default Header;
