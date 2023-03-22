import { Box, Button, Card, Grid, Group, Stack, Textarea } from "@mantine/core";
import { useForm, zodResolver } from "@mantine/form";
import { Form } from "@remix-run/react";
import { z } from "zod";
import FileUpload from "~/components/ui/FileUpload";
import LinkButton from "~/components/ui/LinkButton";

const schema = z.object({
  caption: z.string(),
});

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
