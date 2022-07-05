import { useAuth } from "../contexts/AuthContext";
import { deleteInvite, acceptInvite } from '../database';
import { Card } from 'react-bootstrap';

export default function Invites(props) {
  const { currentUser } = useAuth();
  const invites = props.invites;
  const role = props.role;
  const populateClasses = props.populateClasses;
  const populateInvites = props.populateInvites;

  function handleAccept(inviteId) {
    acceptInvite(inviteId, currentUser.uid, role, currentUser.email, currentUser.displayName)
      .then(() => {
        populateClasses();
      }).then(() => {
        populateInvites();
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
              <Card key={invite.id} className='fs-5 slate-800'>
                <Card.Body className='d-flex flex-column gap-2'>
                  <h4><strong>{invite.className}</strong></h4>
                  <div>Tutor: {invite.headTutor.email}</div>
                  <div>You are invited to be a {role} for this class</div>
                  <div className='d-flex gap-2'>
                    <button
                      onClick={() => handleAccept(invite.id)}
                      className="btn btn-success"
                    >
                      Accept invitation
                    </button>
                    <button
                      onClick={() => handleDelete(invite.id)}
                      className='btn generic-button-light'
                    >
                      Delete invitation
                    </button>
                  </div>
                </Card.Body>
              </Card>
            );
          })
          : <h4>No invitations to be a {role}</h4>
      }
    </div>
  );
};