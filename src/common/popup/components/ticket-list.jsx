import React from 'react';

import CopyButton from './copy-button';
import TicketShape from '../utils/ticket-shape';
import fmt from '../utils/format';

function TicketListItem(props) {
  const ticket = props.ticket;
  const commit = fmt.commit(ticket);
  const branch = fmt.branch(ticket);

  return (
    <li className="ticket-list-item">
      <div className="ticket-list-item-content container">
        <h3>{ticket.title}</h3>
      </div>
      <div className="ticket-list-item-actions container">
        <CopyButton className="copy-button" value={commit}>Commit message</CopyButton>
        <CopyButton className="copy-button" value={branch}>Branch name</CopyButton>
      </div>
    </li>
  );
}

TicketListItem.propTypes = {
  ticket: TicketShape.isRequired
};

function TicketList(props) {
  const item = (ticket) => (
    <TicketListItem key={ticket.id} ticket={ticket} />
  );

  return (
    <div>
      <ul className="ticket-list">
        {props.tickets.map(item)}
      </ul>
    </div>
  );
}

TicketList.propTypes = {
  tickets: React.PropTypes.arrayOf(TicketShape).isRequired
};

export { TicketListItem };
export default TicketList;
