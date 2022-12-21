import React, { useState } from "react";
import TextInput from "ink-text-input";

type Props = {
  onSubmit: (value: string) => void;
  initialValue?: string;
};

const TextFormInput = ({ initialValue, onSubmit }: Props) => {
  const [value, setValue] = useState(initialValue || "");
  return <TextInput value={value} onChange={setValue} onSubmit={onSubmit} />;
};

export default TextFormInput;
