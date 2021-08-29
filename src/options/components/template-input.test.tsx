import { shallow } from "enzyme";
import React from "react";
import TextareaAutosize from "react-textarea-autosize";

import type { Props, TemplateInputElementProps } from "./template-input";
import TemplateInput, { TemplateInputElement } from "./template-input";

describe("template-input", () => {
  function render(overrides: Partial<Props>) {
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
    const wrapper = shallow(<TemplateInput {...props} />);

    return wrapper;
  }

  it("renders an input label", () => {
    const wrapper = render({ id: "id-1", label: "Awesome Template Label" });
    const label = wrapper.find("label");
    expect(label.prop("htmlFor")).toBe("id-1");
    expect(label.text()).toContain("Awesome Template Label");
  });

  it("renders an input label icon", () => {
    const icon = <span>icon</span>;
    const wrapper = render({ id: "id-2", icon });
    const label = wrapper.find("label");
    expect(label.prop("htmlFor")).toBe("id-2");
    expect(label.contains(icon)).toBe(true);
  });

  it("renders an input field", () => {
    const wrapper = render({ id: "id-2", name: "name-2", value: "vvv" });
    const input = wrapper.find(TemplateInputElement);
    expect(input.prop("id")).toBe("id-2");
    expect(input.prop("name")).toBe("name-2");
    expect(input.prop("value")).toBe("vvv");
  });

  it("notifies about input changes", () => {
    const onChange = () => "called on change";
    const wrapper = render({ onChange });
    const input = wrapper.find(TemplateInputElement);
    expect(input.prop("onChange")).toBe(onChange);
  });

  it("disables the input if requested", () => {
    const wrapper = render({ disabled: true });
    const input = wrapper.find(TemplateInputElement);
    expect(input.prop("disabled")).toBe(true);
  });

  it("renders the default value used as a placeholder", () => {
    const wrapper = render({ fallback: "fbfbfb" });
    const input = wrapper.find(TemplateInputElement);
    expect(input.prop("placeholder")).toContain("fbfbfb");
  });

  it("populates an empty input with the fallback value on focus", () => {
    const onChange = jest.fn();
    const wrapper = render({
      fallback: "fb-value",
      name: "tpl",
      value: "",
      onChange,
    });

    const input = wrapper.find(TemplateInputElement);

    input.simulate("focus");

    expect(onChange).toHaveBeenCalledWith({
      target: { name: "tpl", value: "fb-value" },
    });
  });

  it("preserves non-empty values different from the fallback on focus", () => {
    const onChange = jest.fn();
    const wrapper = render({ fallback: "fb", value: "other", onChange });
    const input = wrapper.find(TemplateInputElement);

    input.simulate("focus");

    expect(onChange).not.toHaveBeenCalled();
  });

  it("resets an input containing the fallback value on blur", () => {
    const onChange = jest.fn();
    const wrapper = render({
      fallback: "fb-value",
      name: "tpl",
      value: "fb-value",
      onChange,
    });

    const input = wrapper.find(TemplateInputElement);

    input.simulate("blur");

    expect(onChange).toHaveBeenCalledWith({
      target: { name: "tpl", value: "" },
    });
  });

  it("preserves non-empty values different from the fallback on blur", () => {
    const onChange = jest.fn();
    const wrapper = render({ fallback: "fb", value: "other", onChange });
    const input = wrapper.find(TemplateInputElement);

    input.simulate("blur");

    expect(onChange).not.toHaveBeenCalled();
  });
});

describe("template-input-element", () => {
  function render(overrides: Partial<TemplateInputElementProps>) {
    const defaults = {
      name: "test-input-name",
      value: "test-input-value",
      placeholder: "test-placeholder",
      disabled: false,
      onChange: jest.fn(),
      multiline: false,
    };

    const props = { ...defaults, ...overrides };
    const wrapper = shallow(<TemplateInputElement {...props} />);

    return wrapper;
  }

  it("renders a text input for single-line values", () => {
    const wrapper = render({ multiline: false });
    const input = wrapper.find("input");
    expect(input.props()).toEqual(
      expect.objectContaining({
        type: "text",
        name: "test-input-name",
        value: "test-input-value",
        placeholder: "test-placeholder",
        disabled: false,
        onChange: expect.any(Function),
      })
    );
  });

  it("renders a textarea for multi-line values", () => {
    const wrapper = render({ multiline: true });
    const textarea = wrapper.find(TextareaAutosize);
    expect(textarea.props()).toEqual(
      expect.objectContaining({
        name: "test-input-name",
        value: "test-input-value",
        placeholder: "test-placeholder",
        disabled: false,
        onChange: expect.any(Function),
      })
    );
  });
});
