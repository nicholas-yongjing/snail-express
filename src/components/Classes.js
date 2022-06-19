import { useEffect, useState } from 'react';

import { useAuth } from "../contexts/AuthContext";
import { Card } from 'react-bootstrap';

import { getClasses } from '../database';

export default function Classes() {
    const { currentUser } = useAuth();
    const [enrolledClasses, setEnrolledClasses] = useState([]);
    const [teachingClasses, setTeachingClasses] = useState([]);

    useEffect(() => {
        if (currentUser.email) {
            getClasses(currentUser.uid, 'student')
                .then((querySnapshot) => {
                    if (querySnapshot !== undefined) {
                        setEnrolledClasses(querySnapshot.docs.map((docSnapshot) => {
                            return { ...(docSnapshot.data()), id: docSnapshot.id };
                        }))
                    }
                })
            getClasses(currentUser.uid, 'tutor')
                .then((querySnapshot) => {
                    if (querySnapshot !== undefined) {
                        setTeachingClasses(querySnapshot.docs.map((docSnapshot) => {
                            return { ...(docSnapshot.data()), id: docSnapshot.id };
                        }))
                    }
                })
        }
    }, [currentUser]);

    return (
        <Card>
            <Card.Body>
            <h1>My classes</h1>
            <h2>Enrolled</h2>
            {
                enrolledClasses.map((clss) => {
                    return (
                        <Card key={clss.id}>
                            <Card.Body>
                                <div>{clss.className}</div>
                            </Card.Body>
                        </Card>
                    );
                })
            }
            <h2>Teaching</h2>
            {
                teachingClasses.map((clss) => {
                    return (
                        <Card key={clss.id}>
                            <Card.Body>
                                <div>{clss.className}</div>
                            </Card.Body>
                        </Card>
                    );
                })
            }
        </Card.Body>
        </Card>
    );
};
