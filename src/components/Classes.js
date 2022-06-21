import { useEffect, useState } from 'react';
import { Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { useClass } from '../contexts/ClassContext';
import { getClasses } from '../database';
import { Card } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

export default function Classes() {
    const { currentUser } = useAuth();
    const { setCurrentClass } = useClass();
    const [enrolledClasses, setEnrolledClasses] = useState([]);
    const [teachingClasses, setTeachingClasses] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        if (currentUser.email) {
            populateClasses('student', setEnrolledClasses);
            populateClasses('tutor', setTeachingClasses);
        }
    }, [currentUser]);

    function populateClasses(userType, setter) {
        getClasses(currentUser.uid, userType).then((classes) => {
            if (classes) {
                setter(classes);
            }
        })
    }

    function handleClick(clss) {
        setCurrentClass(clss)
        navigate('/class-dashboard');
    }

    return (
        <Card>
            <Card.Body>
                <div className='d-flex gap-3 justify-content-between'>
                    <h1>My classes</h1>
                    <Link to="/add-class">
                        <button type="button" className="btn btn-primary">
                            Add Class
                        </button>
                    </Link>
                </div>
                <br />
                {[['Enrolled', enrolledClasses],
                ['Teaching', teachingClasses]].map(([header, arr]) => {
                    return (
                        <Card key={header}>
                            <h2 className='d-flex justify-content-center p-2'>{header}</h2>
                            <br />
                              {
                                (arr.length > 0) 
                                ? arr.map((clss) => {
                                    return (
                                        <Card
                                            key={clss.id} 
                                            onClick={() => handleClick(clss)}
                                            className='d-flex justify-content-center m-2 border-primary'
                                            style={{cursor:'pointer'}}
                                        >
                                            <Card.Body>
                                                <div>{clss.className}</div>
                                            </Card.Body>
                                        </Card>
                                    );
                                })
                                : <h4 className='d-flex justify-content-center'>No classes</h4>
                            } 
                        </Card>
                    );
                })}
            </Card.Body>
        </Card>
    );
};
