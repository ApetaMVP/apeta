import { useEffect, useRef } from "react";

interface VideoProps {
  src: string;
  timestamp?: number;
  onTimestamp?: (timestamp: number) => void;
  handleTimestampChange?: (timestamp: number) => void;
  onPause?: () => void;
  onPlay?: () => void;
}

export default function Video(props: VideoProps) {
  const { src, timestamp, onTimestamp, onPause, onPlay } = props;
  const videoRef = useRef(null);

  useEffect(() => {
    if (timestamp !== null) {
      videoRef!.current!.currentTime = timestamp;
    }
  }, [timestamp]);

  const handleTimestamp = () => {
    const timestamp = Number(videoRef?.current?.["currentTime"]);
    if (onTimestamp) {
      onTimestamp(timestamp);
    }
  };

  return (
    <video
      controls
      ref={videoRef}
      src={src}
      onTimeUpdate={handleTimestamp}
      onPause={onPause}
      onPlay={onPlay}
    />
  );
}
