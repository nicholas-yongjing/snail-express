import NavigationBar from "./NavigationBar";

export default function WebPage(props) {
  const children = props.children;
  return (<div
    className="vh-100 slate-800 d-flex flex-column">
      <NavigationBar />
      <div className="flex-grow-1 slate-800 d-flex flex-column">
        {children}
      </div>
    </div>
  );
}