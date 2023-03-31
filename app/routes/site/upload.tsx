import {
  Button,
  Card,
  FileInput,
  Group,
  LoadingOverlay,
  MultiSelect,
  rem,
  Stack,
  Textarea,
} from "@mantine/core";
import { useForm, zodResolver } from "@mantine/form";
import {
  ActionArgs,
  json,
  LoaderArgs,
  redirect,
  unstable_parseMultipartFormData,
} from "@remix-run/node";
import { useFetcher, useLoaderData } from "@remix-run/react";
import { IconUpload } from "@tabler/icons";
import { useEffect, useState } from "react";
import { z } from "zod";
import LinkButton from "~/components/ui/LinkButton";
import { requireAuth } from "~/server/auth.server";
import { getUserId } from "~/server/cookie.server";
import { createPost } from "~/server/post.server";
import { uploadHandler } from "~/server/s3.server";
import { getTags } from "~/server/tags.server";

const schema = z.object({
  caption: z.string().nonempty(),
  tags: z.string().array().nonempty(),
});

export const loader = async ({ request }: LoaderArgs) => {
  if (!(await requireAuth(request)).userId) {
    return redirect("/auth/login");
  }
  const tags = await getTags();
  return json({ tags });
};

export const action = async ({ request }: ActionArgs) => {
  const userId = await getUserId(request);
  const formData = await unstable_parseMultipartFormData(
    request,
    uploadHandler,
  );
  const filename = formData.get("video");
  const caption = formData.get("caption");
  const tags = formData.get("tags");
  const post = await createPost(
    userId!,
    filename as string,
    caption as string,
    (tags as string).split(",").map((t) => (t.includes("#") ? t : `#${t}`)),
  );
  return redirect(`/site/post/${post.id}`);
};

export default function Upload() {
  const { tags } = useLoaderData<typeof loader>();
  const fetcher = useFetcher();
  const [file, setFile] = useState<File | null>(null);
  const [sTags, setSTags] = useState([{ value: "", label: "" }]);

  useEffect(() => {
    let data = [];
    for (const t of tags) {
      data.push({ value: t.name, label: t.name });
    }
    setSTags(data);
  }, []);

  const form = useForm({
    validate: zodResolver(schema),
    validateInputOnBlur: true,
    initialValues: {
      caption: "",
      tags: [],
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
            icon={<IconUpload size={rem(14)} />}
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
          <MultiSelect
            label="Tags"
            name="tags"
            data={sTags}
            limit={3}
            searchable
            creatable
            getCreateLabel={(query) => `+ Create #${query}`}
            onCreate={(query) => {
              const item = { value: query, label: `#${query}` };
              setSTags((current) => [...current, item]);
              return item;
            }}
            {...form.getInputProps("tags")}
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
