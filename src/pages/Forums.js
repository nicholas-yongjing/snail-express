import { useState } from 'react';
import NavigationBar from "../components/NavigationBar";
import ForumSideBar from "../components/ForumSideBar";
import ForumPosts from "../components/ForumPosts";

export default function Forums() {
    const [thread, setThread] = useState(null);

    return (
        <>
        <NavigationBar />
        <div className='d-flex'>
            <ForumSideBar thread={thread} setThread = {setThread}/>
            <ForumPosts thread={thread}/>
        </div>
        </>

    );
}