import { useEffect, useRef } from "react";

interface VideoProps {
  src: string;
  timestamp: number;
  onLoaded: (duration: number) => void;
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
      // @ts-ignore
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
      // @ts-ignore
      const ctx = canvas.getContext("2d");
      // @ts-ignore
      ctx!.drawImage(video, 0, 0, canvas.width, canvas.height);
      // @ts-ignore
      const imageSrc = canvas.toDataURL();
      return imageSrc;
    }
  };

  const handleLoadedMetaData = () => {
    const video = videoRef.current;
    if (!video) return;
    // @ts-ignore
    const roundedDuration = Math.round(video!.duration);
    console.log({ roundedDuration });
    return roundedDuration;
  };

  const handleOnCanPlayThrough = () => {
    handlePause();

    const video = videoRef.current;
    if (!video) return;
    // @ts-ignore
    const roundedDuration = Math.round(video!.duration);
    onLoaded(roundedDuration);
  };

  return (
    <>
      <video
        controls
        autoPlay
        ref={videoRef}
        src={src}
        onCanPlayThrough={handleOnCanPlayThrough}
        onPause={handlePause}
        onPlay={onPlay}
        crossOrigin="anonymous"
        onSeeked={handlePause}
      />
      <canvas ref={canvasRef} style={{ display: "none" }} />
    </>
  );
}
