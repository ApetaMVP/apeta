import { useEffect, useRef } from "react";

interface VideoProps {
  src: string;
  timestamp: number;
  onTimestamp: (timestamp: number) => void;
  onFrame: (frame: string) => void;
  onPlay: () => void;
  onPause: () => void;
}

export default function Video(props: VideoProps) {
  const { src, timestamp, onTimestamp, onFrame, onPause, onPlay } = props;
  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  useEffect(() => {
    if (timestamp !== null) {
      videoRef!.current!.currentTime = timestamp;
    }
    handlePause();
  }, [timestamp]);

  const handlePause = () => {
    const frame = captureImage();
    if (frame) {
      onFrame(frame);
    }
    const timestamp = Number(videoRef?.current?.["currentTime"]);
    if (onTimestamp) {
      onTimestamp(timestamp);
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
        ref={videoRef}
        src={src}
        onPause={handlePause}
        onPlay={onPlay}
        crossOrigin="anonymous"
        onSeeked={handlePause}
      />
      <canvas ref={canvasRef} style={{ display: "none" }} />
    </>
  );
}
