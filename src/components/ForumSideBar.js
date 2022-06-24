import { useEffect, useState } from "react";
import { useClass } from "../contexts/ClassContext";
import { getForumThreads } from "../utilities/database";

export default function ForumSideBar(props) {
    const {currentThread, setCurrentThread} = props;
    const [threads, setThreads] = useState([]);
    const { currentClass } = useClass();

    useEffect(() => {
        populateThreads()
    }, [currentClass.id]);

    async function populateThreads() {
        if (currentClass.id) {
            getForumThreads(currentClass.id)
                .then((querySnapshot) => {
                    if (querySnapshot !== undefined) {
                        setThreads(querySnapshot.docs.map((docSnapshot) => {
                            return { ...(docSnapshot.data()), id: docSnapshot.id };
                        }))
                    }
                })
        }
    }

    function handleClick(newThread) {
        setCurrentThread(newThread)
    }

    return (
        <div
            className='d-flex flex-column align-items-stretch gap-3 p-4 bg-secondary fs-4'
            style={{height: '100vh', width: 'min(400px, 25vw)'}}
        >
            {
                (threads.length > 0)
                ? threads.map((thread) => {
                    return (
                        <div
                            key={thread.id}
                            onClick={() => handleClick(thread)}
                            style={{cursor: 'pointer'}}
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
        </div>

    );
}