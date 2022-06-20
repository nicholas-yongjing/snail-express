import { Link } from 'react-router-dom';
import { useClass } from '../contexts/ClassContext';
import NavigationBar from "../components/NavigationBar";
import ClassSideBar from "../components/ClassSideBar"

export default function ClassDashBoard() {
    const { currentClass } = useClass();

    return (
        <>
            <NavigationBar />
            <div className='d-flex'>
                <ClassSideBar />
            <div className='d-flex justify-content-between p-4 w-100'>
                <span className='fs-1'>{currentClass ? currentClass.className : ''} </span>
                <span>
                    <Link to='/dashboard'>
                        <button className='btn btn-secondary fs-4'>
                            Back to dashboard
                        </button>
                    </Link>
                </span>
            </div>
            </div>
        </>

    );
}