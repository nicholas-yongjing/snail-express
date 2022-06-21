import { useEffect, useState } from 'react';

import { useAuth } from "../contexts/AuthContext";
import { Card } from 'react-bootstrap';

import { getInvites, deleteInvite, acceptInvite } from '../database';

export default function Invites(props) {
    const { currentUser } = useAuth();
    const [invites, setInvites] = useState([]);
    const populateClasses = props.populateClasses;

    useEffect(() => {
        populateInvites();
    }, [currentUser.email]);

    function populateInvites() {
        console.log('populating invites');
        if (currentUser.email) {
            getInvites(currentUser.email).then((invites) => {
                if (invites) {
                    setInvites(invites);
                }
            })
        }
    }

    function handleAccept(inviteId) {
        acceptInvite(inviteId, currentUser.uid, currentUser.email)
            .then(() => {
                populateInvites();
                populateClasses();
            });
    }

    function handleDelete(inviteId) {
        console.log('deleting invites');
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