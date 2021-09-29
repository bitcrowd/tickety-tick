import React from "react";
import { Link } from "react-router-dom";
import browser from "webextension-polyfill";

import type { TicketWithFmt } from "../../types";
import Content from "./content";
import Navbar from "./navbar";
import NoTickets from "./no-tickets";
import TicketControls from "./ticket-controls";

function close() {
  window.close();
}

function openOptions() {
  return browser.runtime.openOptionsPage();
}

export type Props = {
  tickets: TicketWithFmt[];
  errors: Error[];
};

function Tool({ tickets, errors }: Props) {
  async function onClickSettingsLink(event: React.MouseEvent) {
    event.preventDefault();
    await openOptions();
    close();
  }

  return (
    <>
      <Navbar>
        <span className="navbar-brand">Tickety-Tick</span>
        <ul className="navbar-nav">
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

export default Tool;
