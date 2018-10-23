import React from 'react';
import PropTypes from 'prop-types';

function TemplateInput(props) {
  const {
    id,
    name,
    label,
    value,
    fallback,
    disabled,
    onChange,
  } = props;

  return (
    <div className="form-group">
      <label className="font-weight-bold" htmlFor={id}>{label}</label>
      <input
        className="form-control"
        type="text"
        id={id}
        name={name}
        value={value}
        placeholder="Default"
        disabled={disabled}
        onChange={onChange}
      />
      <small className="form-text text-muted">
        Default:
        {' '}
        {fallback}
      </small>
    </div>
  );
}


TemplateInput.propTypes = {
  disabled: PropTypes.bool.isRequired,
  fallback: PropTypes.string.isRequired,
  id: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  value: PropTypes.string.isRequired,
};

export default TemplateInput;
