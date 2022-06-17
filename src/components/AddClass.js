import React, { useState, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { Form, Button, Alert } from "react-bootstrap";
import { createClass } from "../database";

import NavigationBar from "./NavigationBar";

export default function AddClass() {
    const { currentUser } = useAuth();
    const [error, setError] = useState('');
    const [loading, setLoading] = useState('');
    const classNameRef = useRef();
    const studentsRef = useRef();
    const navigate = useNavigate();

    async function handleSubmit(event) {
        event.preventDefault();
        try {
            setError('');
            setLoading(true);
            createClass(
                classNameRef.current.value,
                currentUser.uid,
                studentsRef.current.value.trim().split(/\s+/));
            navigate("/dashboard");
        } catch {
            setError('Failed to sign in');
        }
        setLoading(false);
    }

    return (
        <div>
            <NavigationBar />

            {error && <Alert variant="danger">{error}</Alert>}
            <Form onSubmit={handleSubmit}>
                <Form.Group id="class-name">
                    <Form.Label>Class Name</Form.Label>
                    <Form.Control type="text" ref={classNameRef} required />
                </Form.Group>
                <br></br>
                <Form.Group id="students">
                    <Form.Label>Students</Form.Label>
                    <Form.Control
                        as="textarea"    
                        rows={5}
                        ref={studentsRef}
                        required
                        placeholder="Enter students email separated by new lines"
                    />
                </Form.Group>
                <br></br>
                <Button disabled={loading} className="w-100" type="submit">
                    Create Class
                </Button>
            </Form>
            <br></br>
            <Link to="/dashboard">Back to dashboard</Link>

        </div>

    );

}