import { Card, Center, Stack } from "@mantine/core";
import { useEffect, useRef, useState } from "react";
import ColorPanel from "./ColorPanel";
import Toolbox from "./Toolbox";

interface ContentProps {
  frame: string;
  items: any;
  activeItem: any;
  color: string;
  handleTool: (e: any, tool: string) => void;
  handleColor: (e: any, color: string) => void;
  setHasMarkedImg: (hasMarkedImg: boolean) => void;
  onImg: (image: string) => void;
}

export default function Content(props: ContentProps) {
  const {
    frame,
    items,
    activeItem,
    color,
    handleTool,
    handleColor,
    onImg,
    setHasMarkedImg,
  } = props;

  const [isDrawing, setIsDrawing] = useState(false);
  const [offsetX, setOffsetX] = useState(0);
  const [offsetY, setOffsetY] = useState(0);
  const [startX, setStartX] = useState(0);
  const [startY, setStartY] = useState(0);
  const sectionRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const canvasOverlayRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    // reset offset to cursor position when scrolling or resizing the page
    const updatePosition = () => {
      const localCanvasRef = getCanvas();
      const canvasRect = localCanvasRef.getBoundingClientRect();
      setOffsetX(canvasRect.left);
      setOffsetY(canvasRect.top);
    };
    window.addEventListener("scroll", updatePosition);
    window.addEventListener("resize", updatePosition);

    return () => {
      window.removeEventListener("scroll", updatePosition);
      window.removeEventListener("resize", updatePosition);
    };
  }, []);

  useEffect(() => {
    if (sectionRef.current) {
      const width = sectionRef.current.clientWidth;
      const height =
        Math.floor(sectionRef.current.clientWidth * 0.5625) -
        Math.floor(sectionRef.current.clientWidth * 0.062);
      setCanvasSize(width, height);

      const localCanvasRef = getCanvas();
      const canvasRect = localCanvasRef.getBoundingClientRect();
      setOffsetX(canvasRect.left);
      setOffsetY(canvasRect.top);
    }
  }, [sectionRef]);

  const setCanvasSize = (width: number, height: number) => {
    if (canvasRef.current) {
      canvasRef.current.width = width;
      canvasRef.current.height = height;
      const canvasRect = canvasRef!.current!.getBoundingClientRect();
      setOffsetX(canvasRect.left);
      setOffsetY(canvasRect.top + window.pageYOffset);
    }
  };

  useEffect(() => {
    const { ctx } = getCtxs();
    const localCanvasRef = getCanvas();
    const background = new Image();
    background.onload = () => {
      const canvasAspectRatio = localCanvasRef.width / localCanvasRef.height;
      const imageAspectRatio = background.width / background.height;
      /* tslint:disable:one-variable-per-declaration */
      let drawWidth, drawHeight, x, y;
      if (imageAspectRatio > canvasAspectRatio) {
        drawWidth = localCanvasRef.width;
        drawHeight = drawWidth / imageAspectRatio;
        x = 0;
        y = (localCanvasRef.height - drawHeight) / 2;
      } else {
        drawHeight = localCanvasRef.height;
        drawWidth = drawHeight * imageAspectRatio;
        y = 0;
        x = (localCanvasRef.width - drawWidth) / 2;
      }
      ctx!.drawImage(background, x, y, drawWidth, drawHeight);
      onImg(localCanvasRef.toDataURL());
    };
    background.src = frame;
  }, [canvasRef.current, canvasOverlayRef.current, frame]);

  const getCtxs = () => {
    const ctx = (
      document.getElementById("canvas") as HTMLCanvasElement
    ).getContext("2d");
    const ctxOverlay = (
      document.getElementById("canvasOverlay") as HTMLCanvasElement
    ).getContext("2d");
    return { ctx, ctxOverlay };
  };

  const getCanvas = () => {
    return document.getElementById("canvas") as HTMLCanvasElement;
  };

  const handleMouseDown = (e: any) => {
    setIsDrawing(true);
    const { ctx, ctxOverlay } = getCtxs();
    ctx!.beginPath();
    ctx!.strokeStyle = color;
    ctx!.lineWidth = 1;
    ctx!.lineJoin = ctx!.lineCap = "round";
    if (activeItem === "pencil" || activeItem === "brush") {
      ctx!.moveTo(e.clientX - offsetX, e.clientY - offsetY);
      if (activeItem === "brush") {
        ctx!.lineWidth = 5;
      }
    } else if (activeItem === "line" || activeItem === "rectangle") {
      ctxOverlay!.strokeStyle = color;
      ctxOverlay!.lineWidth = 5;
      ctxOverlay!.lineJoin = ctx!.lineCap = "round";
      setStartX(e.clientX - offsetX);
      setStartY(e.clientY - offsetY);
    }
  };

  const handleMouseMove = (e: any) => {
    const { ctx, ctxOverlay } = getCtxs();
    if (isDrawing) {
      if (activeItem === "pencil" || activeItem === "brush") {
        ctx!.lineTo(e.clientX - offsetX, e.clientY - offsetY);
        ctx!.stroke();
      }
      if (activeItem === "line") {
        ctxOverlay!.clearRect(0, 0, 600, 480);
        ctxOverlay!.beginPath();
        ctxOverlay!.moveTo(startX, startY);
        ctxOverlay!.lineTo(e.clientX - offsetX, e.clientY - offsetY);
        ctxOverlay!.stroke();
        ctxOverlay!.closePath();
      }
      if (activeItem === "rectangle") {
        ctxOverlay!.clearRect(0, 0, 600, 480);
        const width = e.clientX - offsetX - startX;
        const height = e.clientY - offsetY - startY;
        ctxOverlay!.strokeRect(startX, startY, width, height);
      }
    }
  };

  const handleMouseUp = (e: any) => {
    const { ctx, ctxOverlay } = getCtxs();
    if (activeItem === "line") {
      ctxOverlay!.clearRect(0, 0, 600, 480);
      ctx!.moveTo(startX, startY);
      ctx!.lineTo(e.clientX - offsetX, e.clientY - offsetY);
      ctx!.stroke();
    }
    if (activeItem === "rectangle") {
      const width = e.clientX - offsetX - startX;
      const height = e.clientY - offsetY - startY;
      ctxOverlay!.clearRect(0, 0, 600, 480);
      ctx!.strokeRect(startX, startY, width, height);
    }
    ctx!.closePath();
    setIsDrawing(false);
    const localCanvasRef = getCanvas();
    onImg(localCanvasRef.toDataURL());
    setHasMarkedImg(true);
  };

  return (
    <Stack>
      <div className="canvas">
        <Stack>
          <Card withBorder={false} shadow="none">
            <Card.Section ref={sectionRef}>
              <canvas
                className="canvas-actual"
                width={0}
                height={0}
                ref={canvasRef}
                id="canvas"
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                style={{ cursor: "crosshair" }}
              />
            </Card.Section>

            <Center>
              <Stack>
                <Toolbox
                  items={items}
                  activeItem={activeItem}
                  handleClick={handleTool}
                />
                <ColorPanel selectedColor={color} handleClick={handleColor} />
              </Stack>
            </Center>
          </Card>
          <canvas
            className="canvas-overlay"
            width="0%"
            height="0%"
            ref={canvasOverlayRef}
            id="canvasOverlay"
            hidden={true}
          />
        </Stack>
      </div>
    </Stack>
  );
}
