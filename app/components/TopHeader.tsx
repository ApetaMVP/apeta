import {
  Box,
  Burger,
  Group,
  Header,
  Image,
  MantineTheme,
  MediaQuery,
} from "@mantine/core";
import LinkButton from "./ui/LinkButton";

interface TopHeaderProps {
  opened: boolean;
  setOpened: React.Dispatch<any>;
  theme: MantineTheme;
  loggedIn: boolean;
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
            <Image src="/logo.png" alt="Apeta Logo" />
          </Box>
          {/* <TextInput placeholder="Search" icon={<IconSearch />} w="33%" /> */}
          <Box>
            <LinkButton variant="default" link="/site/upload">
              + Upload
            </LinkButton>
            {!props.loggedIn && (
              <LinkButton link="/auth/login" ml="xs">
                Log In
              </LinkButton>
            )}
          </Box>
        </Group>
      </div>
    </Header>
  );
}
