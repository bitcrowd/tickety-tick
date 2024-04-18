import { fireEvent, render, waitFor } from "@testing-library/react";
import React from "react";

import type { Props, TemplateInputElementProps } from "./template-input";
import TemplateInput, { TemplateInputElement } from "./template-input";

describe("template-input", () => {
  function subject(overrides: Partial<Props>) {
    const defaults: Props = {
      id: "template-input-id",
      name: "template-input-name",
      label: "template-label",
      icon: <span>icon</span>,
      value: "template-value",
      fallback: "template-fallback",
      disabled: false,
      onChange: jest.fn(),
      preview: "template-preview",
    };

    const props = { ...defaults, ...overrides };
    const screen = render(<TemplateInput {...props} />);

    return screen;
  }

  it("renders an input label", () => {
    const label = "Awesome Template Label";
    const screen = subject({ id: "id-1", label });
    const input = screen.getByRole("textbox", { name: label });

    expect(input).toBeInTheDocument();
  });

  it("renders a code preview", () => {
    const preview = "# Markdown Preview\nWith <code>html</code>";
    const screen = subject({ id: "id-1", preview });
    const preformatted = screen.getByTestId("preview");

    expect(preformatted).toBeInTheDocument();
    expect(preformatted).toHaveTextContent(
      "# Markdown Preview With <code>html</code>",
    );
  });

  it("renders a code preview for an async preview value", async () => {
    const preview = new Promise<string>((resolve) =>
      resolve("# Markdown Preview\nWith <code>html</code>"),
    );
    const screen = subject({ id: "id-1", preview });

    const preformatted = screen.getByTestId("preview");

    await waitFor(() => {
      expect(preformatted).toBeInTheDocument();
      expect(preformatted).toHaveTextContent(
        "# Markdown Preview With <code>html</code>",
      );
    });
  });

  it("renders an input label icon", () => {
    const screen = subject({ icon: <span data-testid="icon">icon</span> });

    const icon = screen.getByTestId("icon");
    expect(icon).toBeInTheDocument();
  });

  it("renders an input field", () => {
    const screen = subject({ id: "id-2", name: "name-2", value: "vvv" });
    const input = screen.getByRole("textbox");

    expect(input).toHaveAttribute("id", "id-2");
    expect(input).toHaveAttribute("name", "name-2");
    expect(input).toHaveValue("vvv");
  });

  it("notifies about input changes", () => {
    const onChange = jest.fn();
    const screen = subject({ onChange });
    const input = screen.getByRole("textbox");

    fireEvent.change(input, { target: { value: "changed" } });

    expect(onChange).toHaveBeenCalled();
  });

  it("disables the input if requested", () => {
    const screen = subject({ disabled: true });
    const input = screen.getByRole("textbox");

    expect(input).toBeDisabled();
  });

  it("renders the default value used as a placeholder", () => {
    const screen = subject({ fallback: "fbfbfb" });
    const input = screen.getByRole("textbox");

    expect(input).toHaveAttribute("placeholder", "fbfbfb");
  });

  it("populates an empty input with the fallback value on focus", () => {
    const onChange = jest.fn();
    const screen = subject({
      fallback: "fb-value",
      name: "tpl",
      value: "",
      onChange,
    });

    const input = screen.getByRole("textbox");

    fireEvent.focus(input);

    expect(onChange).toHaveBeenCalledWith({
      target: { name: "tpl", value: "fb-value" },
    });
  });

  it("preserves non-empty values different from the fallback on focus", () => {
    const onChange = jest.fn();
    const screen = subject({ fallback: "fb", value: "other", onChange });
    const input = screen.getByRole("textbox");

    fireEvent.focus(input);

    expect(onChange).not.toHaveBeenCalled();
  });

  it("resets an input containing the fallback value on blur", () => {
    const onChange = jest.fn();
    const screen = subject({
      fallback: "fb-value",
      name: "tpl",
      value: "fb-value",
      onChange,
    });

    const input = screen.getByRole("textbox");

    fireEvent.blur(input);

    expect(onChange).toHaveBeenCalledWith({
      target: { name: "tpl", value: "" },
    });
  });

  it("preserves non-empty values different from the fallback on blur", () => {
    const onChange = jest.fn();
    const screen = subject({ fallback: "fb", value: "other", onChange });
    const input = screen.getByRole("textbox");

    fireEvent.blur(input);

    expect(onChange).not.toHaveBeenCalled();
  });
});

describe("template-input-element", () => {
  function subject(overrides: Partial<TemplateInputElementProps>) {
    const defaults = {
      name: "test-input-name",
      value: "test-input-value",
      placeholder: "test-placeholder",
      disabled: false,
      multiline: false,
    };
    const props = { ...defaults, ...overrides };
    return render(<TemplateInputElement {...props} />);
  }

  it("renders a text input for single-line values", () => {
    const onChange = jest.fn();
    const screen = subject({ multiline: false, onChange });
    const input = screen.getByRole("textbox");

    expect(input).toHaveAttribute("type", "text");
    expect(input).toHaveAttribute("name", "test-input-name");
    expect(input).toHaveAttribute("placeholder", "test-placeholder");
    expect(input).toHaveValue("test-input-value");
    expect(input).not.toBeDisabled();

    fireEvent.change(input, { target: { value: "changed" } });

    expect(onChange).toHaveBeenCalled();
  });

  it("renders a textarea for multi-line values", () => {
    const onChange = jest.fn();
    const screen = subject({ multiline: true, onChange });
    const textarea = screen.getByRole("textbox");

    expect(textarea).toHaveAttribute("name", "test-input-name");
    expect(textarea).toHaveAttribute("placeholder", "test-placeholder");
    expect(textarea).toHaveValue("test-input-value");
    expect(textarea).not.toBeDisabled();

    fireEvent.change(textarea, { target: { value: "changed" } });

    expect(onChange).toHaveBeenCalled();
  });
});
