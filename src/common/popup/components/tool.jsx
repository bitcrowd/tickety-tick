import PropTypes from 'prop-types';
import React from 'react';
import { Link } from 'react-router-dom';

import ErrorShape from '../utils/error-shape';
import TicketShape from '../utils/ticket-shape';
import Content from './content';
import Navbar from './navbar';
import NoTickets from './no-tickets';
import TicketControls from './ticket-controls';

function Tool({ tickets, errors }) {
  return (
    <>
      <Navbar>
        <ul className="nav navbar-nav ml-auto">
          <li className="nav-item">
            <Link className="nav-link" to="/about">
              Usage / Info
            </Link>
          </li>
        </ul>
      </Navbar>
      <Content>
        {tickets.length > 0 ? (
          <TicketControls tickets={tickets} />
        ) : (
          <NoTickets errors={errors} />
        )}
      </Content>
    </>
  );
}

Tool.propTypes = {
  tickets: PropTypes.arrayOf(TicketShape.isRequired).isRequired,
  errors: PropTypes.arrayOf(ErrorShape.isRequired).isRequired,
};

export default Tool;
