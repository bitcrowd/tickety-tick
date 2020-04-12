import PropTypes from 'prop-types';
import React from 'react';

import ErrorShape from '../utils/error-shape';
import TicketShape from '../utils/ticket-shape';
import Header from './header';
import NoTickets from './no-tickets';
import TicketList from './ticket-list';

function Tool({ tickets, errors }) {
  const content =
    tickets.length > 0 ? (
      <TicketList tickets={tickets} />
    ) : (
      <NoTickets errors={errors} />
    );

  return (
    <div>
      <Header />
      <div className="content">{content}</div>
    </div>
  );
}

Tool.propTypes = {
  tickets: PropTypes.arrayOf(TicketShape.isRequired).isRequired,
  errors: PropTypes.arrayOf(ErrorShape).isRequired,
};

export default Tool;
