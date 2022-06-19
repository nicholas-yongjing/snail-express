import { useEffect, useState } from 'react';

import { useAuth } from "../contexts/AuthContext";
import { Card, Container } from 'react-bootstrap';

import { getInvites, deleteInvite, acceptInvite } from '../database';

export default function Invites() {
    const { currentUser } = useAuth();
    const [invites, setInvites] = useState([]);

    useEffect(() => {
        if (currentUser.email) {
            getInvites(currentUser.email)
                .then((querySnapshot) => {
                    if (querySnapshot !== undefined) {
                        setInvites(querySnapshot.docs.map((docSnapshot) => {
                            return { ...(docSnapshot.data()), id: docSnapshot.id };
                        }))
                    }
                })
        }
    }, [currentUser, handleDelete]);

    function handleDelete(inviteId) {
        deleteInvite(inviteId, currentUser.email)
    }

    return (
        <Container>
            <h1>My classes</h1>
            {
                invites.map((invite) => {
                    return (
                        <Card key={invite.id}>
                            <Card.Body>
                                <div>{invite.className}</div>
                                <div>Tutor: {invite.headTutor.email}</div>
                                <button onClick={() => acceptInvite(invite.id, currentUser.uid, currentUser.email)}>
                                    Accept invitation
                                </button>
                                <button onClick={() => handleDelete(invite.id)}>
                                    delete invitation
                                </button>
                            </Card.Body>
                        </Card>
                    );
                })
            }
        </Container>
    );
};