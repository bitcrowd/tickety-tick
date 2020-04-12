import PropTypes from 'prop-types';
import React from 'react';

import ErrorShape from '../utils/error-shape';
import TicketShape from '../utils/ticket-shape';
import NoTickets from './no-tickets';
import TicketControls from './ticket-controls';

function Tool({ tickets, errors }) {
  return (
    <div className="p-2">
      {tickets.length > 0 ? (
        <TicketControls tickets={tickets} />
      ) : (
        <NoTickets errors={errors} />
      )}
    </div>
  );
}

Tool.propTypes = {
  tickets: PropTypes.arrayOf(TicketShape.isRequired).isRequired,
  errors: PropTypes.arrayOf(ErrorShape.isRequired).isRequired,
};

export default Tool;
