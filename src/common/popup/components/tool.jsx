import React from 'react';
import PropTypes from 'prop-types';

import TicketList from './ticket-list';
import NoTickets from './no-tickets';
import Header from './header';
import TicketShape from '../utils/ticket-shape';

function Tool(props) {
  const content = (props.tickets && props.tickets.length > 0)
    ? <TicketList tickets={props.tickets} />
    : <NoTickets />;

  return (
    <div>
      <Header tickets={props.tickets || []} />
      <div className="content">{content}</div>
    </div>
  );
}

Tool.propTypes = {
  tickets: PropTypes.arrayOf(TicketShape),
};

Tool.defaultProps = [];

export default Tool;
