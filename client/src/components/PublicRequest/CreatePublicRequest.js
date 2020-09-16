import React, { Component } from 'react';
import { Form, Button } from 'react-bootstrap';

import axios from 'axios';
export default class CreatePublicRequestPage extends Component {
  constructor(props) {
    super(props);

    this.state = {
      creator: 'alex',
      requestDetail: '',
      reward: '',
      //to be used in future validation
      formIsValid: true
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange = event => {
    this.setState({
      [event.target.name]: event.target.value
    });
  };

  handleSubmit = async event => {
    const { creator, requestDetail, reward } = this.state;
    event.preventDefault();

    await axios
      .post(`/api/publicRequest/publicRequest`,
        {
          creator: creator,
          taker: "",
          requestDetail: requestDetail,
          reward: [{ name: creator, item: reward }],
        })
      .then(alert("Your Public Request has been succesfully created!"))
      .catch(err => console.log(err));
  };

  render() {
    return (
      <Form onSubmit={this.handleSubmit}>
        <h3>Create a Public Request</h3>
        <Form.Group controlId="taskDetail">
          <Form.Label>Task Details:</Form.Label>
          <Form.Control as="textarea"
            required
            name="requestDetail"
            rows="2"
            value={this.state.requestDetail}
            onChange={this.handleChange}
          />
        </Form.Group>
        <Form.Group controlId="selectReward">
          <Form.Label>Reward:</Form.Label>
          <Form.Control as="select"
            name="reward"
            value={this.state.reward}
            onChange={this.handleChange}
            custom='true'
          >
            <option value="">Add a reward</option>
            <option value="Chocolate Bar">Chocolate Bar</option>
            <option value="Orange Juice">Orange Juice</option>
            <option value="Chips">Chips</option>
            <option value="Candy">Candy</option>
            <option value="Breakfast">Breakfast</option>
          </Form.Control>
        </Form.Group>
        <Button
          variant="primary"
          type="submit"
          disabled={this.state.reward === "" && this.state.formIsValid}
        >
          Submit
          </Button>
      </Form>
    );
  }
}