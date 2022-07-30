import { useRef } from "react";
import { useClass } from "../contexts/ClassContext";
import { Form } from "react-bootstrap";
import InviteUser from "./InviteUser";
import Button from "../components/Button";

export default function SettingsGeneral(props) {
  const { currentClass, changeClassName } = useClass();
  const { setMessage, setError, loading, setLoading, role } = props;
  const componentProps = { setMessage, setError, loading, setLoading, role };
  const classNameRef = useRef();

  function handleUpdateClassName(event) {
    event.preventDefault();
    setMessage('');
    setError('');
    setLoading(true);
    changeClassName(classNameRef.current.value)
      .then(() => setMessage("Class name updated"))
      .catch(() => {
        setError('Error updating class name. Please try again later');
      }).finally(() => setLoading(false));
  }

  return (
    role === 'student'
      ? "No settings available"
      : <>
        <Form
          className="p-4 fs-4 d-flex align-items-end gap-2 slate-700"
          onSubmit={handleUpdateClassName}
        >
          <Form.Group>
            <Form.Label>Class Name</Form.Label>
            <Form.Control
              className="generic-field"
              size='lg'
              type="text"
              ref={classNameRef}
              required
              defaultValue={currentClass.className} />
          </Form.Group>
          <Button
            disabled={loading}
            type="submit"
            className="create-button"
          >
            Update
          </Button>
        </Form>
        <InviteUser
          {...componentProps}
          invitationType="student"
        /> 
      </>
  );
}