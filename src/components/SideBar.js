export default function SideBar(props) {
  return (
    <div
      className='d-flex flex-column align-items-stretch gap-3 p-4 fs-4 slate-700'
      style={{ width: 'min(400px, 25vw)' }}
    >
      {props.children}
    </div>
  );
}