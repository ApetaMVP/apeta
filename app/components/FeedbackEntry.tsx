import {
  Textarea,
  TextInput,
  Group,
  Button,
  Tooltip,
  Modal,
  Text,
  Loader,
  Card,
} from "@mantine/core";
import { useForm, zodResolver } from "@mantine/form";
import { Form, useFetcher } from "@remix-run/react";
import { z } from "zod";
import { IconPencil } from "@tabler/icons";
import { useDisclosure } from "@mantine/hooks";
import { useState } from "react";

const feedbackSchema = z.object({
  msg: z.string().nonempty({ message: "Feedback cannot be empty" }),
});

interface FeedbackEntryProps {
  timestamp: number;
  img: string;
  setImg: (img: string) => void;
  onPencilClick: () => void;
  isDrawing: boolean;
  hasMarkedImg: boolean;
  onSubmit: () => void;
}

export default function FeedbackEntry(props: FeedbackEntryProps) {
  const {
    timestamp,
    img,
    setImg,
    onPencilClick,
    isDrawing,
    hasMarkedImg,
    onSubmit,
  } = props;
  const [opened, { open, close }] = useDisclosure(false);
  const [aiPrompt, setAiPrompt] = useState("");
  const fetcher = useFetcher();

  const feedbackForm = useForm({
    validate: zodResolver(feedbackSchema),
    initialValues: {
      msg: "",
    },
  });

  const optimisticClear = () => {
    feedbackForm.setValues({ msg: "" });
    feedbackForm.reset();
    setImg("");
  };

  const generateHandler = () => {
    fetcher.load("/site/chatgpt?prompt=" + aiPrompt);
  };

  const pencilColor = isDrawing ? "red" : "gray";
  return (
    <>
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
          <Tooltip label="Use AI to generate a comment!">
            <Button type="button" onClick={open}>
              Generate
            </Button>
          </Tooltip>

          <Button
            type="submit"
            onClick={onSubmit}
            disabled={!feedbackForm.isValid() && !hasMarkedImg}
          >
            Post
          </Button>
        </Group>
      </Form>
      <Modal opened={opened} onClose={close}>
        <Textarea
          mb={20}
          name="prompt"
          onChange={(e) => setAiPrompt(e.currentTarget.value)}
          placeholder="Prompt AI to generate a helpful comment"
        />
        {fetcher.data?.choices.map((c: string, i: number) => {
          return (
            <Card
              mb={20}
              key={`aichoice-${i}`}
              style={{ cursor: "pointer", border: "2px solid #d40c0b" }}
            >
              <Text
                onClick={() => {
                  feedbackForm.setValues({ msg: c });
                  setAiPrompt("");
                  close();
                }}
              >
                {c}
              </Text>
            </Card>
          );
        })}
        <Group align={"stretch"}>
          <Button
            onClick={generateHandler}
            disabled={!aiPrompt.length || fetcher.state !== "idle"}
          >
            Generate
          </Button>
          {fetcher.state !== "idle" ? <Loader variant="dots" /> : <></>}
        </Group>
      </Modal>
    </>
  );
}
