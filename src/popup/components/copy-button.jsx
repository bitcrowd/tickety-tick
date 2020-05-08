import PropTypes from 'prop-types';
import React, {
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';

import EnvContext from '../env-context';

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

function CopyButton({ children, value, ...rest }) {
  const { close, pbcopy } = useContext(EnvContext);
  const [copied, setCopied] = useState(false);
  const closeWithDelay = useDelayed(close, 600);

  const handler = useCallback(() => {
    pbcopy(value);
    setCopied(true);
    closeWithDelay();
  }, [closeWithDelay, pbcopy, value]);

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
