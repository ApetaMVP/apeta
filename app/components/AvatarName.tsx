import { Avatar, Group, Title } from "@mantine/core";

interface AvatarNameProps {
  name: string;
  avatarUrl: string;
}

export default function AvatarName(props: AvatarNameProps) {
  const { name, avatarUrl } = props;
  return (
    <Group spacing="xs">
      <Avatar src={avatarUrl} size="sm" bg="white" radius="xl" />
      <Title order={3}>{name}</Title>
    </Group>
  );
}
