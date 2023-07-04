import { Button, ButtonProps } from "@mantine/core";

interface LinkButtonProps extends ButtonProps {
  link: string;
}

export default function LinkButton(props: LinkButtonProps) {
  return <Button size="xs" component="a" href={props.link} {...props}></Button>;
}
