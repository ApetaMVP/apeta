import { useEffect, useRef } from "react";

interface VideoProps {
  src: string;
  timestamp: number;
  onLoaded: () => void;
  onTimestamp: (timestamp: number) => void;
  onFrame: (frame: string) => void;
  onPlay: () => void;
  onPause: () => void;
}

export default function Video(props: VideoProps) {
  const { src, timestamp, onLoaded, onTimestamp, onFrame, onPause, onPlay } =
    props;
  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  useEffect(() => {
    if (timestamp !== null) {
      videoRef!.current!.currentTime = timestamp;
    }
  }, [timestamp]);

  const handlePause = () => {
    const frame = captureImage();
    if (frame) {
      onFrame(frame);
    }
    /* tslint:disable:no-string-literal */
    const t = Number(videoRef?.current?.["currentTime"]);
    if (onTimestamp) {
      onTimestamp(t);
    }
    onPause();
  };

  const captureImage = () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (video && canvas) {
      const ctx = canvas.getContext("2d");
      ctx!.drawImage(video, 0, 0, canvas.width, canvas.height);
      const imageSrc = canvas.toDataURL();
      return imageSrc;
    }
  };

  return (
    <>
      <video
        controls
        autoPlay
        ref={videoRef}
        src={src}
        onCanPlayThrough={(_e) => {
          handlePause();
          onLoaded();
        }}
        onPause={handlePause}
        onPlay={onPlay}
        crossOrigin="anonymous"
        onSeeked={handlePause}
      />
      <canvas ref={canvasRef} style={{ display: "none" }} />
    </>
  );
}
