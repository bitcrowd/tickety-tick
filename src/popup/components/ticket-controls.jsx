import {
  CheckIcon,
  CommentIcon,
  GitBranchIcon,
  TerminalIcon,
} from '@primer/octicons-react';
import PropTypes from 'prop-types';
import React from 'react';

import useInput from '../hooks/use-input';
import TicketShape from '../utils/ticket-shape';
import CopyButton from './copy-button';

function TicketCopyButton({ icon, label, title, value, ...rest }) {
  return (
    <CopyButton
      className="d-flex justify-content-center align-items-center btn btn-primary"
      title={title}
      value={value}
      {...rest}
    >
      {(copied) => {
        const IconComponent = copied ? CheckIcon : icon;

        return (
          <>
            <IconComponent size={18} />
            <span className="pl-1 small btn-label btn-label-conceal">
              {copied ? 'Copied' : label}
            </span>
          </>
        );
      }}
    </CopyButton>
  );
}

TicketCopyButton.propTypes = {
  icon: PropTypes.elementType.isRequired,
  label: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
};

/* eslint-disable jsx-a11y/tabindex-no-positive */

function TicketControls({ tickets }) {
  const select = useInput(0);

  const ticket = tickets[select.value];

  return (
    <form>
      <div className="d-flex flex-row mb-2 btn-group btn-group-lg" role="group">
        <TicketCopyButton
          icon={GitBranchIcon}
          label="Branch"
          title="Copy branch name"
          value={ticket.fmt.branch}
          tabIndex={1}
        />
        <TicketCopyButton
          icon={CommentIcon}
          label="Message"
          title="Copy commit message"
          value={ticket.fmt.commit}
          tabIndex={1}
        />
        <TicketCopyButton
          icon={TerminalIcon}
          label="Command"
          title="Copy CLI command"
          value={ticket.fmt.command}
          tabIndex={1}
        />
      </div>
      <div>
        <select
          className="form-control form-control-sm"
          disabled={tickets.length < 2}
          tabIndex={1}
          {...select}
        >
          {tickets.map((t, index) => (
            // eslint-disable-next-line react/no-array-index-key
            <option key={index} value={index}>
              {t.title}
            </option>
          ))}
        </select>
      </div>
    </form>
  );
}

/* eslint-enable jsx-a11y/tabindex-no-positive */

TicketControls.propTypes = {
  tickets: PropTypes.arrayOf(TicketShape.isRequired).isRequired,
};

export default TicketControls;
