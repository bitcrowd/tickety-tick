import { useState } from 'react';

export default function useInput(initialValue) {
  const [value, setValue] = useState(initialValue);

  function onChange(event) {
    return setValue(event.target.value);
  }

  return { value, onChange };
}
