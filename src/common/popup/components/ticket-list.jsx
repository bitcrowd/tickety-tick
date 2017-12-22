import React from 'react';
import PropTypes from 'prop-types';
import octicons from 'octicons';

import CopyButton from './copy-button';
import TicketShape from '../utils/ticket-shape';

const svg = name => ({ __html: octicons[name].toSVG() });

/* eslint-disable jsx-a11y/tabindex-no-positive, react/no-danger */

function TicketListItem({ ticket }) {
  return (
    <div className="container list-group-container">
      <div className="row">
        <div className="col-xs-7">
          <h6 className="list-group-heading">{ticket.title}</h6>
        </div>
        <div className="col-xs-5 text-xs-right">
          <CopyButton
            className="btn btn-primary btn-sm"
            title="Branch name"
            value={ticket.fmt.branch}
            tabIndex={1}
          >
            <span className="octicon octicon-sm" dangerouslySetInnerHTML={svg('git-branch')} />
          </CopyButton>
          <CopyButton
            className="btn btn-primary btn-sm pq"
            title="Commit message"
            value={ticket.fmt.commit}
            tabIndex={1}
          >
            <span className="octicon octicon-sm" dangerouslySetInnerHTML={svg('comment')} />
          </CopyButton>
          <CopyButton
            className="btn btn-primary btn-sm pq"
            title="CLI command"
            value={ticket.fmt.command}
            tabIndex={1}
          >
            <span className="octicon octicon-sm" dangerouslySetInnerHTML={svg('terminal')} />
          </CopyButton>
        </div>
      </div>
    </div>
  );
}

/* eslint-enable jsx-a11y/tabindex-no-positive, react/no-danger */

TicketListItem.propTypes = {
  ticket: TicketShape.isRequired, // eslint-disable-line react/no-typos
};

function TicketList({ tickets }) {
  const itemize = ticket => (
    <li key={ticket.id} className="list-group-item list-group-item-tt">
      <TicketListItem ticket={ticket} />
    </li>
  );

  return (
    <div>
      <ul className="list-group">
        {tickets.map(itemize)}
      </ul>
    </div>
  );
}

TicketList.propTypes = {
  tickets: PropTypes.arrayOf(TicketShape).isRequired,
};

export { TicketListItem };
export default TicketList;
