export default function SideBar(props) {
  return (
    <div
      data-testid="sidebar"
      className='d-flex flex-column align-items-stretch gap-3 p-4 fs-4 slate-700'
      style={{ width: 'max(min(400px, 25vw), 400px)'}}
    >

      {props.children}
    </div>
  );
}