
import { Link } from 'react-router-dom';
import { useClass } from '../contexts/ClassContext';

export default function ForumPosts(props) {
    const { currentClass } = useClass();
    const thread = props.thread;
    return (
        <div className='d-flex flex-column align-items-stretch p-4 w-100'>
            <div className='d-flex justify-content-between'>
                <h1>{currentClass ? currentClass.className : ''} </h1>
                <span><Link to='/class-dashboard'>Back to dashboard</Link></span>
            </div>
            <br />
            {
                (thread != null)
                    ? <div></div>
                    : <div>No Threads Selected</div>
            }
        </div>
    );
}