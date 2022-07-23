import { useCallback, useEffect, useState } from "react";
import { useClass } from "../contexts/ClassContext";
import firestore from "../firestore";
import { Card } from "react-bootstrap";
import AddThread from "../pages/AddThread";

export default function SettingsForums(props) {
  const { currentClass } = useClass();
  const { getForumThreads } = firestore;
  const { role } = props;
  const [threads, setThreads] = useState([]);

  const populateThreads = useCallback(() => {
    if (currentClass && (role === 'head tutor' || role === 'tutor')) {
      getForumThreads(currentClass.id).then((retrievedThreads) => {
        if (retrievedThreads) {
          setThreads(retrievedThreads);
        }
      });
    }
  }, [currentClass, role, getForumThreads]);

  useEffect(() => {
    populateThreads()
  }, [populateThreads]);

  return (
    role === 'student'
      ? "No settings available"
      :
      <>
        <AddThread populateThreads={populateThreads} />
        <Card className="p-4 slate-700 d-flex flex-column gap-2">
          <h2>
            Forum Threads
          </h2>
          <div className="d-flex flex-column gap-2 fs-4">
            {
              (threads.length > 0)
                ? threads.map((thread) => {
                  return (
                    <div
                      key={thread.id}
                      className="p-2"
                    >
                      {thread.name}
                    </div>
                  );
                })
                : "No threads created"
            }
          </div>
        </Card>

      </>
  );
}