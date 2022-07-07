import { Dropdown, DropdownButton, Form } from "react-bootstrap";

export default function Question() {
  return (
    <div>
      <Form className="d-flex flex-column align-items-center">
        <Form.Group>
          <Form.Label className="text-slate-200">
            Question:
          </Form.Label>
          <Form.Control
            as="textarea"
            rows={3}
            required
            placeholder="Enter a question here to test your students' knowledge"
            className="generic-field mb-3"
          />
          <div className="d-flex"> 
          <Form.Label className="text-slate-200"  style={{minWidth: "120px"}}>
            Option A:
          </Form.Label>
          <Form.Control
            required
            placeholder="Possible option"
            className="generic-field mb-3"
          />
          <Form.Label className="text-slate-200"  style={{minWidth: "120px"}}>
            Option B:
          </Form.Label>
          <Form.Control
            required
            placeholder="Possible option"
            className="generic-field mb-3"
          />
          </div>
          <div className="d-flex"> 
          <Form.Label className="text-slate-200 mr-3"  style={{minWidth: "120px"}}>
            Option C:
          </Form.Label>
          <Form.Control
            required
            placeholder="Possible option"
            className="generic-field mb-3 "
          />
          <Form.Label className="text-slate-200"  style={{minWidth: "120px"}}>
            Option D:
          </Form.Label>
          <Form.Control
            required
            placeholder="Possible option"
            className="generic-field mb-3"
          />
          </div>
        </Form.Group>
        <DropdownButton title="Correct option">
            <Dropdown.Item>A</Dropdown.Item>
            <Dropdown.Item>B</Dropdown.Item>
            <Dropdown.Item>C</Dropdown.Item>
            <Dropdown.Item>D</Dropdown.Item>
        </DropdownButton>
      </Form>
    </div>
  );
}
