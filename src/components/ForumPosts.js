import { useEffect, useState } from 'react';
import { Card } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { useClass } from '../contexts/ClassContext';
import { getForumPosts } from "../database";
import AddPost from '../components/AddPost';
import Post from "../components/Post"


export default function ForumPosts(props) {
  const { currentClass } = useClass();
  const currentThread = props.currentThread;
  const [posts, setPosts] = useState([]);
  const [expandForm, setExpandForm] = useState(false);

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
            <div className='d-flex justify-content-between align-items-center'>
              <h2>
                {currentThread.name}
              </h2>
              <button
                className={'btn' + ( expandForm ? ' btn-secondary' : ' btn-success')}
                onClick={() => setExpandForm(!expandForm)}
              >
                { expandForm
                    ? "Hide Form"
                    : "New Post"
                }
              </button>
            </div>
            {
              expandForm
                ? <AddPost
                    currentThread={currentThread}
                    populatePosts={populatePosts}
                />
                : <></>
            }

            <br />
            {
              posts.map((post) => <Post
                  key={post.id}
                  thread={currentThread}
                  post={post}
                  populatePosts={populatePosts}
              />)
            }
          </Card>
          : <div>No Threads Selected</div>
      }
    </div>
  );
}