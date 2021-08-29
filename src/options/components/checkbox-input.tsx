import React from "react";

export type Props = {
  checked: boolean;
  disabled: boolean;
  id: string;
  label: React.ReactElement;
  name: string;
  onChange: React.ChangeEventHandler<HTMLInputElement>;
};

function CheckboxInput({
  checked,
  disabled,
  id,
  label,
  name,
  onChange,
}: Props) {
  return (
    <div className="form-group">
      <div className="input-group">
        <div className="input-group-prepend">
          <div className="input-group-text">
            <input
              className="input-checkbox"
              type="checkbox"
              id={id}
              name={name}
              checked={checked}
              disabled={disabled}
              onChange={onChange}
            />
          </div>
        </div>
        <div className="form-control px-2">
          <label htmlFor={id}>{label}</label>
        </div>
      </div>
    </div>
  );
}

export default CheckboxInput;
