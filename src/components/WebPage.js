import NavigationBar from "./NavigationBar";

export default function WebPage(props) {
  const children = props.children;
  return (<div
    className="vh-100 d-flex flex-column slate-800">
      <NavigationBar />
      <div className="slate-800">
        {children}
      </div>
    </div>
  );
}