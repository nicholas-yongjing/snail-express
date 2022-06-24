import { useEffect, useState } from 'react';
import { useAuth } from "../contexts/AuthContext";
import { Card } from 'react-bootstrap';
import { getInvites, deleteInvite, acceptInvite } from '../database';

export default function Invites(props) {
  const { currentUser } = useAuth();
  const [invites, setInvites] = useState([]);
  const role = props.role;
  const populateClasses = props.populateClasses;

  useEffect(() => {
    populateInvites();
  }, [currentUser.email]);

  function populateInvites() {
    if (currentUser.email) {
      getInvites(currentUser.email, role).then((invites) => {
        if (invites) {
          setInvites(invites);
        }
      })
    }
  }

  function handleAccept(inviteId) {
    acceptInvite(inviteId, currentUser.uid, role, currentUser.email)
      .then(() => {
        populateInvites();
        populateClasses();
      });
  }

  function handleDelete(inviteId) {
    console.log('deleting invites');
    deleteInvite(inviteId, role, currentUser.email)
      .then(() => populateInvites());
  }

  return (
    <div>
      {
        (invites.length > 0)
          ? invites.map((invite) => {
            return (
              <Card key={invite.id} className='fs-5'>
                <Card.Body>
                  <h4><strong>{invite.className}</strong></h4>
                  <div>Tutor: {invite.headTutor.email}</div>
                  <div>You are invited to be a {role} for this class</div>
                  <div className='d-flex gap-2'>
                    <button
                      onClick={() => handleAccept(invite.id)}
                      className="btn btn-primary"
                    >
                      Accept invitation
                    </button>
                    <button
                      onClick={() => handleDelete(invite.id)}
                      className='btn btn-secondary'
                    >
                      delete invitation
                    </button>
                  </div>
                </Card.Body>
              </Card>
            );
          })
          : <Card>
            <Card.Body>
              <h4>No invitations to be a {role}</h4>
            </Card.Body>
          </Card>
      }
    </div>
  );
};