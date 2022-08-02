import { useState } from "react";

export default function Gallery(props) {
  const items = props.items;
  const [currentItem, setCurrentItem] = useState(0);

  const nextItem = () => {
    setCurrentItem((currentItem + 1) % items.length) 
  }
  const prevItem = () => {
    if (currentItem === 0) {
      setCurrentItem(items.length - 1);
    } else {
      setCurrentItem(currentItem - 1); 
    }
  }

  return (
    <div className="rounded d-flex justify-content-between">
      <div
        className="fs-1 p-5 d-flex justify-content-center align-items-center slate-700 hover-slate-500"
        style={{cursor: 'pointer'}}
        onClick={prevItem}>
        {"<"}
      </div>
      {
        items[currentItem]
      }
      <div
        className="fs-1 p-5 d-flex justify-content-center align-items-center slate-700 hover-slate-500"
        style={{cursor: 'pointer'}}
        onClick={nextItem}>
        {">"}
      </div>
    </div>
    
  );
}