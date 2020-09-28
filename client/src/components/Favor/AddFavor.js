import React, { useState, useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import FavorService from './FavorService';
import { Form, Row, Col, Button, InputGroup } from 'react-bootstrap';

const AddFavor = () => {
  const [ newFavor, setNewFavor ] = useState({
    description: '',
    owedBy: '',
    owedTo: ''
  });
  const [ owedByMe, setOwedByMe ] = useState(null);
  const [ myFriend, setMyFriend ] = useState('');
  const authContext = useContext(AuthContext);
  
  const handleChange = (e) => {
    setNewFavor({ ...newFavor, [e.target.name]: e.target.value });
  };
  
  const updateMyFriend = () => {
    if (owedByMe) {
      setNewFavor({
        ...newFavor,
        owedBy: authContext.user.username,
        owedTo: myFriend
      });
    } else {
      setNewFavor({
        ...newFavor,
        owedBy: myFriend,
        owedTo: authContext.user.username
      });
    }
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    FavorService.addFavor(newFavor);
  };
  
  return (
    <Form onSubmit={handleSubmit}>
      <h3 className="text-left">Add a new favor</h3>
      
      <Form.Group as={Row} controlId="selectFavor">
        <Form.Label column sm={2}>Description</Form.Label>
        <Col sm={8}>
          <Form.Control 
            required
            as="select"
            name="description"
            value={newFavor.description}
            onChange={handleChange}
          >
            <option value="">Select a favor</option>
            <option value="Brownie">Brownie</option>
            <option value="Coffee">Coffee</option>
            <option value="Pizza">Pizza</option>
            <option value="Candy">Candy</option>
            <option value="Chocolate Bar">Chocolate Bar</option>
          </Form.Control>
        </Col>
      </Form.Group>
      
      <Form.Label>Owed to</Form.Label>
      <Form.Group controlId="selectOwedTo">
        <div>
          <Form.Label>
            <Form.Check
              type="radio"
              inline
              checked={owedByMe === false}
              onChange={() => setOwedByMe(false)}
            />
            me
          </Form.Label>
        </div>
        <div>
          <Form.Label>
            <Form.Check
              type="radio"
              inline
              checked={owedByMe === true}
              onChange={() => setOwedByMe(true)}
            />
            my friend
          </Form.Label>
        </div>
      </Form.Group>
      
      <Form.Label>Owed by</Form.Label>
      <Form.Group controlId="selectOwedBy">
        <div>
          <Form.Label>
            <Form.Check
              type="radio"
              inline
              checked={owedByMe === true}
              onChange={() => setOwedByMe(true)}
            />
            me
          </Form.Label>
        </div>
        <div>
          <Form.Label>
            <Form.Check
              type="radio"
              inline
              checked={owedByMe === false}
              onChange={() => setOwedByMe(false)}
            />
            my friend
          </Form.Label>
        </div>
      </Form.Group>
      
      <InputGroup as={Row} controlId="setMyFriend">
        <Form.Label column sm={2}>My friend: </Form.Label>
        <Col sm={8}>
          <Form.Control
            required
            placeholder="Enter your friend's username"
            name="myFriend"
            value={myFriend}
            onChange={e => setMyFriend(e.target.value)}
          />
        </Col>
        <InputGroup.Append>
          <Button onClick={updateMyFriend} variant="outline-primary">
            Enter
          </Button>
        </InputGroup.Append>
      </InputGroup>
      
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
