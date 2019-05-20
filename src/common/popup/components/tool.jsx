import React from 'react';
import PropTypes from 'prop-types';

import TicketList from './ticket-list';
import NoTickets from './no-tickets';
import Header from './header';

import TicketShape from '../utils/ticket-shape';
import ErrorShape from '../utils/error-shape';

function Tool({ tickets, errors }) {
  const content = tickets.length > 0
    ? <TicketList tickets={tickets} />
    : <NoTickets errors={errors} />;

  return (
    <div>
      <Header tickets={tickets} />
      <div className="content">{content}</div>
    </div>
  );
}

Tool.propTypes = {
  tickets: PropTypes.arrayOf(TicketShape.isRequired).isRequired,
  errors: PropTypes.arrayOf(ErrorShape).isRequired,
};

export default Tool;
