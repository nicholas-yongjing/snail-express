import { useEffect, useState } from 'react';

import { useAuth } from "../contexts/AuthContext";
import { Card, Container } from 'react-bootstrap';

import { getClasses } from '../database';

export default function Classes() {
    const { currentUser } = useAuth();
    const [classes, setClasses] = useState([]);

    useEffect(() => {
        if (currentUser.email) {
            getClasses(currentUser.uid, 'student')
                .then((querySnapshot) => {
                    if (querySnapshot !== undefined) {
                        setClasses(querySnapshot.docs.map((docSnapshot) => {
                            return { ...(docSnapshot.data()), id: docSnapshot.id };
                        }))
                    }
                })
        }
    }, [currentUser]);

    return (
        <Container>
            <h1>My classes</h1>
            {
                classes.map((clss) => {
                    return (
                        <Card key={clss.id}>
                            <Card.Body>
                                <div>{clss.className}</div>
                            </Card.Body>
                        </Card>
                    );
                })
            }
        </Container>
    );
};
