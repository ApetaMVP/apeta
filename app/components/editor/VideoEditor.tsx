import { Box } from "@mantine/core";
import {
  IconArrowNarrowRight,
  IconBrush,
  IconPencil,
  IconRectangle,
} from "@tabler/icons";
import { useState } from "react";
import Content from "./Content";

interface VideoEditorProps {}

export default function VideoEditor(props: VideoEditorProps) {
  const [color, setColor] = useState("black");
  const [tool, setTool] = useState("brush");

  const toolbarItems = [
    { name: "pencil", image: <IconPencil /> },
    { name: "line", image: <IconArrowNarrowRight /> },
    { name: "brush", image: <IconBrush /> },
    { name: "rectangle", image: <IconRectangle /> },
  ];

  const changeColor = (e: any) => {
    setColor(e.target.style.backgroundColor);
  };

  const changeTool = (e: any, tool: any) => {
    setTool(tool);
  };

  return (
    <Box style={{ cursor: "crosshair" }}>
      <Content
        items={toolbarItems}
        activeItem={tool}
        handleClick={changeTool}
        color={color}
      />
      {/* <ColorPanel selectedColor={color} handleClick={changeColor} /> */}
    </Box>
  );
}
