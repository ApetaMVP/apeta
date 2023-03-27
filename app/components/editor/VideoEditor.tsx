import {
  IconArrowNarrowRight,
  IconBrush,
  IconPencil,
  IconRectangle,
} from "@tabler/icons";
import { useState } from "react";
import Content from "./Content";

interface VideoEditorProps {
  frame: string;
  onImg: (image: string) => void;
}

export default function VideoEditor(props: VideoEditorProps) {
  const { frame, onImg } = props;
  const [color, setColor] = useState("#d40b0b");
  const [tool, setTool] = useState("brush");

  const toolbarItems = [
    { name: "brush", image: <IconBrush /> },
    { name: "pencil", image: <IconPencil /> },
    { name: "line", image: <IconArrowNarrowRight /> },
    { name: "rectangle", image: <IconRectangle /> },
  ];

  const changeColor = (e: any, c: any) => {
    setColor(c);
  };

  const changeTool = (e: any, t: any) => {
    setTool(t);
  };

  return (
    <Content
      items={toolbarItems}
      activeItem={tool}
      handleTool={changeTool}
      handleColor={changeColor}
      color={color}
      frame={frame}
      onImg={onImg}
    />
  );
}
