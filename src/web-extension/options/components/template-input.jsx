import React from 'react';
import PropTypes from 'prop-types';
import TextareaAutosize from 'react-textarea-autosize';

function TemplateInputElement({ multiline, ...props }) {
  if (multiline) {
    return <TextareaAutosize {...props} />;
  }

  return <input type="text" {...props} />;
}

TemplateInputElement.propTypes = {
  multiline: PropTypes.bool.isRequired,
};

const noop = () => {};

function TemplateInput(props) {
  const {
    id,
    name,
    label,
    icon,
    value,
    multiline,
    fallback,
    disabled,
    onChange,
    preview,
  } = props;

  const setValue = (newValue) => onChange({ target: { name, value: newValue } });

  const onFocus = value ? noop : () => setValue(fallback);
  const onBlur = value === fallback ? () => setValue('') : noop;

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
        <TemplateInputElement
          className="form-control px-2 py-3"
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
          <pre className="small text-muted mw-100 m-0 overflow-auto">{preview}</pre>
        </div>
      </div>
    </div>
  );
}

TemplateInput.defaultProps = {
  multiline: false,
};

TemplateInput.propTypes = {
  disabled: PropTypes.bool.isRequired,
  fallback: PropTypes.string.isRequired,
  id: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  icon: PropTypes.node.isRequired,
  name: PropTypes.string.isRequired,
  multiline: PropTypes.bool,
  onChange: PropTypes.func.isRequired,
  preview: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
};

export { TemplateInputElement };
export default TemplateInput;
