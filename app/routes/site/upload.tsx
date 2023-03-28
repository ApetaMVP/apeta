import {
  Button,
  Card,
  FileInput,
  Group,
  LoadingOverlay,
  Stack,
  Textarea,
} from "@mantine/core";
import { useForm, zodResolver } from "@mantine/form";
import {
  ActionArgs,
  redirect,
  unstable_parseMultipartFormData,
} from "@remix-run/node";
import { useFetcher } from "@remix-run/react";
import { useState } from "react";
import { z } from "zod";
import LinkButton from "~/components/ui/LinkButton";
import { getUserId } from "~/server/cookie.server";
import { createPost } from "~/server/post.server";
import { uploadHandler } from "~/server/s3.server";

const schema = z.object({
  caption: z.string().nonempty(),
});

export const action = async ({ request }: ActionArgs) => {
  const userId = await getUserId(request);
  const formData = await unstable_parseMultipartFormData(
    request,
    uploadHandler
  );
  const filename = formData.get("video");
  const caption = formData.get("caption");
  const post = await createPost(userId!, filename as string, caption as string);
  return redirect(`/site/post/${post.id}`);
};

export default function Upload() {
  const fetcher = useFetcher();
  const [file, setFile] = useState<File | null>(null);

  const form = useForm({
    validate: zodResolver(schema),
    validateInputOnBlur: true,
    initialValues: {
      caption: "",
    },
  });

  return (
    <Card>
      <LoadingOverlay
        visible={fetcher.state === "loading" || fetcher.state === "submitting"}
        overlayBlur={2}
      />
      <fetcher.Form method="post" encType="multipart/form-data">
        <Stack>
          <FileInput
            label="Video"
            name="video"
            accept="video/*"
            onChange={(e) => {
              if (e!.size < 52_428_800) {
                setFile(e);
              } else {
                alert("File too big");
              }
            }}
          />
          <Textarea
            label="Caption"
            name="caption"
            {...form.getInputProps("caption")}
          />
          <Group>
            <LinkButton link="/site" variant="default">
              Discard
            </LinkButton>
            <Button type="submit" disabled={!form.isValid() || !file}>
              Post
            </Button>
          </Group>
        </Stack>
      </fetcher.Form>
    </Card>
  );
}
