export default function Gallery(props) {
  const items = props.items;

  return (
    items.map((item) => <div key={item}></div>)
  );
}