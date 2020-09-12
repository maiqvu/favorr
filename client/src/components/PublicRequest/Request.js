import React, { Component } from 'react';
import axios from 'axios';

import AddReward from './AddReward';
import RemoveReward from './RemoveReward';

import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import Dropdown from 'react-bootstrap/Dropdown';

export default class Request extends Component {
  constructor(props) {
    super(props);

    this.state = {
      newReward: '',
      removeRewardId: '',
    };

    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(event) {
    this.setState({ [event.target.name]: event.target.value });
  }

  async addReward(requestId, index) {
    try {
      let response = await axios.post(
        `/api/publicRequest/${requestId}/add-reward`,
        {
          name: this.props.username,
          item: this.state.newReward,
        }
      );
      this.props.updateRequest(response.data, index);
      this.setState({ newReward: '' });
    } catch (err) {
      console.error(err);
    }
  }

  async removeReward(requestId, index) {
    try {
      let response = await axios.patch(
        `/api/publicRequest/${requestId}/remove-reward`,
        { rewardId: this.state.removeRewardId }
      );
      this.setState({ removeRewardId: '' });
      this.props.updateRequest(response.data, index);
    } catch (err) {
      console.error(err);
    }
  }

  constructFullRewardItemList(rewards) {
    let fullRewardItemList = [];

    for (const reward of rewards) {
      fullRewardItemList.push(reward.item);
    }

    return fullRewardItemList.join(', ');
  }

  constructLimitedRewardItemList(rewards) {
    let displayList;
    let rewardItemList = [];

    for (let reward of rewards) {
      rewardItemList.push(reward.item);
    }

    if (rewardItemList.length > 2) {
      displayList = rewardItemList.slice(0, 2).join(', ') + '...';
    } else {
      displayList = rewardItemList.join(', ');
    }

    return displayList;
  }

  render() {
    return (
      <React.Fragment>
        <Row>
          <Col className="col-sm-5 text-left">
            {this.props.request.requestDetail}
          </Col>
          <Col className="col-sm-3 text-left">
            {new Date(Date.parse(this.props.request.createdAt))
              .toString()
              .slice(0, 15)}
          </Col>
          <Col className="col-sm-3 text-left">
            {this.constructLimitedRewardItemList(this.props.request.reward)}
          </Col>
          <Col className="col-sm-1 text-right">
            <Dropdown>
              <Dropdown.Toggle
                variant="transparant"
                id="dropdown-basic"
                onClick={this.props.expandRequestToggle}
              />
            </Dropdown>
          </Col>
        </Row>
        {this.props.request._id === this.props.focusedRequestId ? (
          <div className="p-3 mb-2 bg-light text-dark">
            <div className="p-2">
              <h5 className="text-left">REQUEST DETAILS:</h5>
              <Row className="mb-4">
                <Col className="col-sm-5">
                  <strong>Creator:&ensp;</strong>
                  <span>{this.props.request.creator}</span>
                </Col>
                <Col className="col-sm-7">
                  <strong>Task:&ensp;</strong>
                  <span>{this.props.request.requestDetail}</span>
                </Col>
              </Row>
              <Row className="mb-4">
                <Col className="col-sm-5">
                  <strong>Time Submitted:&ensp;</strong>
                  <span>
                    {new Date(
                      Date.parse(this.props.request.createdAt)
                    ).toString()}
                  </span>
                </Col>
                <Col className="col-sm-7">
                  <strong>Rewards:&ensp;</strong>
                  <span>
                    {this.constructFullRewardItemList(
                      this.props.request.reward
                    )}
                  </span>
                </Col>
              </Row>
              <Row>
                <Col className="col-sm-5">
                  <AddReward
                    newReward={this.state.newReward}
                    onChange={this.handleChange}
                    addReward={() =>
                      this.addReward(this.props.request._id, this.props.index)
                    }
                  />
                </Col>
                <Col className="col-sm-5">
                  <RemoveReward
                    request={this.props.request}
                    focusedRequestId={this.props.focusedRequestId}
                    username={this.props.username}
                    removeRewardId={this.state.removeRewardId}
                    onChange={this.handleChange}
                    removeReward={() =>
                      this.removeReward(
                        this.props.request._id,
                        this.props.index
                      )
                    }
                  />
                </Col>
              </Row>
            </div>
            <div className="text-right">
              {this.props.username ? (
                <Button
                  variant="primary"
                  onClick={() =>
                    this.props.claim(this.props.request._id, this.props.index)
                  }
                >
                  Claim
                </Button>
              ) : null}
            </div>
          </div>
        ) : null}
        <hr />
      </React.Fragment>
    );
  }
}
