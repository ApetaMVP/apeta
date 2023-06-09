import { ScrollArea, Stack } from "@mantine/core";
import { useEffect, useRef } from "react";
import { Feedback, FullPost } from "~/utils/types";
import FeedbackCard from "./FeedbackCard";

interface FeedbackCardListProps {
  post: FullPost;
  feedback: Feedback[];
  loggedIn: boolean;
  onTimestamp: (timestamp: number) => void;
  highlightedFeedback?: Feedback[];
}

export default function FeedbackCardList(props: FeedbackCardListProps) {
  const { post, feedback, loggedIn, onTimestamp, highlightedFeedback } = props;

  const highlightedId = highlightedFeedback?.[0]?.id;
  return (
    <ScrollArea h={500}>
      <Stack spacing={"md"}>
        {feedback.map((f) => (
          <ScrollPositionWrapper key={f.id} scrolled={f.id === highlightedId}>
            <FeedbackCard
              customStyles={{ height: "100%" }}
              feedback={f}
              loggedIn={loggedIn}
              handleTimestamp={onTimestamp}
            />
          </ScrollPositionWrapper>
        ))}
      </Stack>
    </ScrollArea>
  );
}

function ScrollPositionWrapper({
  scrolled,
  children,
}: {
  scrolled: boolean;
  children: React.ReactNode;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrolled) {
      ref.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [scrolled]);
  return <div ref={ref}>{children}</div>;
}
