import { useState, useEffect, useCallback } from 'react';
import { useClass } from "../contexts/ClassContext";
import firestore from '../firestore';
import SideBar from "../components/SideBar";
import ForumPosts from "../components/ForumPosts";
import WebPage from '../components/WebPage';
import AddThread from './AddThread';
import Button from '../components/Button';

export default function Forums() {
  const { currentClass } = useClass();
  const { getForumThreads } = firestore;
  const [threads, setThreads] = useState([]);
  const [currentThread, setCurrentThread] = useState(null);
  const [addingThread, setAddingThread] = useState(false);

  const populateThreads = useCallback(() => {
    if (currentClass.id) {
      getForumThreads(currentClass.id).then((retrievedThreads) => {
        if (retrievedThreads) {
          setThreads(retrievedThreads);
        }
      });
    }
  }, [currentClass.id, getForumThreads])

  useEffect(() => {
    populateThreads()
  }, [populateThreads]);

  function handleSelectThread(newThread) {
    setCurrentThread(newThread);
    setAddingThread(false);
  }

  function handleSelectForm() {
    setAddingThread(true);
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
                    onClick={() => handleSelectThread(thread)}
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
          {
            <Button className="create-button" onClick={handleSelectForm}>
              +
            </Button>
          }
        </SideBar>
        {
          addingThread
          ? <div className='p-4 slate-800 w-100'>
              <AddThread populateThreads={populateThreads} />
            </div>
          : <ForumPosts currentThread={currentThread} />
        }
      </div>
    </WebPage>

  );
}