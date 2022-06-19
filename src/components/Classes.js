import { useEffect, useState } from 'react';
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
        getClasses(currentUser.uid, userType)
            .then((querySnapshot) => {
                if (querySnapshot !== undefined) {
                    setter(querySnapshot.docs.map((docSnapshot) => {
                        return { ...(docSnapshot.data()), id: docSnapshot.id };
                    }))
                }
            })
    }

    function handleClick(clss) {
        setCurrentClass(clss)
        navigate('/forums');
    }

    return (
        <Card>
            <Card.Body>
                <h1>My classes</h1>
                {[['Enrolled', enrolledClasses],
                ['Teaching', teachingClasses]].map(([header, arr]) => {
                    return (
                        <div key={header}>
                            <h2>{header}</h2>
                            {
                                arr.map((clss) => {
                                    return (
                                        <Card
                                            key={clss.id} 
                                            onClick={() => handleClick(clss)}
                                        >
                                            <Card.Body>
                                                <div>{clss.className}</div>
                                            </Card.Body>
                                        </Card>
                                    );
                                })
                            }
                        </div>
                    );
                })}
            </Card.Body>
        </Card>
    );
};
