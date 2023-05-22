import { Group, ActionIcon } from "@mantine/core";
import { VoteDirection } from "@prisma/client";
import { IconArrowUpCircle, IconArrowDownCircle } from "@tabler/icons";
import { Text } from "@mantine/core";
import { Votable } from "~/utils/types";

export default function VoteButtons({
  votable,
  disabled,
}: {
  votable: Votable;
  disabled?: boolean;
}) {
  const styleForArrow = (direction: VoteDirection) => {
    if (!votable.myVote || votable.myVote !== direction) {
      return "gray";
    } else {
      return "black";
    }
  };

  const optimisticUpdate = (clicked: VoteDirection) => async () => {
    const isUpvote = clicked === "UP";
    const isDownvote = clicked === "DOWN";
    const isCurrentUpvote = votable.myVote === "UP";
    const isCurrentDownvote = votable.myVote === "DOWN";

    if (isUpvote && isCurrentUpvote) {
      votable.upvoteCount--;
      votable.myVote = undefined;
    } else if (isDownvote && isCurrentDownvote) {
      votable.downvoteCount--;
      votable.myVote = undefined;
    } else if (isUpvote && isCurrentDownvote) {
      votable.upvoteCount++;
      votable.downvoteCount--;
      votable.myVote = "UP";
    } else if (isDownvote && isCurrentUpvote) {
      votable.downvoteCount++;
      votable.upvoteCount--;
      votable.myVote = "DOWN";
    } else if (isUpvote && !votable.myVote) {
      votable.upvoteCount++;
      votable.myVote = "UP";
    } else if (isDownvote && !votable.myVote) {
      votable.downvoteCount++;
      votable.myVote = "DOWN";
    }
  };

  return (
    <Group>
      <ActionIcon
        type="submit"
        name="upVote"
        disabled={disabled}
        value={votable.id}
        onClick={optimisticUpdate("UP")}
      >
        <IconArrowUpCircle
          size={20}
          strokeWidth={2}
          color={styleForArrow("UP")}
        />
      </ActionIcon>
      <Text fz="sm" c="gray" align="center">
        {votable.upvoteCount}
      </Text>

      <ActionIcon
        type="submit"
        name="downVote"
        disabled={disabled}
        value={votable.id}
        onClick={optimisticUpdate("DOWN")}
      >
        <IconArrowDownCircle
          size={20}
          strokeWidth={2}
          color={styleForArrow("DOWN")}
        />
      </ActionIcon>
      <Text fz="sm" c="gray" align="center">
        {votable.downvoteCount * -1}
      </Text>
    </Group>
  );
}
