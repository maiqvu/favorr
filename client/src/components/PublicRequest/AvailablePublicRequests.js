import React, { Component } from 'react';
import axios from 'axios';

import Request from './Request';

import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

export default class PublicRequestsPage extends Component {
  constructor(props) {
    super(props);

    this.username = 'alex';
    this.state = {
      requests: [],
      focusedRequestId: '',
    };

    this.updateRequest = this.updateRequest.bind(this);
  }

  async componentDidMount() {
    try {
      let response = await axios.get('/api/publicRequest/available');
      this.setState({ requests: response.data });
    } catch (err) {
      console.error(err);
    }
  }

  async deleteRequest(request) {
    try {
      await axios.delete(`/api/publicRequest/${request._id}`);
    } catch (err) {
      console.error(err);
    }
  }

  updateRequest(updatedRequest, index) {
    let requests = [...this.state.requests];

    // Delete request if there are no more rewards
    if (!updatedRequest.reward.length) {
      this.deleteRequest(updatedRequest);
      requests.splice(index, 1);
      this.setState({ focusedRequestId: '' });
    } else {
      let request = { ...requests[index] };
      request = updatedRequest;
      requests[index] = request;
    }

    this.setState({ requests });
  }

  expandRequestToggle(requestId) {
    if (this.state.focusedRequestId === requestId) {
      this.setState({ focusedRequestId: null });
    } else {
      this.setState({ focusedRequestId: requestId });
    }
  }

  async claim(requestId, index) {
    try {
      let response = await axios.patch(
        `/api/publicRequest/${requestId}/claim/${this.username}`
      );
      this.updateRequest(response.data, index);
    } catch (err) {
      console.error(err);
    }
  }

  render() {
    return (
      <div>
        <h3 className="text-center">Available Public Requests</h3>
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
          {this.state.requests.map((request, index) =>
            !request.taker ? (
              <Request
                request={request}
                index={index}
                username={this.username}
                focusedRequestId={this.state.focusedRequestId}
                updateRequest={this.updateRequest}
                expandRequestToggle={() =>
                  this.expandRequestToggle(request._id, index)
                }
                claim={this.claim}
              />
            ) : null
          )}
        </Container>
      </div>
    );
  }
}
