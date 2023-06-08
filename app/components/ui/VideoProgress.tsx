import { Avatar, Card, HoverCard, Stack } from "@mantine/core";
import { Feedback } from "~/utils/types";
import { IconStar } from "@tabler/icons";
import TimestampedFeedback from "../TimestampedComments";

export default function VideoProgress({
  percentage,
  feedback,
  duration,
  onClickTimeline,
  className,
}: {
  percentage: number;
  feedback: Feedback[];
  duration: number;
  className?: string;
  onClickTimeline: (feedback: Feedback[]) => void;
}) {
  const groupedByTimestamp = feedback.reduce((acc, f) => {
    if (!acc[f.timestamp]) {
      acc[f.timestamp] = [];
    }
    acc[f.timestamp].push(f);
    return acc;
  }, {} as { [key: number]: Feedback[] });

  return (
    <Card w="100%" style={{ overflow: "visible" }} className={className}>
      <Stack w="100%">
        {Object.keys(groupedByTimestamp).map((timestamp) => {
          const position = (Number(timestamp) / duration) * 100;
          return (
            <Marker
              key={`timeline-marker-${timestamp}`}
              position={position}
              feedback={groupedByTimestamp[Number(timestamp)]}
              onClickTimeline={onClickTimeline}
            />
          );
        })}
        <Progress percentage={percentage} />
        <Background />
      </Stack>
    </Card>
  );
}

function Marker({
  onClickTimeline,
  position,
  feedback,
}: {
  feedback: Feedback[];
  onClickTimeline: (feedback: Feedback[]) => void;
  position: number;
}): JSX.Element {
  const handleClick = () => {
    onClickTimeline(feedback);
  };

  return (
    <Stack
      onClick={handleClick}
      style={{
        position: "absolute",
        bottom: 0,
        left: `${position}%`,
        height: "100%",
        width: 30,
        marginLeft: "-15px",
      }}
      justify="center"
      align="center"
    >
      {feedback.some((f) => f.mostHelpful) && <MostHelpFul />}
      <div
        style={{
          position: "absolute",
          width: 3,
          height: "100%",
          backgroundColor: "black",
          zIndex: 3,
        }}
      />
      {feedback.length == 1 && (
        <Avatar
          style={{
            bottom: -20,
            zIndex: 3,
          }}
          variant="outline"
          src={feedback[0].user.avatarUrl}
          size="sm"
          bg="white"
          radius="xl"
        />
      )}
      {feedback.length > 1 && (
        <Avatar
          style={{
            bottom: -20,
            zIndex: 3,
          }}
          variant="outline"
          size="sm"
          bg="white"
          radius="xl"
        >
          {feedback.length}
        </Avatar>
      )}
    </Stack>
  );
}

function MostHelpFul() {
  return (
    <IconStar
      size={20}
      strokeWidth={4}
      fill={"purple"}
      color={"purple"}
      style={{
        position: "absolute",
        zIndex: 4,
        top: -13,
      }}
    />
  );
}

function Background() {
  return (
    <div
      style={{
        position: "absolute",
        bottom: 0,
        left: 0,
        width: "100%",
        height: "100%",
        backgroundColor: "#CED4DA",
      }}
    />
  );
}

function Progress({ percentage }: { percentage: number }) {
  return (
    <div
      style={{
        position: "absolute",
        bottom: 0,
        left: 0,
        width: `${percentage}%`,
        height: "100%",
        backgroundColor: "#868E96",
        zIndex: 2,
      }}
    />
  );
}
