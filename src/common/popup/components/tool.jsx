import React from 'react';

import TicketList from './ticket-list';
import NoTickets from './no-tickets';
import Header from './header';

function Tool(props) {
  const content = (props.tickets)
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
  tickets: React.PropTypes.array
};

export default Tool;
