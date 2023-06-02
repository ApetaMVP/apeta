import { Textarea, TextInput, Group, Button } from "@mantine/core";
import { useForm, zodResolver } from "@mantine/form";
import { Form } from "@remix-run/react";
import { z } from "zod";
import { IconPencil } from "@tabler/icons";

const feedbackSchema = z.object({
  msg: z.string().nonempty({ message: "Feedback cannot be empty" }),
});

interface FeedbackEntryProps {
  timestamp: number;
  img: string;
  frame: string;
  onImg: (img: string) => void;
  onPencilClick: () => void;
  isDrawing: boolean;
  hasMarkedImg: boolean;
  onSubmit: () => void;
}

export default function FeedbackEntry(props: FeedbackEntryProps) {
  const {
    timestamp,
    img,
    frame,
    onImg,
    onPencilClick,
    isDrawing,
    hasMarkedImg,
    onSubmit,
  } = props;

  const feedbackForm = useForm({
    validate: zodResolver(feedbackSchema),
    initialValues: {
      msg: "",
    },
  });

  const optimisticClear = () => {
    feedbackForm.setValues({ msg: "" });
    feedbackForm.reset();
  };

  const pencilColor = isDrawing ? "red" : "gray";
  return (
    <Form method="post" onSubmit={optimisticClear}>
      <Textarea
        name="feedback"
        placeholder="Add a comment"
        {...feedbackForm.getInputProps("msg")}
      />
      <TextInput name="timestamp" value={timestamp} type="hidden" />
      <TextInput name="img" value={img} type="hidden" />
      <Group mt="sm" grow>
        <IconPencil
          cursor="pointer"
          color={pencilColor}
          fill={pencilColor}
          onClick={onPencilClick}
        />

        <Button
          type="submit"
          onClick={onSubmit}
          disabled={!feedbackForm.isValid() && !hasMarkedImg}
        >
          Post
        </Button>
      </Group>
    </Form>
  );
}
