import { AspectRatio } from "@mantine/core";
import React, { useCallback } from "react";
import { BaseSyntheticEvent, useEffect, useRef, useState } from "react";

interface VideoProps {
  src: string;
  timestamp: number;
  loaded: boolean;
  onLoaded: (duration: number) => void;
  onTimestamp: (timestamp: number) => void;
  onFrame: (frame: string) => void;
  onProgress: (percentage: number) => void;
  paused: boolean;
}

export default function Video(props: VideoProps) {
  const {
    src,
    timestamp,
    onLoaded,
    paused,
    onTimestamp,
    onFrame,
    onProgress,
    loaded,
  } = props;

  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  const [initialLoad, setInitialLoad] = useState(true);
  const [aspectRatio, setAspectRatio] = useState(16 / 9);

  useEffect(() => {
    const video = videoRef.current;
    if (video && timestamp !== null) {
      // @ts-ignore
      if (initialLoad || Math.abs(timestamp - video.currentTime) > 0) {
        // @ts-ignore
        video.currentTime = timestamp;
      }
      // Reset the initialLoad flag after the first render
      if (initialLoad) {
        setInitialLoad(false);
      }
    }
  }, [timestamp, initialLoad]);

  // effect to set video to paused
  useEffect(() => {
    if (videoRef.current && paused) {
      // @ts-ignore
      videoRef.current!.pause();
      handlePause();
    }
  }, [paused]);

  // effect to set correct aspet ratio
  useEffect(() => {
    const video = videoRef.current;
    if (video) {
      // @ts-ignore
      const { videoWidth, videoHeight } = video;
      const aspectRatio = videoWidth / videoHeight;

      console.log({ videoWidth, videoHeight, aspectRatio });
      setAspectRatio(aspectRatio);
    }
  }, [loaded]);

  // useEffect(() => {
  //   // @ts-ignore
  //   console.log(Math.abs(timestamp - videoRef.current!.currentTime));

  //   console.log({ timestamp });

  //   // @ts-ignore
  //   console.log("current time", videoRef.current!.currentTime);
  //   if (
  //     timestamp !== null &&
  //     // @ts-ignore
  //     Math.abs(timestamp - videoRef.current!.currentTime) > 0
  //     // this stops an infinte rendering loop where the timestamp updates
  //     // the video, the video updates the timestamp, etc.
  //     // @ts-ignore
  //   ) {
  //     // @ts-ignore
  //     videoRef.current!.currentTime = timestamp;
  //   }
  //   // @ts-ignore
  // }, [timestamp]);

  // useEffect(() => {
  //   if (timestamp !== null) {
  //     // @ts-ignore
  //     videoRef.current!.currentTime = timestamp;
  //   }
  // }, []);

  const handlePause = () => {
    const frame = captureImage();
    if (frame) {
      onFrame(frame);
    }
    /* tslint:disable:no-string-literal */
    const t = Number(videoRef?.current?.["currentTime"]);

    if (
      onTimestamp &&
      // @ts-ignore
      // stop-gap for infinite rendering loop. TODO: fix this
      Math.abs(timestamp - videoRef.current!.currentTime) > 0.5
    ) {
      onTimestamp(t);
    }
  };

  const captureImage = () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (video && canvas) {
      // @ts-ignore
      const ctx = canvas.getContext("2d");
      // @ts-ignore
      canvas.width = video.videoWidth;
      // @ts-ignore
      canvas.height = video.videoHeight;
      //  @ts-ignore
      console.log(canvas.width, canvas.height);
      // @ts-ignore
      ctx!.drawImage(video, 0, 0, canvas.width, canvas.height);
      // @ts-ignore
      const imageSrc = canvas.toDataURL();
      return imageSrc;
    }
  };

  const handleOnCanPlayThrough = () => {
    console.log("handleOnCanPlayThrough");
    handlePause();

    const video = videoRef.current;
    if (!video) return;
    // @ts-ignore
    const roundedDuration = Math.round(video!.duration);
    onLoaded(roundedDuration);
  };

  const handleProgress = (e: BaseSyntheticEvent) => {
    const percentage = (e.target.currentTime / e.target.duration) * 100;
    onProgress(percentage);
  };

  return (
    <AspectRatio ratio={aspectRatio}>
      <video
        controls
        autoPlay
        ref={videoRef}
        src={src}
        onCanPlayThrough={handleOnCanPlayThrough}
        onPause={handlePause}
        onTimeUpdate={handleProgress}
        crossOrigin="anonymous"
        onSeeked={handlePause}
      />
      <canvas ref={canvasRef} style={{ display: "none" }} />
    </AspectRatio>
  );
}

export const MemoizedVideo = React.memo(Video);
