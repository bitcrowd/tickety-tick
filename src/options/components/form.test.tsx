/**
 * @jest-environment jsdom
 */
import type { RenderResult } from "@testing-library/react";
import {
  fireEvent,
  render as renderComponent,
  waitFor,
} from "@testing-library/react";
import React from "react";

import format, { helpers } from "../../core/format";
import type { Props } from "./form";
import Form from "./form";

jest.mock("../../core/format", () =>
  Object.assign(jest.fn(), jest.requireActual("../../core/format")),
);

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function createMockStore(data: any) {
  return {
    get: jest.fn().mockResolvedValue(data),
    set: jest.fn().mockResolvedValue(undefined),
  };
}

describe("form", () => {
  function render(overrides: Partial<Props>) {
    const defaults: Props = { store: createMockStore({}) };
    const props = { ...defaults, ...overrides };
    return renderComponent(<Form {...props} />);
  }

  function waitForLoadingToFinish(screen: RenderResult) {
    return waitFor(() => screen.getByRole("button", { name: "Save" }));
  }

  beforeEach(() => {
    (format as jest.Mock).mockImplementation((_templates, autofmt) => ({
      commit: () =>
        new Promise((resolve) => resolve(`formatted-commit (${autofmt})`)),
      branch: () => `formatted-branch (${autofmt})`,
      command: () =>
        new Promise((resolve) => resolve(`formatted-command (${autofmt})`)),
    }));
  });

  afterEach(() => {
    (format as jest.Mock).mockReset();
  });

  [
    ["branch", "Branch Name Format"],
    ["commit", "Commit Message Format"],
    ["command", "Command Format"],
  ].forEach(([key, name]) => {
    it(`renders an input for the ${key} format`, async () => {
      const value = `${key}-template`;
      const store = createMockStore({ templates: { [key]: value } });
      const screen = render({ store });

      await waitForLoadingToFinish(screen);

      const input = screen.getByRole("textbox", { name });
      expect(input).toHaveValue(value);

      fireEvent.change(input, { target: { value: `${key}++` } });
      expect(input).toHaveValue(`${key}++`);
    });
  });

  it("renders a checkbox to toggle commit message auto-formatting", async () => {
    const store = createMockStore({ options: { autofmt: true } });
    const screen = render({ store });

    await waitForLoadingToFinish(screen);

    const checkbox = screen.getByRole("checkbox", {
      name: /Auto-format commit message/,
    });

    expect(checkbox).toBeChecked();
    expect(format).toHaveBeenCalledWith(expect.any(Object), true);
    expect(screen.getByText("formatted-commit (true)")).toBeInTheDocument();

    fireEvent.click(checkbox);

    expect(checkbox).not.toBeChecked();
    expect(format).toHaveBeenLastCalledWith(expect.any(Object), false);
    await waitFor(() => {
      expect(screen.getByText("formatted-commit (false)")).toBeInTheDocument();
    });
  });

  it("renders the names & descriptions of available template helpers", async () => {
    const screen = render({});
    await waitForLoadingToFinish(screen);

    Object.values(helpers).forEach((fn) => {
      expect(screen.container).toHaveTextContent(
        "description" in fn ? fn.description : fn.name,
      );
    });
  });

  it("stores templates and options on submit and disables form elements while saving", async () => {
    const store = createMockStore({
      templates: {
        branch: "branch",
        commit: "commit",
        command: "command",
      },
      options: { autofmt: true },
    });

    const screen = render({ store });

    await waitForLoadingToFinish(screen);

    const checkbox = screen.getByRole("checkbox", {
      name: /Auto-format commit message/,
    });
    const inputs = [
      ["branch", "Branch Name Format"],
      ["commit", "Commit Message Format"],
      ["command", "Command Format"],
    ].map<[string, HTMLInputElement]>(([key, name]) => [
      key,
      screen.getByRole("textbox", { name }) as HTMLInputElement,
    ]);

    fireEvent.click(checkbox);

    inputs.forEach(([key, input]) => {
      fireEvent.change(input, { target: { value: `${key}++` } });
    });

    const saveButton = screen.getByRole("button", { name: "Save" });
    fireEvent.click(saveButton);

    const changed = {
      templates: {
        branch: "branch++",
        commit: "commit++",
        command: "command++",
      },
      options: { autofmt: false },
    };

    expect(store.set).toHaveBeenCalledWith(changed);

    expect(saveButton).toBeDisabled();
    expect(checkbox).toBeDisabled();
    inputs.forEach(([, input]) => expect(input).toBeDisabled());

    await waitFor(() => {
      expect(saveButton).not.toBeDisabled();
      expect(checkbox).not.toBeDisabled();
      inputs.forEach(([, input]) => expect(input).not.toBeDisabled());
    });
  });
});
