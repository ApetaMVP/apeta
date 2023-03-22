import {
  Badge,
  Button,
  Divider,
  Navbar,
  NavLink,
  Stack,
  Text,
} from "@mantine/core";
import { IconHome, IconUser } from "@tabler/icons";
import { useEffect, useState } from "react";

interface LeftNavProps {
  opened: boolean;
  setOpened: React.Dispatch<any>;
}

export default function LeftNav(props: LeftNavProps) {
  const [activeLink, setActiveLink] = useState("");

  useEffect(() => {
    if (typeof window !== "undefined") {
      setActiveLink(window?.location.href);
    }
  }, []);

  return (
    <Navbar
      hiddenBreakpoint="sm"
      hidden={!props.opened}
      width={{ sm: 200, lg: 250 }}
    >
      <Navbar.Section>
        <NavLink
          label="For You"
          icon={<IconHome />}
          component="a"
          href="/home"
          active={activeLink.includes("/home")}
          p="md"
        />
        <NavLink
          label="Following"
          icon={<IconUser />}
          component="a"
          href="/following"
          active={activeLink.includes("/following")}
          p="md"
        />
      </Navbar.Section>
      <Divider my="sm" />
      <Navbar.Section>
        <Stack mx="lg">
          <Text c="dimmed" size="sm">
            Log in to upload videos, edit videos, and view comments
          </Text>
          <Button variant="outline" w="100%">
            Log In
          </Button>
        </Stack>
      </Navbar.Section>
      <Divider my="sm" />
      <Stack mx="lg" spacing="xs">
        <Text fz="lg">Discover</Text>
        <Badge color="gray">#skimoguls</Badge>
        <Badge color="gray">#tennisbackhand</Badge>
        <Badge color="gray">#weightliftingcrossfit</Badge>
      </Stack>
    </Navbar>
  );
}
