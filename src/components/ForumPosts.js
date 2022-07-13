import { useCallback, useEffect, useState } from 'react';
import firestore from '../firestore';
import { useAuth } from '../contexts/AuthContext';
import { useClass } from '../contexts/ClassContext';
import AddPost from '../components/AddPost';
import Header from './Header';
import Post from "../components/Post"

export default function ForumPosts(props) {
  const { currentUser } = useAuth();
  const { currentClass } = useClass();
  const { getForumPosts } = firestore;
  const currentThread = props.currentThread;
  const [posts, setPosts] = useState([]);
  const [expandForm, setExpandForm] = useState(false);

  const populatePosts = useCallback(() => {
    if (currentUser && currentClass && currentThread) {
      getForumPosts(currentClass.id, currentThread.id).then((retrievedPosts) => {
        setPosts(retrievedPosts);
      });
    }
  }, [currentUser, currentClass, currentThread, getForumPosts]);

  useEffect(() => {
    populatePosts();
  }, [populatePosts]);

  return (
    <div className='d-flex flex-column align-items-stretch p-4 w-100 slate-800 text-slate-200'>
      <Header
        headerText={currentClass ? currentClass.className : ''}
        buttonText="Back to dashboard"
        linkTo="/class-dashboard"
        buttonClass="light-button"
      />

      {
        (currentThread === null)
          ? <div>No Threads Selected</div>
          : <div className='d-flex flex-column gap-2'>
            <Header
              headerText={currentThread.name}
              buttonText={expandForm ? "Hide Form" : "New Post"}
              handleClick={() => setExpandForm(!expandForm)}
              buttonClass={expandForm ? 'light-button' : 'create-button'}
            />
            {
              expandForm
                ? <AddPost
                  currentThread={currentThread}
                  populatePosts={() => {
                    setExpandForm(false);
                    populatePosts();
                  }}
                />
                : <></>
            }
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
      }
    </div>
  );
}