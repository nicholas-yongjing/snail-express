import NavigationBar from "./NavigationBar";

export default function WebPage(props) {
  const children = props.children;
  return (
    <div data-testid="webpage" className="vh-100 slate-800 d-flex flex-column">
      <NavigationBar />
      <div className="flex-grow-1 slate-800 text-slate-200 d-flex flex-column fs-4">
        {children}
      </div>
    </div>
  );
}
