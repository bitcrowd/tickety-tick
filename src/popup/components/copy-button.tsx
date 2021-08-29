import pbcopy from "copy-text-to-clipboard";
import React, { useCallback, useEffect, useRef, useState } from "react";

function useDelayed(fn: () => void, ms: number) {
  const timeout = useRef<ReturnType<typeof setTimeout>>();
  const callback = useRef(fn);

  const clear = useCallback(() => {
    if (timeout.current) clearTimeout(timeout.current);
    timeout.current = undefined;
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

export type Props = React.PropsWithChildren<{ value: string }> &
  React.HTMLAttributes<HTMLButtonElement>;

function CopyButton({ children = null, value, ...rest }: Props) {
  const [copied, setCopied] = useState(false);
  const closeWithDelay = useDelayed(close, 600);

  const handler = useCallback(() => {
    pbcopy(value);
    setCopied(true);
    closeWithDelay();
  }, [closeWithDelay, value]);

  return (
    <button type="button" {...rest} onClick={handler}>
      {typeof children === "function" ? children(copied) : children}
    </button>
  );
}

export default CopyButton;
