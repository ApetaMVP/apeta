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
              ⭐Two ways to use it ⭐
            </Text>
            <Text weight="bold">
              1. Post a video and ask for help on your sport
            </Text>
            <Text weight="bold">
              2. You are an expert like this guy. Post content and answer
              questions to build and engage your audience.
            </Text>
          </Stack>
        </Box>
      </Modal>
    </>
  );
}
