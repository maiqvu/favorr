import React, { Component } from 'react';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Select from 'react-select';
import axios from 'axios';

const rewardOptions = [
  { value: 'Chocolate', label: 'Chocolate' },
  { value: 'Strawberry', label: 'Strawberry' },
  { value: 'Coke', label: 'Coke' },
  { value: 'Breakfast', label: 'Breakfast' },
  { value: 'Coffee', label: 'Coffee' },
  { value: 'Candy', label: 'Candy' }
]

export default class CreatePublicRequestPage extends Component {
  constructor(props) {
    super();

    this.user = 'alex';
    this.state = {
      task: '',
      reward: '',
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange = event => {
    
  };
  handleSubmit = event => {
    event.preventDefault();
    const data = {
      name: this.user,
      requestDetail: this.state.task,
      reward: this.state.reward,
    }
    axios
      .post('/api/publicRequest/publicRequest', data)
      .then(res => console.log(res));
  };

  render() {
    return (
      <Form onSubmit={this.handleSubmit}>
        <h3>Create a Public Request</h3>
        <Form.Group controlId="taskDetail">
          <Form.Label>Task Details:</Form.Label>
          <Form.Control
            required
            as="textarea"
            rows="2"
            value={this.state.task}
            onChange={this.handleChange}
          />
        </Form.Group>
        <Form.Group controlId="dropdownReward">
          <Form.Label>Reward(s):</Form.Label>
          <Select
            isSearchable
            isMulti
            options={rewardOptions}
            value={this.props.value}
            onChange={this.handleChange}
          />
        </Form.Group>
        <Button variant="primary" type="submit">
          Submit
          </Button>
      </Form>
    );
  }
}
