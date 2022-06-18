import React, { useEffect, useState } from 'react';

import { useAuth } from "../contexts/AuthContext";
import { Container } from 'react-bootstrap';

import { getInvites, deleteInvite } from '../database';

export default function Invites() {
    const { currentUser } = useAuth();
    const [invites, setInvites] = useState([]);


    useEffect(() => {
        console.log('efftec')
        if (currentUser.email) {
            retrieveInvites();        
        }
    }, [currentUser]);

    function retrieveInvites() { 
        getInvites(currentUser.email).then((snapShot) => {
            setInvites([]);
            snapShot.forEach((invite) => {
                setInvites((oldInvites) => {
                    return [...oldInvites, { ...invite.data(), id: invite.id }]
                })
            });
        });
    }

    function handleDelete(inviteId) {
        deleteInvite(inviteId, currentUser.email)
            .then(() => retrieveInvites());
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
                            <button onClick={() => handleDelete(invite.id)}>delete invitation</button>
                        </div>
                    );
                })
            }
        </Container>
    );
};