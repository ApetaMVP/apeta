import React, { useCallback } from "react";
import { BaseSyntheticEvent, useEffect, useRef, useState } from "react";

interface VideoProps {
  src: string;
  timestamp: number;
  paused: boolean;
  onLoaded: (duration: number) => void;
  onTimestamp: (timestamp: number) => void;
  onFrame: (frame: string) => void;
  onPlay: () => void;
  onPause: () => void;
  onProgress: (percentage: number) => void;
}

export default function Video(props: VideoProps) {
  const {
    src,
    timestamp,
    onLoaded,
    onTimestamp,
    onFrame,
    onPause,
    paused,
    onPlay,
    onProgress,
  } = props;

  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  useEffect(() => {
    if (paused) {
      // @ts-ignore
      videoRef!.current!.pause();
    } else {
      // @ts-ignore
      videoRef!.current!.play();
    }
  }, [paused]);

  useEffect(() => {
    if (timestamp !== null) {
      // @ts-ignore
      videoRef!.current!.currentTime = timestamp;
    }
  }, [timestamp]);

  const handlePause = useCallback(() => {
    console.log("handlePause");
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
  }, [onPause, onFrame, onTimestamp]);

  const captureImage = useCallback(() => {
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
  }, [videoRef, canvasRef]);

  const handleOnCanPlayThrough = useCallback(() => {
    console.log("handleOnCanPlayThrough");
    handlePause();

    const video = videoRef.current;
    if (!video) return;
    // @ts-ignore
    const roundedDuration = Math.round(video!.duration);
    onLoaded(roundedDuration);
  }, [handlePause, onLoaded]);

  const handleProgress = useCallback(
    (e: BaseSyntheticEvent) => {
      const percentage = (e.target.currentTime / e.target.duration) * 100;
      onProgress(percentage);
    },
    [onProgress],
  );

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
        onTimeUpdate={handleProgress}
        crossOrigin="anonymous"
        onSeeked={handlePause}
      />
      <canvas ref={canvasRef} style={{ display: "none" }} />
    </>
  );
}
