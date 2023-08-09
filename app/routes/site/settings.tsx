import {
  Button,
  Card,
  FileInput,
  Group,
  LoadingOverlay,
  rem,
  Stack
} from "@mantine/core";
import { notifications } from '@mantine/notifications';
import {
  ActionArgs,
  json,
  LoaderArgs,
  redirect,
  unstable_parseMultipartFormData,
} from "@remix-run/node";
import { useFetcher } from "@remix-run/react";
import { IconUpload } from "@tabler/icons";
import { useEffect, useState } from "react";
import { requireAuth } from "~/server/auth.server";
import { getUserId } from "~/server/cookie.server";
import { uploadHandler } from "~/server/s3.server";
import { getUser, updateUserPfp } from "~/server/user.server";
import ReputationCard from "../../components/ux/ReputationCard";

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

    await updateUserPfp(userId!, fileUrl);
    return { success: true };

  } catch (e) {
    return { success: false }
  }
};

export default function Settings() {
  const fetcher = useFetcher();
  const [file, setFile] = useState<File | null>(null);
  const { success } = fetcher?.data || {}


  const notify = () => {
    notifications.show({
      message: 'Profile photo updated successfully',
      color: 'green'
    })
  }

  useEffect(() => {
    if (success) {
      notify()
    }
  }, [success])

  return (
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
      <Group>
        {/* <ReputationCard/> */}
      </Group>
    </Card>
    
    
  );
}
