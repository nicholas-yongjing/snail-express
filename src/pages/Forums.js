import { useState } from 'react';
import ForumSideBar from "../components/ForumSideBar";
import ForumPosts from "../components/ForumPosts";
import WebPage from '../components/WebPage';

export default function Forums() {
  const [currentThread, setCurrentThread] = useState(null);

  return (
    <WebPage>
      <div className='flex-grow-1 flex-shrink-0 d-flex align-items-stretch'>
        <ForumSideBar
          currentThread={currentThread}
          setCurrentThread={setCurrentThread}
        />
        <ForumPosts currentThread={currentThread} />
      </div>
    </WebPage>

  );
}