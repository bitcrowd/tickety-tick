import type React from "react";
import { useState } from "react";

type Event = React.ChangeEvent<HTMLInputElement | HTMLSelectElement>;

export default function useInput(initialValue?: string) {
  const [value, setValue] = useState(initialValue);

  function onChange(event: Event) {
    return setValue(event.target.value);
  }

  return { value, onChange };
}
