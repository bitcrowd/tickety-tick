import React from 'react';
import PropTypes from 'prop-types';

function TemplateInput(props) {
  const {
    id,
    name,
    label,
    icon,
    value,
    fallback,
    disabled,
    onChange,
    preview,
  } = props;

  return (
    <div className="form-group mb-4">
      <div className="input-group mb-3">
        <div className="input-group-prepend">
          <label className="input-group-text" htmlFor={id}>
            <span title={label}>
              {icon}
              <span className="sr-only">{label}</span>
            </span>
          </label>
        </div>
        <input
          className="form-control px-2 py-3"
          type="text"
          id={id}
          name={name}
          value={value}
          placeholder={fallback}
          disabled={disabled}
          onChange={onChange}
        />
      </div>
      <div className="card">
        <div className="card-body">
          <pre className="small text-muted w-100 m-0 overflow-auto">{preview}</pre>
        </div>
      </div>
    </div>
  );
}


TemplateInput.propTypes = {
  disabled: PropTypes.bool.isRequired,
  fallback: PropTypes.string.isRequired,
  id: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  icon: PropTypes.node.isRequired,
  name: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  preview: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
};

export default TemplateInput;
