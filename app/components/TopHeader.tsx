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
  const { opened, setOpened, theme, loggedIn, user } = props;

  return (
    <Header height={{ base: 50, md: 70 }} p="md">
      <div style={{ display: "flex", alignItems: "center", height: "100%" }}>
        <MediaQuery largerThan="sm" styles={{ display: "none" }}>
          <Burger
            opened={opened}
            onClick={() => setOpened((o: boolean) => !o)}
            size="sm"
            color={theme.colors.gray[6]}
            mr="xl"
          />
        </MediaQuery>
        <Group position="apart" w="100%">
          <Box w={80}>
            <a href="/site/for-you">
              <Image fit="contain" src="/logo.png" />
            </a>
          </Box>
          <Group>
            <LinkButton compact size="xs" variant="default" link="/site/upload">
              + Upload
            </LinkButton>
            {!loggedIn ? (
              <LinkButton compact size="xs" link="/auth/login" ml="xs">
                Log In
              </LinkButton>
            ) : (
              <Menu width={200}>
                <Menu.Target>
                  <Avatar src={user?.avatarUrl} radius="xl" />
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
                    <Menu.Item
                      component="a"
                      href="/auth/logout"
                      icon={<IconLogout />}>
                      Log Out
                    </Menu.Item>
                </Menu.Dropdown>
              </Menu>
            )}
          </Group>
        </Group>
      </div>
    </Header>
  );
}
