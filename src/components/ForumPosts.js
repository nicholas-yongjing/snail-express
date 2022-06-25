import { useEffect, useState } from 'react';
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
    <div className='d-flex flex-column align-items-stretch p-4 w-100 slate-800 text-slate-200'>
      <div className='d-flex justify-content-between'>
        <h1>
          <strong>
            {currentClass ? currentClass.className : ''}
          </strong>
        </h1>
        <Link className="generic-link fs-4" to='/class-dashboard'>Back to dashboard</Link>
      </div>
      <br />
      {
        (currentThread != null)
          ? <div className='d-flex flex-column gap-2'>
            <div className='d-flex justify-content-between align-items-center'>
              <h2>
                {currentThread.name}
              </h2>
              <button
                className={'btn' + (expandForm ? ' generic-button-light' : ' btn-success')}
                onClick={() => setExpandForm(!expandForm)}
              >
                {expandForm
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
              (posts.length > 0)
                ? posts.map((post) => <Post
                  key={post.id}
                  thread={currentThread}
                  post={post}
                  populatePosts={populatePosts}
                />)
                : "No posts in this thread"
            }
          </div>
          : <div>No Threads Selected</div>
      }
    </div>
  );
}