import { Avatar, Card, Stack } from "@mantine/core";
import { Feedback } from "~/utils/types";
import { IconStar } from "@tabler/icons";

export default function VideoProgress({
  percentage,
  feedback,
  duration,
  onClickTimeline,
}: {
  percentage: number;
  feedback: Feedback[];
  duration: number;
  onClickTimeline: (feedback: Feedback) => void;
}) {
  return (
    <Card w="100%" style={{ overflow: "visible" }}>
      <Stack w="100%">
        {feedback.map((f) => {
          const position = (f.timestamp / duration) * 100;
          return (
            <Stack
              key={`timeline-marker-${f.id}`}
              onClick={() => onClickTimeline(f)}
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
              {f.mostHelpful && <MostHelpFul />}
              <div
                style={{
                  position: "absolute",
                  width: 3,
                  height: "100%",
                  backgroundColor: "black",
                  zIndex: 3,
                }}
              />
              <Avatar
                style={{
                  bottom: -20,
                  zIndex: 3,
                }}
                src={f.user.avatarUrl}
                size="sm"
                bg="white"
                radius="xl"
              />
            </Stack>
          );
        })}
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
      </Stack>
    </Card>
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
