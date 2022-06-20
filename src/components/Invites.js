import { useEffect, useState } from 'react';

import { useAuth } from "../contexts/AuthContext";
import { Card } from 'react-bootstrap';

import { getInvites, deleteInvite, acceptInvite } from '../database';

export default function Invites() {
    const { currentUser } = useAuth();
    const [invites, setInvites] = useState([]);

    useEffect(() => {
        populateInvites();
    }, [currentUser.email]);

    function populateInvites() {
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
    }

    function handleAccept(inviteId) {
        acceptInvite(inviteId, currentUser.uid, currentUser.email)
            .then(() => populateInvites());
    }

    function handleDelete(inviteId) {
        deleteInvite(inviteId, currentUser.email)
            .then(() => populateInvites());
    }

    return (
        <Card>
            <Card.Body>
                <h1>Pending Invitations</h1>
                {
                    (invites.length > 0)
                    ? invites.map((invite) => {
                        return (
                            <Card key={invite.id}>
                                <Card.Body>
                                    <div>{invite.className}</div>
                                    <div>Tutor: {invite.headTutor.email}</div>
                                    <button onClick={() => handleAccept(invite.id)}>
                                        Accept invitation
                                    </button>
                                    <button onClick={() => handleDelete(invite.id)}>
                                        delete invitation
                                    </button>
                                </Card.Body>
                            </Card>
                        );
                    })
                    : <div>No invitations</div>
                }
            </Card.Body>
        </Card>
    );
};