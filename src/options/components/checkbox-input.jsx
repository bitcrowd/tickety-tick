import PropTypes from 'prop-types';
import React from 'react';

function CheckboxInput(props) {
  const { checked, disabled, id, label, name, onChange } = props;

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

CheckboxInput.propTypes = {
  checked: PropTypes.bool.isRequired,
  disabled: PropTypes.bool.isRequired,
  id: PropTypes.string.isRequired,
  label: PropTypes.node.isRequired,
  name: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
};

export default CheckboxInput;
