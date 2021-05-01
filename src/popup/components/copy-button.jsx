import pbcopy from 'copy-text-to-clipboard';
import PropTypes from 'prop-types';
import React, { useCallback, useEffect, useRef, useState } from 'react';

function useDelayed(fn, ms) {
  const timeout = useRef(null);
  const callback = useRef(fn);

  const clear = useCallback(() => {
    if (timeout.current) clearTimeout(timeout.current);
    timeout.current = null;
  }, []);

  const run = useCallback(() => {
    if (timeout.current) clearTimeout(timeout.current);
    timeout.current = setTimeout(() => callback.current(), ms);
  }, [ms]);

  useEffect(() => {
    callback.current = fn;
  }, [fn]);

  useEffect(() => clear, [clear]);

  return run;
}

function close() {
  window.close();
}

function CopyButton({ children, value, ...rest }) {
  const [copied, setCopied] = useState(false);
  const closeWithDelay = useDelayed(close, 600);

  const handler = useCallback(() => {
    pbcopy(value);
    setCopied(true);
    closeWithDelay();
  }, [closeWithDelay, value]);

  return (
    <button type="button" {...rest} onClick={handler}>
      {typeof children === 'function' ? children(copied) : children}
    </button>
  );
}

CopyButton.propTypes = {
  children: PropTypes.oneOfType([PropTypes.func, PropTypes.node]),
  value: PropTypes.string.isRequired,
};

CopyButton.defaultProps = {
  children: null,
};

export default CopyButton;
