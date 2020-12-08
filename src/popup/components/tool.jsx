import PropTypes from 'prop-types';
import React, { useContext } from 'react';
import { Link } from 'react-router-dom';

import EnvContext from '../env-context';
import ErrorShape from '../utils/error-shape';
import TicketShape from '../utils/ticket-shape';
import Content from './content';
import Navbar from './navbar';
import NoTickets from './no-tickets';
import TicketControls from './ticket-controls';

function Tool({ tickets, errors }) {
  const { close, openopts } = useContext(EnvContext);

  async function onClickSettingsLink(event) {
    event.preventDefault();
    await openopts();
    close();
  }

  return (
    <>
      <Navbar>
        <span className="navbar-brand">Tickety-Tick</span>
        <ul className="navbar-nav ml-auto">
          <li className="nav-item">
            <a
              className="nav-link"
              href="options.html"
              onClick={onClickSettingsLink}
            >
              Settings
            </a>
          </li>
          <li className="nav-item">
            <Link className="nav-link pr-0" to="/about">
              Help
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
