import React, { Component } from 'react';
import axios from 'axios';

import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

export default class PublicRequestPage extends Component {
  constructor(props) {
    super(props);

    this.state = {
      requestList: [],
      newReward: '',
    };
  }

  componentDidMount() {
    axios
      .get('/api/publicRequest/publicRequest')
      .then((response) => {
        for (let request of response.data) {
          request['expanded'] = false;
        }
        this.setState({ requestList: response.data });
      })
      .catch((err) => console.error(err));
  }

  async addReward(requestId) {
    try {
      await axios.post(`/api/publicRequest/${requestId}/add-reward`, {
        name: 'Alex',
        item: this.state.newReward,
      });
      this.componentDidMount();
    } catch (err) {
      console.error(err);
    }
  }

  constructRewardItemList(rewards) {
    let rewardItemList = [];
    rewards.map((reward) => {
      rewardItemList.push(reward.item);
    });
    return rewardItemList.toString();
  }

  expandRequestToggle(requestId) {
    let newRequestList = this.state.requestList;

    newRequestList.forEach((part, index) => {
      if (part._id === requestId) {
        part.expanded = !part.expanded;
      }
    }, newRequestList);

    this.setState({ requestList: newRequestList });
  }

  rowStyleFormat(row, rowIdx) {
    return { backgroundColor: rowIdx % 2 === 0 ? 'red' : 'blue' };
  }

  render() {
    return (
      <div>
        <h3>All Requests</h3>
        <Container>
          <Row>
            <Col className="col-sm-1">Creator</Col>
            <Col className="col-sm-1">Date Submitted</Col>
            <Col className="col-sm-4">Task</Col>
            <Col className="col-sm-3">Rewards</Col>
            <Col className="col-sm-3"></Col>
          </Row>
          {this.state.requestList.map((request) => (
            <React.Fragment>
              <Row Style={this.rowStyleFormat}>
                <Col className="col-sm-1">{request.creator}</Col>
                <Col className="col-sm-1">30/08/2020</Col>
                <Col className="col-sm-4">{request.requestDetail}</Col>
                <Col className="col-sm-3">
                  {this.constructRewardItemList(request.reward)}
                </Col>
                <Col className="col-sm-3">
                  <div className="text-right">
                    <Button variant="outline-success">Claim</Button>
                    <Button
                      variant="outline-primary"
                      onClick={() => this.expandRequestToggle(request._id)}
                    >
                      Add Reward
                    </Button>
                  </div>
                </Col>
              </Row>
              {request.expanded ? (
                <Row>
                  <Col className="col-sm-1"></Col>
                  <Col className="col-sm-1"></Col>
                  <Col className="col-sm-4"></Col>
                  <Col className="col-sm-3"></Col>
                  <Col className="col-sm-3">
                    <form
                      class="form-inline"
                      className="text-right"
                      onSubmit={() => this.addReward(request._id)}
                    >
                      <input
                        class="form-control"
                        className="input-small"
                        type="text"
                        value={this.state.newReward}
                        onChange={(event) => {
                          this.setState({ newReward: event.target.value });
                        }}
                      />
                      <Button type="submit" class="btn">
                        Add
                      </Button>
                    </form>
                  </Col>
                </Row>
              ) : null}
            </React.Fragment>
          ))}
        </Container>
      </div>
    );
  }
}
