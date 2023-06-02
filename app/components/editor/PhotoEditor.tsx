import {
  IconArrowNarrowRight,
  IconBrush,
  IconPencil,
  IconRectangle,
} from "@tabler/icons";
import { useEffect, useState } from "react";
import Content from "./Content";

interface PhotoEditorProps {
  frame: string;
  onImg: (image: string) => void;
  setHasMarkedImg: (hasMarkedImg: boolean) => void;
}

export default function PhotoEditor(props: PhotoEditorProps) {
  const { frame, onImg, setHasMarkedImg } = props;
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

  useEffect(() => {
    onImg(frame);
  }, [frame]);

  return (
    <Content
      items={toolbarItems}
      activeItem={tool}
      handleTool={changeTool}
      handleColor={changeColor}
      color={color}
      frame={frame}
      onImg={onImg}
      setHasMarkedImg={setHasMarkedImg}
    />
  );
}
