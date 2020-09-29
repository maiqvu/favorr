import React, { useState, useContext } from 'react';
import { useHistory } from 'react-router-dom';
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
  const history = useHistory();
  
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
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    await FavorService.addFavor(newFavor);
    history.push(`/myFavors`);
  };
  
  return (
    <Form onSubmit={handleSubmit}>
      <h3 className="text-left font-weight-bold">Create a new favor</h3>
      <br/>
      
      <Form.Group as={Row}>
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

      <Form.Group as={Row}>
        <Form.Label as="legend" column sm="2">Owed by</Form.Label>
        <Col>
          <Form.Check
            type="radio"
            inline
            label="me"
            checked={owedByMe === true}
            onChange={() => setOwedByMe(true)}
          />
          <Form.Check
            type="radio"
            inline
            label="my friend"
            checked={owedByMe === false}
            onChange={() => setOwedByMe(false)}
          />
        </Col>
      </Form.Group>
      
      <Form.Group as={Row}>
        <Form.Label as="legend" column sm="2">Owed to</Form.Label>
        <Col>
          <Form.Check
            type="radio"
            inline
            label="me"
            checked={owedByMe === false}
            onChange={() => setOwedByMe(false)}
          />
          <Form.Check
            type="radio"
            inline
            label="my friend"
            checked={owedByMe === true}
            onChange={() => setOwedByMe(true)}
          />
        </Col>
      </Form.Group>
      
      <InputGroup as={Row}>
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
      <br/>
      
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
