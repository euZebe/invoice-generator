import React, { useState } from "react";
import { Box, Text } from "ink";
import TextInput from "ink-text-input";

type Props = {
	label: string;
	onValidNumberSubmitted: (value: string) => void;
	initialValue?: string;
};

const NumberInput = ({
	label,
	onValidNumberSubmitted,
	initialValue,
}: Props) => {
	const [value, setValue] = useState<string>(initialValue || "");

	return (
		<>
			<Box>
				<Box marginRight={1}>
					<Text>{label}:</Text>
				</Box>

				<TextInput
					value={value}
					onChange={setValue}
					onSubmit={(newValue) => {
						if (parseInt(newValue, 10).toString() === value) {
							onValidNumberSubmitted(newValue);
						}
					}}
				/>
			</Box>
			{value !== "" && parseInt(value, 10).toString() !== value ? (
				<Text color="red">Value must be a number</Text>
			) : null}
		</>
	);
};

export default NumberInput;
