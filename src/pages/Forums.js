import { useState } from 'react';
import NavigationBar from "../components/NavigationBar";
import ForumSideBar from "../components/ForumSideBar";
import ForumPosts from "../components/ForumPosts";

export default function Forums() {
    const [currentThread, setCurrentThread] = useState(null);

    return (
        <>
        <NavigationBar />
        <div className='d-flex align-items-stretch'>
            <ForumSideBar
                currentThread={currentThread}
                setCurrentThread = {setCurrentThread}
            />
            <ForumPosts currentThread={currentThread}/>
        </div>
        </>

    );
}