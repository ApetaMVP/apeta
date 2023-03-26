import { useEffect, useRef, useState } from "react";
import Toolbox from "./Toolbox";

interface ContentProps {
  items: any;
  activeItem: any;
  color: string;
  handleClick: any;
}

export default function Content(props: ContentProps) {
  const { items, activeItem, color, handleClick } = props;

  const [isDrawing, setIsDrawing] = useState(false);
  const [offsetX, setOffsetX] = useState(0);
  const [offsetY, setOffsetY] = useState(0);
  const [startX, setStartX] = useState(0);
  const [startY, setStartY] = useState(0);
  const canvasRef = useRef(null);
  const canvasOverlayRef = useRef(null);

  useEffect(() => {
    const { ctx } = getCtxs();
    let localCanvasRef = document.getElementById("canvas") as HTMLCanvasElement;
    let canvasRect = localCanvasRef.getBoundingClientRect();
    setOffsetX(canvasRect.left);
    setOffsetY(canvasRect.top);
    var background = new Image();
    background.src =
      "https://cdn.sstatic.net/Img/teams/teams-illo-free-sidebar-promo.svg?v=47faa659a05e";
    background.onload = () => {
      ctx.drawImage(background, 0, 0);
    };
  }, [canvasRef, canvasOverlayRef]);

  const getCtxs = () => {
    let ctx = (
      document.getElementById("canvas") as HTMLCanvasElement
    ).getContext("2d");
    let ctxOverlay = (
      document.getElementById("canvasOverlay") as HTMLCanvasElement
    ).getContext("2d");
    return { ctx, ctxOverlay };
  };

  const handleMouseDown = (e: any) => {
    setIsDrawing(true);
    const { ctx, ctxOverlay } = getCtxs();
    ctx.beginPath();
    ctx.strokeStyle = color;
    ctx.lineWidth = 1;
    ctx.lineJoin = ctx.lineCap = "round";
    if (activeItem === "pencil" || activeItem === "brush") {
      ctx.moveTo(e.clientX - offsetX, e.clientY - offsetY);
      if (activeItem === "brush") {
        ctx.lineWidth = 5;
      }
    } else if (activeItem === "line" || activeItem === "rectangle") {
      ctxOverlay.strokeStyle = color;
      ctxOverlay.lineWidth = 1;
      ctxOverlay.lineJoin = ctx.lineCap = "round";
      setStartX(e.clientX - offsetX);
      setStartY(e.clientY - offsetY);
    }
    console.log("done");
  };

  const handleMouseMove = (e: any) => {
    const { ctx, ctxOverlay } = getCtxs();
    if (isDrawing) {
      if (activeItem === "pencil" || activeItem === "brush") {
        ctx.lineTo(e.clientX - offsetX, e.clientY - offsetY);
        ctx.stroke();
      }
      if (activeItem === "line") {
        ctxOverlay.clearRect(0, 0, 600, 480);
        ctxOverlay.beginPath();
        ctxOverlay.moveTo(startX, startY);
        ctxOverlay.lineTo(e.clientX - offsetX, e.clientY - offsetY);
        ctxOverlay.stroke();
        ctxOverlay.closePath();
      }
      if (activeItem === "rectangle") {
        ctxOverlay.clearRect(0, 0, 600, 480);
        let width = e.clientX - offsetX - startX;
        let height = e.clientY - offsetY - startY;
        ctxOverlay.strokeRect(startX, startY, width, height);
      }
    }
  };

  const handleMouseUp = (e: any) => {
    const { ctx, ctxOverlay } = getCtxs();
    if (activeItem === "line") {
      ctxOverlay.clearRect(0, 0, 600, 480);
      ctx.moveTo(startX, startY);
      ctx.lineTo(e.clientX - offsetX, e.clientY - offsetY);
      ctx.stroke();
    }
    if (activeItem === "rectangle") {
      let width = e.clientX - offsetX - startX;
      let height = e.clientY - offsetY - startY;
      ctxOverlay.clearRect(0, 0, 600, 480);
      ctx.strokeRect(startX, startY, width, height);
    }
    ctx.closePath();
    setIsDrawing(false);
  };

  return (
    <>
      <Toolbox
        items={items}
        activeItem={activeItem}
        handleClick={handleClick}
      />
      <div className="canvas">
        <canvas
          className="canvas-actual"
          width="600px"
          height="480px"
          ref={canvasRef}
          id="canvas"
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
        />
        <canvas
          className="canvas-overlay"
          width="600px"
          height="480px"
          ref={canvasOverlayRef}
          id="canvasOverlay"
        />
      </div>
    </>
  );
}
