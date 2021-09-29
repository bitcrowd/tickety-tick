import React from "react";
import type { TextareaAutosizeProps } from "react-textarea-autosize";
import TextareaAutosize from "react-textarea-autosize";

function shouldRenderAsTextarea(
  props: React.InputHTMLAttributes<HTMLInputElement> | TextareaAutosizeProps,
  multiline: boolean
): props is TextareaAutosizeProps {
  return multiline;
}

export type TemplateInputElementProps = { multiline: boolean } & (
  | React.InputHTMLAttributes<HTMLInputElement>
  | TextareaAutosizeProps
);

function TemplateInputElement({
  multiline,
  ...props
}: TemplateInputElementProps) {
  if (shouldRenderAsTextarea(props, multiline)) {
    return <TextareaAutosize {...props} />;
  }

  return <input type="text" {...props} />;
}

const noop = () => undefined;

export type Props = {
  disabled: boolean;
  fallback: string;
  id: string;
  label: string;
  icon: React.ReactElement;
  name: string;
  multiline?: boolean;
  onChange: React.ChangeEventHandler<HTMLInputElement>;
  preview: string;
  value: string;
};

function TemplateInput(props: Props) {
  const {
    id,
    name,
    label,
    icon,
    value,
    multiline = false,
    fallback,
    disabled,
    onChange,
    preview,
  } = props;

  const setValue = (newValue: string) =>
    onChange({
      target: { name, value: newValue },
    } as React.ChangeEvent<HTMLInputElement>);

  const onFocus = value ? noop : () => setValue(fallback);
  const onBlur = value === fallback ? () => setValue("") : noop;

  return (
    <div className="form-group mb-4">
      <div className="input-group mb-3">
        <label className="input-group-text" htmlFor={id}>
          <span title={label}>
            {icon}
            <span className="visually-hidden">{label}</span>
          </span>
        </label>
        <TemplateInputElement
          className="form-control p-2"
          id={id}
          name={name}
          value={value}
          multiline={multiline}
          placeholder={fallback}
          disabled={disabled}
          onFocus={onFocus}
          onBlur={onBlur}
          onChange={onChange}
        />
      </div>
      <div className="card">
        <div className="card-body">
          <pre className="small text-muted mw-100 m-0 overflow-auto">
            {preview}
          </pre>
        </div>
      </div>
    </div>
  );
}

export { TemplateInputElement };
export default TemplateInput;
