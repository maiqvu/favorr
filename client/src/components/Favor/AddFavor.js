import React, { useState } from 'react';

import { Form, Row, Col, Button } from 'react-bootstrap';

const AddFavor = () => {
  const [newFavor, setNewFavor] = useState({ description: '' });
  const [owedByMe, setOwedByMe] = useState();
  
  const handleSubmit = (e) => {
    e.preventDefault();
  };
  
  const handleSelectFavor = (e) => {
    setNewFavor({ [e.target.name]: e.target.value });
  };
  
  const handleOwedByMe = (e) => {
    if (e.target.value === 'owed by') {
      setOwedByMe(true);
    } else {
      setOwedByMe(false);
    }
  };
  
  return (
    <Form onSubmit={handleSubmit}>
      <h3 className="text-left">Create a new favor</h3>
      
      <Form.Group as={Row} controlId="selectFavor">
        <Form.Label column sm={2}>Description</Form.Label>
        <Col sm={8}>
          <Form.Control 
              required
              as="select"
              name="description"
              value={newFavor.description}
              onChange={handleSelectFavor}>
            <option value="">Select a favor</option>
            <option value="Brownie">Brownie</option>
            <option value="Coffee">Coffee</option>
            <option value="Pizza">Pizza</option>
            <option value="Candy">Candy</option>
            <option value="Chocolate Bar">Chocolate Bar</option>
          </Form.Control>
        </Col>
      </Form.Group>
      
      <Form.Group as={Row} controlId="owedBy">
        <Form.Label column sm={2}>This favor is</Form.Label>
        <Col sm={2}>
          <Form.Control 
              required 
              as="select"
              name="owedByMe"
              value={owedByMe}
              onChange={handleOwedByMe}>
            <option value=""></option>
            <option value="owed by">owed by</option>
            <option value="owed to">owed to</option>
          </Form.Control>
        </Col>
        <Form.Label column sm={1}>me by</Form.Label>
        <Col sm={5}>
          <Form.Control type="text" placeholder="Enter your friend's username" />
        </Col>
      </Form.Group>
      
      {
        !owedByMe && 
        <Form.Group>
          <Form.File label="Please upload a photo proof." />
        </Form.Group>
      }
      
      <Button type="submit" className="btn btn-primary">
        Submit
      </Button>
    </Form>
  );
};

export default AddFavor;
