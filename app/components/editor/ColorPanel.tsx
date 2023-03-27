import { ColorPicker, Group } from "@mantine/core";
import { useState } from "react";

interface ColorPanelProps {
  selectedColor: string;
  handleClick: (e: any, color: string) => void;
}

export default function ColorPanel(props: ColorPanelProps) {
  const { selectedColor, handleClick } = props;
  const [value, setValue] = useState(selectedColor);

  return (
    <Group>
      <ColorPicker
        format="hex"
        value={value}
        onChange={(e) => {
          setValue(e);
          handleClick(e, e);
        }}
      />
    </Group>
  );
}
