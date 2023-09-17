import { useDisclosure } from "@mantine/hooks";
import { Modal, Button, Group, Text, Stack, Box } from "@mantine/core";

export default function WelcomeModal({
  startOpened,
}: {
  startOpened: boolean;
}) {
  const [opened, { open, close }] = useDisclosure(startOpened);

  return (
    <>
      <Modal opened={opened} onClose={close} withCloseButton={false}>
        <Box p="lg">
          <Stack spacing="md">
            <Stack align="center">
              <img src="/logo.png" alt="Apeta Logo" width={100} />
            </Stack>

            <Text size="lg" weight="bold" align="center">
              The Apeta website is unsupported.{" "}
            </Text>

            <Text size="lg" weight="bold" align="center">
              To get the Apeta experience, please{" "}
              <a href="https://apps.apple.com/app/6461686797">
                download the Apeta mobile app.
              </a>
            </Text>
          </Stack>
        </Box>
      </Modal>
    </>
  );
}
