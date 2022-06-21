import { useEffect, useRef, useState } from "react";
import { useClass } from "../contexts/ClassContext";
import { addForumThread, getForumThreads } from "../database";
import { Alert, Button, Card, Form } from "react-bootstrap";
import { Link } from "react-router-dom";
import NavigationBar from "../components/NavigationBar";
import SideBar from "../components/SideBar";

export default function SettingsForums() {
    const { currentClass } = useClass();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [threads, setThreads] = useState([]);
    const newThreadNameRef = useRef();
    const sidebarLinks = [['/settings-general', 'General'],
    ['/settings-forums', 'Forum']];

    useEffect(() => {
        populateThreads()
    }, [currentClass.id]);

    async function populateThreads() {
        if (currentClass.id) {
            getForumThreads(currentClass.id).then((retrievedThreads) => {
                if (retrievedThreads) {
                    setThreads(retrievedThreads);
                }
            });
        }
    }

    async function handleCreateThread(event) {
        event.preventDefault();

        try {
            setError('');
            setLoading(true);
            await addForumThread(currentClass.id, newThreadNameRef.current.value)
                .then(() => populateThreads());
        } catch {
            setError('Failed to create forum thread');
        }
        setLoading(false);
    }

    return (
        <>
            <NavigationBar />
            <div className="d-flex">
                <SideBar links={sidebarLinks} />
                <div className="w-100 p-4">
                    <div className="d-flex justify-content-between">
                        <h1>
                            Forums Settings
                        </h1>
                        <Link to="/class-dashboard">
                            <button className='btn btn-secondary fs-4'>
                                Back to class dashboard
                            </button>
                        </Link>
                    </div>
                    <Card className="p-3">
                        <Card className="p-3">
                            <h2>Create new thread</h2>
                            {error && <Alert variant="danger">{error}</Alert>}
                            <Form onSubmit={handleCreateThread}>
                                <Form.Group id="thread-name">
                                    <Form.Label>Thread Name</Form.Label>
                                    <Form.Control type="text" ref={newThreadNameRef} required />
                                </Form.Group>
                                <br></br>
                                <Button disabled={loading} className="w-25" type="submit">
                                    Create Thread
                                </Button>
                            </Form>
                        </Card>
                        <br />
                        <h2>
                            Forum Threads
                        </h2>
                        {
                            threads.map((thread) => {
                                return(
                                <Card key={thread.id}>
                                    {thread.name}
                                </Card>
                                );
                            })
                        }
                    </Card>
                </div>
            </div>
        </>
    );
}