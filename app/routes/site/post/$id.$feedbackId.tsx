import {
  Anchor,
  Button,
  Card,
  Divider,
  Image,
  SimpleGrid,
  Stack,
  Text,
  TextInput,
  Title,
} from "@mantine/core";
import { useForm, zodResolver } from "@mantine/form";
import { ActionArgs, json, LoaderArgs } from "@remix-run/node";
import { Form, useLoaderData } from "@remix-run/react";
import { useState } from "react";
import { z } from "zod";
import AvatarName from "~/components/AvatarName";
import CommentBubble from "~/components/CommentBubble";
import { formatDuration } from "~/components/FeedbackCard";
import TextEditor from "~/components/ui/TextEditor";
import { voteOnComment } from "~/server/comment.server";
import { getUserId } from "~/server/cookie.server";
import { getFeedback } from "~/server/feedback.server";
import { commentOnFeedback } from "~/server/post.server";
import { Feedback } from "~/utils/types";

const commentSchema = z.object({
  comment: z.string().nonempty({ message: "Comment cannot be empty" }),
});

export const loader = async ({ request, params }: LoaderArgs) => {
  const userId = await getUserId(request);
  const feedbackId = params.feedbackId;
  const feedback = await getFeedback(feedbackId!, userId!);
  return json({ feedback, loggedIn: userId ? true : false });
};

export async function action({ request, params }: ActionArgs) {
  const { comment, upVote, downVote } = Object.fromEntries(
    (await request.formData()).entries(),
  );
  const userId = await getUserId(request);
  const feedbackId = params.feedbackId;

  if (upVote) {
    return await voteOnComment(upVote as string, userId!, "UP");
  }

  if (downVote) {
    return await voteOnComment(downVote as string, userId!, "DOWN");
  }

  return await commentOnFeedback(userId!, feedbackId!, comment as string);
}

export default function PostFeedback() {
  const data = useLoaderData<typeof loader>();
  const feedback = data.feedback as unknown as Feedback;
  const loggedIn = data.loggedIn;
  const [comment, setComment] = useState("");

  const commentForm = useForm({
    validate: zodResolver(commentSchema),
    initialValues: {
      comment: "",
    },
  });

  const handleCommentChange = (c: string) => {
    if (c === "<p></p>") {
      setComment("");
      commentForm.setValues({ comment: "" });
      return;
    }
    setComment(c);
    commentForm.setValues({ comment: c });
  };

  const optimisticClear = () => {
    setComment("");
    commentForm.setValues({ comment: "" });
    commentForm.reset();
  };

  return (
    <Stack align="center" spacing="xl">
      <SimpleGrid
        breakpoints={[
          { maxWidth: "xl", cols: 3, spacing: "md" },
          { maxWidth: "lg", cols: 3, spacing: "sm" },
          { maxWidth: "md", cols: 2, spacing: "sm" },
          { maxWidth: "sm", cols: 1, spacing: "sm" },
        ]}
      >
        <Card w="75%">
          <Card.Section>
            <Image src={feedback.mediaUrl} />
          </Card.Section>
          <Stack mt="xs">
            <AvatarName
              name={feedback.user.username}
              avatarUrl={feedback.user.avatarUrl}
            />
            <Anchor>{formatDuration(feedback.timestamp)}</Anchor>
            <Text lineClamp={3}>{feedback.content}</Text>
            <Divider />
            <Title order={5}>Comments</Title>
            {feedback.comments?.map((c) => (
              <CommentBubble
                comment={c}
                postId={feedback.postId}
                feedbackId={feedback.id}
                key={c.id}
              />
            ))}
            {loggedIn && (
              <Form method="post" onSubmit={optimisticClear}>
                <TextEditor
                  comment={comment}
                  handleChange={handleCommentChange}
                />
                <TextInput
                  name="comment"
                  {...commentForm.getInputProps("comment")}
                  type="hidden"
                />
                <TextInput name="target" value="comment" type="hidden" />
                <Button
                  type="submit"
                  disabled={!commentForm.isValid()}
                  fullWidth
                  mt="md"
                >
                  Submit Comment
                </Button>
              </Form>
            )}
          </Stack>
        </Card>
      </SimpleGrid>
    </Stack>
  );
}
