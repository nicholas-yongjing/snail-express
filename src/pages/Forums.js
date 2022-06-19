import { Link, useNavigate } from 'react-router-dom';
import { useClass } from '../contexts/ClassContext';
import NavigationBar from "../components/NavigationBar";
import { useEffect } from 'react';

export default function Forums() {
    const { currentClass } = useClass();
    const navigate = useNavigate();

    return (
        <>
        <NavigationBar />
        <div>
            <span>{currentClass ? currentClass.className : ''} </span>
            <span><Link to='/dashboard'>Back to dashboard</Link></span>
        </div>
        
        </>

    );
}