import { ActionIcon, Group } from "@mantine/core";

interface ToolButtonProps {
  active: boolean;
  name: string;
  icon: JSX.Element;
  handleClick: any;
}
const ToolButton = (props: ToolButtonProps) => {
  const { active, name, icon, handleClick } = props;
  return (
    <ActionIcon
      color="brand"
      variant={active ? "filled" : "outline"}
      onClick={(e) => handleClick(e, name)}
    >
      {props.icon}
    </ActionIcon>
  );
};

interface ToolboxProps {
  items: any;
  activeItem: string;
  handleClick: (e: any, name: string) => void;
}

export default function Toolbox(props: ToolboxProps) {
  const { items, activeItem, handleClick } = props;

  const onClick = (e: any, name: string) => {
    handleClick(e, name);
  };

  return (
    <Group>
      {items.map((i: any) => (
        <ToolButton
          key={i.name}
          active={activeItem === i.name ? true : false}
          name={i.name}
          icon={i.image}
          handleClick={onClick}
        />
      ))}
    </Group>
  );
}
