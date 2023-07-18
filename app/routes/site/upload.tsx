import {
  Button,
  Card,
  FileInput,
  Group,
  LoadingOverlay,
  MultiSelect,
  Radio,
  rem,
  Stack,
  Textarea,
  TextInput,
} from "@mantine/core";
import { useForm, zodResolver } from "@mantine/form";
import { ActionArgs, json, LoaderArgs, redirect } from "@remix-run/node";
import {
  Form,
  useActionData,
  useFetcher,
  useLoaderData,
} from "@remix-run/react";
import { IconUpload } from "@tabler/icons";
import { useEffect, useState } from "react";
import short from "short-uuid";
import { z } from "zod";
import LinkButton from "~/components/ui/LinkButton";
import { requireAuth } from "~/server/auth.server";
import { getUserId } from "~/server/cookie.server";
import { createPost } from "~/server/post.server";
import { createPresignedUrl } from "~/server/s3.server";
import { getTags } from "~/server/tags.server";
import { isUrl } from "~/utils/helpers";

const schema = z
  .object({
    caption: z.string().optional(),
    tags: z.string().array().optional(),
    link: z.string().optional(),
    postType: z.enum(["video", "link"]),
  })
  .partial()
  .refine(({ caption, tags, link, postType }) => {
    console.log({ caption, tags, link, postType });
    if (postType === "video") {
      return caption && tags;
    } else if (postType === "link") {
      return link && isUrl(link);
    }
    return false;
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
  const formData = Object.fromEntries((await request.formData()).entries());
  const { filename, caption, tags, text, link, postType } = formData;

  const isValid = schema.parse(formData);

  const submitted = new URL(request.url).searchParams.get("video");
  if (submitted) {
    const post = await createPost(
      userId!,
      filename as string,
      caption as string,
      (tags as string).split(",").map((t) => (t.includes("#") ? t : `#${t}`)),
    );
    return redirect(`/site/post/${post.id}`);
  }

  const genFilename = short.generate();
  const { uploadUrl, path } = await createPresignedUrl(genFilename as string);
  return json({
    userId: userId!,
    filename: path,
    caption: caption as string,
    tags: tags as string,
    uploadUrl,
  });
};

export default function Upload() {
  const { tags } = useLoaderData<typeof loader>();
  const actionData = useActionData<typeof action>();
  const fetcher = useFetcher();
  const [file, setFile] = useState<File | null>(null);
  const [sTags, setSTags] = useState([{ value: "", label: "" }]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const uploadVideo = async () => {
      setLoading(true);
      console.log({ actionData });
      const resp = await fetch(actionData?.uploadUrl!, {
        method: "PUT",
        body: file,
      });
      const formData = new FormData();
      formData.set("userId", actionData?.userId!);
      formData.set("filename", actionData?.filename!);
      formData.set("caption", actionData?.caption!);
      formData.set("tags", actionData?.tags!);
      fetcher.submit(formData, {
        method: "post",
        action: `/site/upload?video=true`,
      });
      setLoading(false);
    };

    if (actionData?.uploadUrl) {
      uploadVideo();
    } else {
      let data = [];
      for (const t of tags) {
        data.push({ value: t.name, label: t.name });
      }
      setSTags(data);
    }
  }, [tags]);

  const form = useForm({
    validate: zodResolver(schema),
    validateInputOnBlur: true,
    initialValues: {
      caption: "",
      tags: [],
      text: "",
      link: "",
      postType: "video",
    },
  });

  const formValid = () => {
    if (form.values.postType === "video") {
      return form.isValid() && file;
    }
    return form.isValid();
  };

  console.log(formValid());

  return (
    <Card>
      <LoadingOverlay
        visible={
          fetcher.state === "loading" ||
          fetcher.state === "submitting" ||
          loading
        }
        overlayBlur={2}
      />
      <Form method="post" encType="multipart/form-data">
        <Stack>
          <Radio.Group
            name="postType"
            label="Post type"
            mb={6}
            {...form.getInputProps("postType")}
          >
            <Group>
              <Radio value="video" label="Video" />
              <Radio value="link" label="Link" />
            </Group>
          </Radio.Group>
          {form.values.postType === "video" && (
            <>
              <FileInput
                label="Video"
                accept="video/*"
                icon={<IconUpload size={rem(14)} />}
                onChange={(e) => {
                  setFile(e);
                }}
              />
              <Textarea
                label="Caption"
                name="caption"
                {...form.getInputProps("caption")}
              />
            </>
          )}
          {form.values.postType === "link" && (
            <TextInput
              label="Link"
              name="link"
              {...form.getInputProps("link")}
            />
          )}
          {form.values.postType === "video" && (
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
          )}
          <Group>
            <LinkButton link="/site" variant="default">
              Discard
            </LinkButton>
            <Button type="submit" disabled={!formValid()}>
              Post
            </Button>
          </Group>
        </Stack>
      </Form>
    </Card>
  );
}
