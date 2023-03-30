import {
  Avatar,
  Box,
  Burger,
  Group,
  Header,
  Image,
  MantineTheme,
  MediaQuery,
  Menu,
} from "@mantine/core";
import { User } from "@prisma/client";
import { IconLogout, IconSettings } from "@tabler/icons";
import LinkButton from "./ui/LinkButton";

interface TopHeaderProps {
  opened: boolean;
  setOpened: React.Dispatch<any>;
  theme: MantineTheme;
  loggedIn: boolean;
  user?: User;
}

export default function TopHeader(props: TopHeaderProps) {
  return (
    <Header height={{ base: 50, md: 70 }} p="md">
      <div style={{ display: "flex", alignItems: "center", height: "100%" }}>
        <MediaQuery largerThan="sm" styles={{ display: "none" }}>
          <Burger
            opened={props.opened}
            onClick={() => props.setOpened((o: boolean) => !o)}
            size="sm"
            color={props.theme.colors.gray[6]}
            mr="xl"
          />
        </MediaQuery>
        <Group position="apart" w="100%">
          <Box w={150}>
            <a href="/site/for-you">
              <Image src="/logo.png" />
            </a>
          </Box>
          <Group>
            <LinkButton variant="default" link="/site/upload">
              + Upload
            </LinkButton>
            {!props.loggedIn ? (
              <LinkButton link="/auth/login" ml="xs">
                Log In
              </LinkButton>
            ) : (
              <Menu width={200}>
                <Menu.Target>
                  <Avatar src={props.user?.avatarUrl} radius="xl" />
                </Menu.Target>
                <Menu.Dropdown>
                  <Menu.Item
                    component="a"
                    href="/site/settings"
                    icon={<IconSettings />}
                  >
                    Settings
                  </Menu.Item>
                  <Menu.Divider />
                  <Menu.Item icon={<IconLogout />}>Log Out</Menu.Item>
                </Menu.Dropdown>
              </Menu>
            )}
          </Group>
        </Group>
      </div>
    </Header>
  );
}
