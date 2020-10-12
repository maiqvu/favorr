import React, { useState, useContext } from 'react';
import { Form, Button, Container } from 'react-bootstrap';
import { AuthContext } from '../../context/AuthContext';
import RequestService from './RequestService';

const CreatePublicRequest = () => {
  const [ task, setTask ] = useState('');
  const [ reward, setReward ] = useState('');
  const [ successText, setSuccessText ] = useState('');

  const authContext = useContext(AuthContext);

  const handleReset = () => {
    setTask('');
    setReward('');
  }

  const handleTaskChange = (event) => {
    setTask(event.target.value);
  }

  const handleRewardChange = (event) => {
    setReward(event.target.value);
  }

  const handleSubmit = async (event) => {
    event.preventDefault();

    const request = await RequestService.createRequest(
      authContext.user.username,
      task,
      reward
    )

    if (request) {
      setSuccessText('Success! Request has been posted.');
      setTask('');
      setReward('');
    } else {
      setSuccessText('Error! Please contact Admin');
    }
  };

  return (
    <Container className="px-lg-5 mt-4">
      <h4 className="text-center mb-4">Create a Public Request</h4>
      <Form onSubmit={handleSubmit}>
        <Form.Group controlId="taskDetail">
          <Form.Label>Task Details*:</Form.Label>
          <Form.Control as="textarea"
            required
            name="task"
            rows="2"
            value={task}
            onChange={handleTaskChange}
            placeholder="Eg: Collect parcels..."
          />
        </Form.Group>
        <Form.Group controlId="selectReward">
          <Form.Label>Reward*:</Form.Label>
          <Form.Control as="select"
            name="reward"
            value={reward}
            onChange={handleRewardChange}            
          >
            <option value="">Select a reward</option>
            <option value="Brownie">Brownie</option>
            <option value="Coffee">Coffee</option>
            <option value="Pizza">Pizza</option>
            <option value="Candy">Candy</option>
            <option value="Chocolate Bar">Chocolate Bar</option>
          </Form.Control>
        </Form.Group>
        <div className="disclaimer">*required</div>
        <Form.Group controlId="buttonGroup">
          <Button
            variant="secondary"
            onClick={handleReset}
          >
            Reset
          </Button>{' '}
          <Button
            variant="primary"
            type="submit"
            disabled={!reward}
          >
            Submit
          </Button>
          {' '}
          {successText}
        </Form.Group>
      </Form>
    </Container>
  );
}

export default CreatePublicRequest;
