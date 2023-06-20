import {
  ActionIcon,
  Anchor,
  Box,
  Button,
  Card,
  Center,
  Grid,
  Group,
  Image,
  Stack,
  Text,
  TextInput,
} from "@mantine/core";
import TimeAgo from "react-timeago";
import { Form } from "@remix-run/react";
import { IconMessage } from "@tabler/icons";
import { Feedback, Comment } from "~/utils/types";
import AvatarName from "./AvatarName";
import VoteButtons from "./VoteButtons";
import { useState } from "react";
import parse from "html-react-parser";
import { useForm, zodResolver } from "@mantine/form";
import { z } from "zod";
import TextEditor from "./ui/TextEditor";

interface FeedbackCardProps {
  feedback: Feedback;
  loggedIn: boolean;
  customStyles?: React.CSSProperties;
  handleTimestamp: (timestamp: number) => void;
}

export default function FeedbackCard(props: FeedbackCardProps) {
  const [showComments, setShowComments] = useState(false);
  const [replying, setReplying] = useState(false);
  const { feedback, handleTimestamp, loggedIn, customStyles } = props;

  return (
    <Card style={customStyles} withBorder={false} radius={0}>
      {feedback.mostHelpful && (
        <Text c="purple" fw="bold" fz="sm">
          Voted Most Helpful
        </Text>
      )}
      <Stack mt="xs" align="flex-start">
        <Group
          align="center"
          style={{ justifyContent: "space-between", width: "100%" }}
        >
          <AvatarName
            name={feedback.user.username}
            avatarUrl={feedback.user.avatarUrl}
          />
          <TimeAgo
            live={false}
            date={feedback.createdAt}
            style={{ color: "gray", fontSize: "0.8rem" }}
          />
        </Group>

        <Text align="start" lineClamp={3} mb="md" mt="md">
          {feedback.content}
        </Text>
        <Grid grow={true}>
          <Grid.Col span={6}>
            <Stack
              style={{
                height: "100%",
                alignItems: "flex-start",
                justifyContent: "space-between",
              }}
            >
              <Anchor
                onClick={(e) => {
                  e.stopPropagation();
                  handleTimestamp(feedback.timestamp);
                }}
              >
                {formatDuration(feedback.timestamp)}
              </Anchor>
              <Group>
                <Group>
                  <ActionIcon onClick={(_e) => setShowComments(!showComments)}>
                    <IconMessage color="black" />
                  </ActionIcon>
                  <Center>
                    <Text fz="sm" c="gray">
                      {feedback.commentCount}
                    </Text>
                  </Center>
                </Group>
                <Form method="post" action={`/site/post/${feedback.postId}`}>
                  <VoteButtons votable={feedback} disabled={!loggedIn} />
                  <input type="hidden" name="_action" value="FEEDBACK_VOTE" />
                </Form>
                {replying && (
                  <ReplyBox feedback={feedback} setReplying={setReplying} />
                )}
              </Group>
              <Anchor onClick={() => setReplying(!replying)}>Reply</Anchor>
            </Stack>
          </Grid.Col>
          <Grid.Col span={6}>
            <Image src={feedback.mediaUrl} />
          </Grid.Col>
        </Grid>
        {showComments && (
          <Stack mt="md" spacing="md">
            {feedback.comments.map((comment) => (
              <CommentBox
                key={`comment-${comment.id}`}
                comment={comment}
                feedback={feedback}
                loggedIn={loggedIn}
              />
            ))}
          </Stack>
        )}
      </Stack>
    </Card>
  );
}

function ReplyBox({
  feedback,
  setReplying,
}: {
  feedback: Feedback;
  setReplying: (replying: boolean) => void;
}) {
  const [comment, setComment] = useState("");
  const commentSchema = z.object({
    comment: z.string().nonempty({ message: "Comment cannot be empty" }),
  });
  const commentForm = useForm({
    validate: zodResolver(commentSchema),
    initialValues: {
      comment: "",
    },
  });
  const optimisticClear = () => {
    setComment("");
    commentForm.setValues({ comment: "" });
    commentForm.reset();
    setReplying(false);
  };
  const handleCommentChange = (c: string) => {
    if (c === "<p></p>") {
      setComment("");
      commentForm.setValues({ comment: "" });
      return;
    }
    setComment(c);
    commentForm.setValues({ comment: c });
  };
  return (
    <Form method="post" onSubmit={optimisticClear}>
      <input type="hidden" name="_action" value="COMMENT_REPLY" />
      <input type="hidden" name="feedbackId" value={feedback.id} />
      <TextEditor comment={comment} handleChange={handleCommentChange} />
      <TextInput
        name="comment"
        {...commentForm.getInputProps("comment")}
        type="hidden"
      />
      <TextInput name="target" value="comment" type="hidden" />
      <Button type="submit" disabled={!commentForm.isValid()} fullWidth mt="md">
        Submit Comment
      </Button>
    </Form>
  );
}

function CommentBox({
  comment,
  feedback,
  loggedIn,
}: {
  comment: Comment;
  feedback: Feedback;
  loggedIn: boolean;
}) {
  return (
    <Grid grow={true} key={`comment-${comment.id}`}>
      <Grid.Col span={1} style={{ paddingBottom: 0, paddingTop: 0 }}>
        <div
          style={{
            borderLeft: "1px solid grey",
            width: "100%",
            height: "100%",
          }}
        ></div>
      </Grid.Col>
      <Grid.Col span={11}>
        <Box p="md">
          <Group>
            <AvatarName
              name={comment.user.username}
              avatarUrl={comment.user.avatarUrl}
            />
            <TimeAgo
              live={false}
              date={comment.createdAt}
              style={{ color: "gray", fontSize: "0.8rem" }}
            />
          </Group>
          <Text>{parse(comment.content)}</Text>
          <Form method="post">
            <VoteButtons votable={comment} disabled={!loggedIn} />
            <input type="hidden" name="_action" value="COMMENT_VOTE" />
          </Form>
        </Box>
      </Grid.Col>
    </Grid>
  );
}

export function formatDuration(seconds: number) {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60).toFixed(0);
  const formattedMinutes = String(minutes).padStart(2, "0");
  const formattedSeconds = String(remainingSeconds).padStart(2, "0");
  return `${formattedMinutes}:${formattedSeconds}`;
}
