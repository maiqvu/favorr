import React, { Component } from 'react';
import axios from 'axios';

import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';

export default class PublicRequestPage extends Component {
  constructor(props) {
    super(props);

    this.username = 'Alex';
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
      let response = await axios.post(
        `/api/publicRequest/${requestId}/add-reward`,
        {
          name: 'Alex',
          item: this.state.newReward,
        }
      );
      for (let request of response.data) {
        request['expanded'] = false;
      }
      this.setState({ requestList: response.data });
    } catch (err) {
      console.error(err);
    }
  }

  constructFullRewardItemList(rewards) {
    let rewardItemList = [];
    rewards.map((reward) => {
      rewardItemList.push(reward.item);
    });
    return rewardItemList.toString().replace(/,/g, ', ');
  }

  constructLimitedRewardItemList(rewards) {
    let displayList;
    let rewardItemList = [];
    rewards.map((reward) => {
      rewardItemList.push(reward.item);
    });

    if (rewardItemList.length > 2) {
      displayList =
        rewardItemList.slice(0, 2).toString().replace(/,/g, ', ') + '...';
    } else {
      displayList = rewardItemList.toString();
    }

    return displayList;
  }

  expandRequestToggle(requestId) {
    let newRequestList = this.state.requestList;

    newRequestList.forEach((part, index) => {
      if (part._id === requestId) {
        part.expanded = !part.expanded;
      } else {
        part.expanded = false;
      }
    }, newRequestList);

    this.setState({ newReward: '' });
    this.setState({ requestList: newRequestList });
  }

  async claim(requestId, requestIndex) {
    try {
      let response = await axios.patch(
        `/api/publicRequest/${requestId}/claim/${this.username}`
      );

      let modifiedRequestList = [...this.state.requestList];
      let modifiedRequest = { ...modifiedRequestList[requestIndex] };
      modifiedRequest = response.data;
      modifiedRequest['expanded'] = true; //expanded should really be a field in the db
      modifiedRequestList[requestIndex] = modifiedRequest;
      this.setState({ requestList: modifiedRequestList });
      console.log(this.state.requestList);
    } catch (err) {
      console.error(err);
    }
  }

  render() {
    return (
      <div>
        <h3>All Requests</h3>
        <Container className="px-lg-5">
          <Row>
            <Col className="col-sm-5 text-left font-weight-bold">Task</Col>
            <Col className="col-sm-3 text-left font-weight-bold">
              Date Submitted
            </Col>
            <Col className="col-sm-3 text-left font-weight-bold">Rewards</Col>
            <Col className="col-sm-1 text-right"></Col>
          </Row>
          <hr className="border border-light" />
          {this.state.requestList.map((request, index) => (
            <React.Fragment>
              <Row>
                <Col className="col-sm-5 text-left">
                  {request.requestDetail}
                </Col>
                <Col className="col-sm-3 text-left">30/08/2020</Col>
                <Col className="col-sm-3 text-left">
                  {this.constructLimitedRewardItemList(request.reward)}
                </Col>
                <Col className="col-sm-1 text-right">
                  <button
                    onClick={() => this.expandRequestToggle(request._id)}
                    type="button"
                    class="btn dropdown-toggle"
                    data-toggle="dropdown"
                  >
                    <span class="caret"></span>
                  </button>
                </Col>
              </Row>
              {request.expanded ? (
                <div className="p-3 mb-2 bg-light text-dark">
                  <h5 className="p-2 col-example text-left">
                    REQUEST DETAILS:
                  </h5>
                  <div className="d-flex justify-content-between">
                    <div>
                      <div className="p-2 col-example text-left">
                        <strong>Creator:&ensp;</strong>
                        <span>{request.creator}</span>
                      </div>
                      <div className="p-2 col-example text-left">
                        <strong>Task:&ensp;</strong>
                        <span>{request.requestDetail}</span>
                      </div>
                      <div className="p-2 col-example text-left">
                        <strong>Add Reward:&ensp;</strong>
                        <form
                          class="form-inline"
                          className="text-left"
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
                          &ensp;
                          <button class="btn btn-outline-primary" type="submit">
                            Add
                          </button>
                        </form>
                      </div>
                    </div>
                    <div>
                      <div className="p-2 col-example text-left">
                        <strong>Date Submitted:&ensp;</strong>
                        <span>30/08/2020</span>
                      </div>
                      <div className="p-2 col-example text-left">
                        <strong>Rewards:&ensp;</strong>
                        <span>
                          {this.constructFullRewardItemList(request.reward)}
                        </span>
                      </div>
                      <div className="p-2 col-example text-left">
                        {request.taker ? (
                          <div>
                            <strong>Claimed By:&ensp;</strong>
                            <span>{request.taker}</span>
                          </div>
                        ) : (
                          <Button
                            onClick={() => this.claim(request._id, index)}
                          >
                            Claim
                          </Button>
                        )}
                      </div>
                    </div>
                    <div></div>
                  </div>
                </div>
              ) : null}
              <hr />
            </React.Fragment>
          ))}
        </Container>
      </div>
    );
  }
}
