import {
  Anchor,
  Button,
  Card,
  Center,
  Divider,
  PasswordInput,
  Stack,
  Text,
  TextInput,
  Title,
} from "@mantine/core";
import { useForm, zodResolver } from "@mantine/form";
import { ActionArgs, LoaderArgs } from "@remix-run/node";
import { Form, useActionData } from "@remix-run/react";
import { z } from "zod";
import { login, redirectAuthUser } from "~/server/auth";

const schema = z.object({
  email: z
    .string()
    .email({ message: "Invalid email" })
    .nonempty({ message: "Email cannot be empty" }),
  password: z.string().nonempty({ message: "Password cannot be empty" }),
});

export const loader = async ({ request }: LoaderArgs) => {
  return await redirectAuthUser(request);
};

export async function action({ request }: ActionArgs) {
  const { email, password } = Object.fromEntries(
    (await request.formData()).entries()
  );
  return await login(email as string, password as string);
}

export default function Login() {
  const actionData = useActionData();
  const error = actionData?.error;

  const form = useForm({
    validate: zodResolver(schema),
    validateInputOnBlur: true,
    initialValues: {
      email: "",
      password: "",
    },
  });

  return (
    <Center h="100vh" bg="gray.1">
      <Card w="50%">
        <Form method="post" action="/auth/login">
          <Stack>
            <img src="/logo.png" alt="Apeta Logo" width={100} />
            <Title order={2}>Log In</Title>
            <TextInput
              label="Email"
              name="email"
              {...form.getInputProps("email")}
            />
            <PasswordInput
              label="Password"
              name="password"
              {...form.getInputProps("password")}
            />
            <Button type="submit" disabled={!form.isValid()} fullWidth mt="xs">
              Submit
            </Button>
            {error && (
              <Center>
                <Text size="sm" color="red">
                  {error}
                </Text>
              </Center>
            )}
            <Divider />
            <Center>
              <Text>Don't have an account?&nbsp;</Text>
              <Anchor href="/auth/register">Sign up</Anchor>
            </Center>
          </Stack>
        </Form>
      </Card>
    </Center>
  );
}
