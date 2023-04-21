import {
  Button,
  Card,
  FileInput,
  Group,
  LoadingOverlay,
  rem,
  Stack,
  Notification
} from "@mantine/core";
import { IconCheck } from '@tabler/icons-react';
import {
  ActionArgs,
  json,
  LoaderArgs,
  redirect,
  unstable_parseMultipartFormData,
} from "@remix-run/node";
import { useFetcher } from "@remix-run/react";
import { IconUpload } from "@tabler/icons";
import { useState } from "react";
import { requireAuth } from "~/server/auth.server";
import { getUserId } from "~/server/cookie.server";
import { uploadHandler } from "~/server/s3.server";
import { getUser, updateUserPfp } from "~/server/user.server";

export const loader = async ({ request }: LoaderArgs) => {
  if (!(await requireAuth(request)).userId) {
    return redirect("/");
  }
  const userId = await getUserId(request);
  const user = await getUser(userId!);
  return json({ user });
};

export const action = async ({ request }: ActionArgs) => {
  try {
    const userId = await getUserId(request);
    const formData = await unstable_parseMultipartFormData(
      request,
      uploadHandler,
    );

    const fileUrl = formData.get("image") as string;

    const splitUrl = fileUrl.split('/')
    const fileName = splitUrl[splitUrl.length-1]

    await updateUserPfp(userId!, fileUrl);
    return { success: true, fileName };
  } catch (e) {
    return { success: false, fileName: null }
  }
};

export default function Settings() {
  const fetcher = useFetcher();
  const [file, setFile] = useState<File | null>(null);
  const { success, fileName } = fetcher?.data || {}

  const handleCloseNotification = () => {
    setFile(null)
  }

  return (
    <>
      {success && file && (file?.name === fileName) &&
        <Notification title="Success!" color="green" icon={<IconCheck />} onClose={handleCloseNotification}>
          Profile photo updated successfully.
        </Notification>
      }
      <Card>
        <LoadingOverlay
          visible={fetcher.state === "loading" || fetcher.state === "submitting"}
          overlayBlur={2}
        />
        <fetcher.Form method="post" encType="multipart/form-data">
          <Stack>
            <FileInput
              label="Profile Photo"
              name="image"
              accept="image/*"
              value={file}
              icon={<IconUpload size={rem(14)} />}
              onChange={(e) => {
                if (e!.size < 52_428_800) {
                  setFile(e);
                } else {
                  alert("File too big");
                }
              }}
            />
            <Group>
              <Button type="submit" disabled={!file}>
                Submit
              </Button>
            </Group>
          </Stack>
        </fetcher.Form>
      </Card>
    </>
  );
}
