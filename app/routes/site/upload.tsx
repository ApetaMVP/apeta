import { Box, Button, Card, Grid, Group, Stack, Textarea } from "@mantine/core";
import { useForm, zodResolver } from "@mantine/form";
import { ActionArgs, redirect } from "@remix-run/node";
import { Form } from "@remix-run/react";
import { z } from "zod";
import FileUpload from "~/components/ui/FileUpload";
import LinkButton from "~/components/ui/LinkButton";
import { getUserId } from "~/server/cookie";
import { createPost } from "~/server/post";

const schema = z.object({
  caption: z.string(),
});

export async function action({ request }: ActionArgs) {
  const { caption } = Object.fromEntries((await request.formData()).entries());
  const userId = await getUserId(request);
  await createPost(
    userId!,
    "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
    caption as string
  );
  return redirect(`/site`);
}

export default function Upload() {
  const form = useForm({
    validate: zodResolver(schema),
    validateInputOnBlur: true,
    initialValues: {
      caption: "",
    },
  });

  return (
    <Box>
      <Grid>
        <Grid.Col span={4}>
          <FileUpload />
        </Grid.Col>
        <Grid.Col span={8}>
          <Card h="100%">
            <Form method="post">
              <Stack>
                <Textarea
                  label="Caption"
                  name="caption"
                  {...form.getInputProps("caption")}
                />
                <Group>
                  <LinkButton link="/site" variant="default">
                    Discard
                  </LinkButton>
                  <Button type="submit">Post</Button>
                </Group>
              </Stack>
            </Form>
          </Card>
        </Grid.Col>
      </Grid>
    </Box>
  );
}
