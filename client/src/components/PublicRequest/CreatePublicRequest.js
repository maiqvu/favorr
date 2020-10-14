import React, { useState, useContext } from 'react';
import { Form, Button, Container, Row, Col } from 'react-bootstrap';
import { AuthContext } from '../../context/AuthContext';
import RequestService from './RequestService';

const CreatePublicRequest = () => {
  const [task, setTask] = useState('');
  const [reward, setReward] = useState('');
  const [successText, setSuccessText] = useState('');

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
    };
    //Clear message after 3000ms
    // setTimeout(() => {
    //   setSuccessText('');
    // }, 3000);
  };

  return (
    <Container className="px-lg-5 mt-4">
      <h4 className="text-center font-weight-bold">Create a Public Request</h4>
      <div className="text-center font-weight-lighter ">Looking for someone to do your task? Your friend can earn rewards after the task has been completed.</div>
      <br />
      <Form onSubmit={handleSubmit}>
        <Form.Group controlId="taskDetail" as={Row}>
          <Form.Label column sm="2">Task Details*:</Form.Label>
          <Col>
            <Form.Control as="textarea"
              required
              name="task"
              rows="2"
              value={task}
              onChange={handleTaskChange}
              placeholder="Eg: Collect parcels..."
            />
          </Col>
        </Form.Group>
        <Form.Group controlId="selectReward" as={Row}>
          <Form.Label column md="2">Reward*:</Form.Label>
          <Col>
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
          </Col>
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
