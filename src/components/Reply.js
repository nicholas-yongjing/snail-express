import ReactionBar from "../components/ReactionBar";

export default function Reply(props) {
  const currentThread = props.thread;
  const currentPost = props.post;
  const currentReply = props.reply;

  return (
    <div className='d-flex gap-5'>
      <div className='vr'></div>
      <div className="flex-grow-1 rounded slate-700 text-slate-200">
        <div className='p-4'>
          <h4><strong>{currentReply.author.email}</strong></h4>
          <p>{currentReply.body}</p>
        </div>
        <ReactionBar
          currentThread={currentThread}
          currentPost={currentPost}
          content={currentReply}
          contentType='reply'
          populatePosts={null}
        />
      </div>

    </div>
  );
}