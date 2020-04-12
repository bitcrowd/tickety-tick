import Octicon, {
  Comment,
  GitBranch,
  Terminal,
} from '@githubprimer/octicons-react';
import PropTypes from 'prop-types';
import React from 'react';

import TicketShape from '../utils/ticket-shape';
import CopyButton from './copy-button';

function TicketCopyButton({ icon, label, title, value }) {
  return (
    <CopyButton
      className="d-flex justify-content-center align-items-center btn btn-primary"
      title={title}
      value={value}
    >
      <Octicon icon={icon} width="18" height="18" />
      <span className="pl-1 small btn-label btn-label-conceal">{label}</span>
    </CopyButton>
  );
}

TicketCopyButton.propTypes = {
  icon: PropTypes.elementType.isRequired,
  label: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
};

function TicketControls({ tickets }) {
  const ticket = tickets[0];

  return (
    <form>
      <div className="d-flex flex-row mb-2 btn-group btn-group-lg" role="group">
        <TicketCopyButton
          icon={GitBranch}
          label="Branch"
          title="Copy branch name"
          value={ticket.fmt.branch}
        />
        <TicketCopyButton
          icon={Comment}
          label="Message"
          title="Copy commit message"
          value={ticket.fmt.commit}
        />
        <TicketCopyButton
          icon={Terminal}
          label="Command"
          title="Copy CLI command"
          value={ticket.fmt.command}
        />
      </div>
      <div>
        <select
          className="form-control form-control-sm"
          disabled={tickets.length < 2}
        >
          <option>{tickets[0].title}</option>
        </select>
      </div>
    </form>
  );
}

TicketControls.propTypes = {
  tickets: PropTypes.arrayOf(TicketShape.isRequired).isRequired,
};

export default TicketControls;
