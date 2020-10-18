import React, { useState, useContext } from 'react';
import { useHistory } from 'react-router-dom';
import { Form, Button, Container, Row, Col } from 'react-bootstrap';
import { AuthContext } from '../../context/AuthContext';
import RequestService from './RequestService';

const CreatePublicRequest = () => {
  const [task, setTask] = useState('');
  const [reward, setReward] = useState('');
  const [successText, setSuccessText] = useState('');
  const [showRequestsLink, setShowRequestsLink] = useState(false);

  const maxWordLength = 30;
  const authContext = useContext(AuthContext);
  const history = useHistory();

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
    setShowRequestsLink(false);

    //Compare word length vs maxWordLength
    let taskDetail = task.split(" ");
    let wordValidation = true;

    for (let i = 0; i < taskDetail.length; i++) {
      if (taskDetail[i].length > maxWordLength) { wordValidation = false; }
    }
    if (!wordValidation) {
      setSuccessText('Error! Invalid task details, a word max length cannot exceed ' + maxWordLength + ' characters');
    } else {
      //create Request if validated
      const request = await RequestService.createRequest(
        authContext.user.username,
        task,
        reward
      )
      if (request) {
        setSuccessText('Success! Request has been posted.');
        setShowRequestsLink(true);
        setTask('');
        setReward('');
      } else {
        setSuccessText('Error! Please try again or contact Admin');
      }
    }


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
          <span className="align-middle">{successText}</span>
          {showRequestsLink ? (
            <Button
              variant="link"
              className="align-center"
              onClick={() => history.push(`/`)}
            >
              View updated requests list
            </Button>
          ) : null}
        </Form.Group>
      </Form>
    </Container>
  );
}

export default CreatePublicRequest;
