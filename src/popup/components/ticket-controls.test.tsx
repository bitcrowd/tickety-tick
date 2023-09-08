import { fireEvent, render } from "@testing-library/react";
import React from "react";

import { ticket as make } from "../../../test/factories";
import type { Props } from "./ticket-controls";
import TicketControls from "./ticket-controls";

describe("ticket-controls", () => {
  function subject(overrides: Partial<Props>) {
    const defaults: Props = {
      tickets: ["raz", "dva", "tri"].map((title, i) =>
        make({ id: `${i + 1}`, title }),
      ),
    };
    const props = { ...defaults, ...overrides };
    return render(<TicketControls {...props} />);
  }

  it("renders for multiple tickets", () => {
    expect(subject({}).asFragment()).toMatchSnapshot();
  });

  it("renders for a single ticket", () => {
    const tickets = [make({ id: "1", title: "raz" })];
    expect(subject({ tickets })).toMatchSnapshot();
  });

  it("renders a dropdown if there is more than one ticket", () => {
    const tickets = ["raz", "dva", "tri"].map((title, i) =>
      make({ id: `${i + 1}`, title }),
    );
    const screen = subject({ tickets });
    const select = screen.getByRole("combobox");
    expect(select).not.toBeDisabled();
  });

  it("renders a disabled dropdown if there is only one ticket", () => {
    const tickets = [make({ id: "2", title: "dva" })];
    const screen = subject({ tickets });
    const select = screen.getByRole("combobox");
    expect(select).toBeDisabled();
  });

  it("renders copy buttons for branch, commit and command of the selected ticket", () => {
    const ticket1 = make({ id: "1", title: "raz" });
    const ticket2 = make({ id: "2", title: "dva" });
    const screen = subject({ tickets: [ticket1, ticket2] });
    const select = screen.getByRole("combobox");
    let buttons = screen.getAllByRole("button") as HTMLButtonElement[];

    expect(buttons).toHaveLength(3);
    expect(buttons.map((button) => button.value)).toEqual([
      ticket1.fmt.branch,
      ticket1.fmt.commit,
      ticket1.fmt.command,
    ]);

    // select the second ticket (index = 1)
    fireEvent.change(select, { target: { value: 1 } });

    buttons = screen.getAllByRole("button") as HTMLButtonElement[];
    expect(buttons).toHaveLength(3);
    expect(buttons.map((button) => button.value)).toEqual([
      ticket2.fmt.branch,
      ticket2.fmt.commit,
      ticket2.fmt.command,
    ]);
  });

  it("allows to cycle through the buttons and the select via the tab key", () => {
    const screen = subject({});
    const buttons = screen.getAllByRole("button");
    const select = screen.getByRole("combobox");

    buttons.forEach((button) => {
      expect(button).toHaveAttribute("tabIndex", "1");
    });
    expect(select).toHaveAttribute("tabIndex", "1");
  });
});
