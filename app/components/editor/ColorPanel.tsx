const colors = [
  "#000000",
  "#464646",
  "#787878",
  "#980031",
  "#ed1d25",
  "#ff7d01",
  "#ffc30e",
  "#a7e71d",
  "#23b14c",
  "#03b8ef",
  "#4c6cf3",
  "#303699",
  "#6e3198",
  "#ffffff",
  "#dcdcdc",
  "#9c593c",
  "#ffa3b1",
  "#e5aa7a",
  "#f5e59c",
  "#fff9be",
  "#d3f9bc",
  "#9cbb60",
  "#99d9eb",
  "#6f99d2",
  "#536c8e",
  "#b5a5d6",
];

const SelectedColor = (props) => {
  const style = {
    backgroundColor: props.color,
  };
  return <div className="color-selected" style={style} />;
};

const Color = (props) => {
  const style = {
    backgroundColor: props.color,
  };
  return <div className="color" style={style} onClick={props.handleClick} />;
};

interface ColorPanelProps {
  selectedColor: string;
  handleClick: (e: any) => void;
}

export default function ColorPanel(props: ColorPanelProps) {
  const { selectedColor, handleClick } = props;

  const onClick = (e: any) => {
    handleClick(e);
  };

  return (
    <>
      <div style={{ display: "flex", alignItems: "center" }}>
        <SelectedColor color={selectedColor} />
        <div className="color-panel">
          {colors.map((color) => (
            <Color color={color} key={color} handleClick={onClick} />
          ))}
        </div>
      </div>
    </>
  );
}
