import { useEffect, useState } from 'react';

import { useAuth } from "../contexts/AuthContext";
import { Container } from 'react-bootstrap';

import { getInvites, deleteInvite } from '../database';

export default function Invites() {
    const { currentUser } = useAuth();
    const [invites, setInvites] = useState([]);

    useEffect(() => {
        if (currentUser.email) {
            getInvites(currentUser.email)
                .then((querySnapshot) => {
                    setInvites(querySnapshot.docs.map((docSnapshot) => {
                        return { ...(docSnapshot.data()), id: docSnapshot.id };
                    }))
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
                        <div key={invite.id}>
                            <div>{invite.className}</div>
                            <div>Tutor: {invite.headTutor.email}</div>
                            <button onClick={() => handleDelete(invite.id)}>
                                delete invitation
                            </button>
                        </div>
                    );
                })
            }
        </Container>
    );
};