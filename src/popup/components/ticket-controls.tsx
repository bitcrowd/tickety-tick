import {
  CheckIcon,
  CommentIcon,
  GitBranchIcon,
  TerminalIcon,
} from "@primer/octicons-react";
import React from "react";

import type { TicketWithFmt } from "../../types";
import useInput from "../hooks/use-input";
import type { Props as CopyButtonProps } from "./copy-button";
import CopyButton from "./copy-button";

function TicketCopyButton({
  icon,
  label,
  title,
  value,
  ...rest
}: CopyButtonProps & {
  icon: React.ElementType;
  label: string;
  title: string;
  value: string;
}) {
  return (
    <CopyButton
      className="d-flex justify-content-center align-items-center btn btn-primary"
      title={title}
      value={value}
      {...rest}
    >
      {(copied: boolean) => {
        const IconComponent = copied ? CheckIcon : icon;

        return (
          <>
            <IconComponent size={18} />
            <span className="pl-1 small btn-label btn-label-conceal">
              {copied ? "Copied" : label}
            </span>
          </>
        );
      }}
    </CopyButton>
  );
}

export type Props = {
  tickets: TicketWithFmt[];
};

/* eslint-disable jsx-a11y/tabindex-no-positive */

function TicketControls({ tickets }: Props) {
  const select = useInput("0");

  const ticket = tickets[Number.parseInt(select.value ?? "0", 10)];

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

export default TicketControls;
