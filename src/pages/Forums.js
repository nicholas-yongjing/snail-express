import { useState, useEffect, useCallback } from 'react';
import { useClass } from "../contexts/ClassContext";
import { getForumThreads } from "../database";
import SideBar from "../components/SideBar";
import ForumPosts from "../components/ForumPosts";
import WebPage from '../components/WebPage';

export default function Forums() {
  const { currentClass } = useClass();
  const [threads, setThreads] = useState([]);
  const [currentThread, setCurrentThread] = useState(null);

  const populateThreads = useCallback(() => {
    if (currentClass.id) {
      getForumThreads(currentClass.id).then((retrievedThreads) => {
        if (retrievedThreads) {
          setThreads(retrievedThreads);
        }
      });
    }
  }, [currentClass.id])

  useEffect(() => {
    populateThreads()
  }, [populateThreads]);

  function handleClick(newThread) {
    setCurrentThread(newThread)
  }

  return (
    <WebPage>
      <div className='flex-grow-1 d-flex'>
        <SideBar
          currentThread={currentThread}
          setCurrentThread={setCurrentThread}
        >
          {
            (threads.length > 0)
              ? threads.map((thread) => {
                return (
                  <div
                    key={thread.id}
                    onClick={() => handleClick(thread)}
                    style={{ cursor: 'pointer' }}
                    className={currentThread && thread.id === currentThread.id
                      ? 'text-info'
                      : 'text-white'}
                  >
                    {thread.name}
                  </div>
                );
              })
              : <div className="text-white d-flex justify-content-center">No threads found</div>
          }
        </SideBar>
        <ForumPosts currentThread={currentThread}/>
      </div>
    </WebPage>

  );
}