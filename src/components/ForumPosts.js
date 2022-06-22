import { useEffect, useState } from 'react';
import { Card } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { useClass } from '../contexts/ClassContext';
import { getForumPosts } from "../database";
import AddPost from '../components/AddPost';
import ReactionBar from "../components/ReactionBar";

export default function ForumPosts(props) {
    const { currentClass } = useClass();
    const currentThread = props.currentThread;
    const [posts, setPosts] = useState([]);

    useEffect(() => {
        populatePosts();
    }, [currentThread]);

    function populatePosts() {
        if (currentClass && currentThread) {
            getForumPosts(currentClass.id, currentThread.id).then((retrievedPosts) => {
                setPosts(retrievedPosts);
            });
        }
    }

    return (
        <div className='d-flex flex-column align-items-stretch p-4 w-100'>
            <div className='d-flex justify-content-between'>
                <h1>{currentClass ? currentClass.className : ''} </h1>
                <span><Link to='/class-dashboard'>Back to dashboard</Link></span>
            </div>
            <br />
            {
                (currentThread != null)
                    ? <Card className='p-4 d-flex flex-column gap-2'>
                        <h2>
                            {currentThread.name}
                        </h2>
                        <AddPost
                            currentThread={currentThread}
                            populatePosts={populatePosts}
                        />
                        <br />
                        {
                            posts.map((post) => {
                                return (
                                    <Card key={post.id}>
                                      <Card.Body>
                                        <h3><strong>{post.title}</strong></h3>
                                        <h4>{post.author.email}</h4>
                                        <p>{post.body}</p>
                                      </Card.Body>
                                      <ReactionBar
                                        currentThread={currentThread}
                                        content={post}
                                        contentType='post'
                                      />
                                    </Card>
                                );
                            })
                        }
                    </Card>
                    : <div>No Threads Selected</div>
            }
        </div>
    );
}