import NavigationBar from "./NavigationBar";

export default function WebPage(props) {
  const children = props.children;
  return (<div
    className="vh-100  slate-800">
      <NavigationBar />
      <div className="slate-800 d-flex flex-column">
        {children}
      </div>
    </div>
  );
}