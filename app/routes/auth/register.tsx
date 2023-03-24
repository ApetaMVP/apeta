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
import { redirectAuthUser, register } from "~/server/auth";

const schema = z
  .object({
    name: z.string().nonempty({ message: "Name cannot be empty" }),
    email: z
      .string()
      .email({ message: "Invalid email" })
      .nonempty({ message: "Email cannot be empty" }),
    username: z.string().nonempty({ message: "Username cannot be empty" }),
    password: z.string().nonempty({ message: "Password cannot be empty" }),
    confirmPassword: z
      .string()
      .nonempty({ message: "Password cannot be empty" }),
  })
  .superRefine(({ confirmPassword, password }, ctx) => {
    if (confirmPassword !== password) {
      ctx.addIssue({
        code: "custom",
        message: "Passwords must match",
      });
    }
  });

export const loader = async ({ request }: LoaderArgs) => {
  return await redirectAuthUser(request);
};

export async function action({ request }: ActionArgs) {
  const { email, password, name, username } = Object.fromEntries(
    (await request.formData()).entries()
  );
  return await register(
    email as string,
    password as string,
    name as string,
    username as string
  );
}

export default function Register() {
  const actionData = useActionData();
  const error = actionData?.error;

  const form = useForm({
    validate: zodResolver(schema),
    validateInputOnBlur: true,
    initialValues: {
      name: "",
      email: "",
      username: "",
      password: "",
      confirmPassword: "",
    },
  });

  return (
    <Center h="100vh" bg="gray.1">
      <Card w="50%">
        <Form method="post">
          <Stack>
            <img src="/logo.png" alt="Apeta Logo" width={100} />
            <Title order={2}>Register</Title>
            <TextInput
              label="Name"
              name="name"
              {...form.getInputProps("name")}
            />
            <TextInput
              label="Email"
              name="email"
              {...form.getInputProps("email")}
            />
            <TextInput
              label="Username"
              name="username"
              {...form.getInputProps("username")}
            />
            <PasswordInput
              label="Password"
              name="password"
              {...form.getInputProps("password")}
            />
            <PasswordInput
              label="Confirm Password"
              name="confirmPassword"
              {...form.getInputProps("confirmPassword")}
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
              <Text>Already have an account?&nbsp;</Text>
              <Anchor href="/auth/login">Log in</Anchor>
            </Center>
          </Stack>
        </Form>
      </Card>
    </Center>
  );
}
