import React, { Component } from 'react';
import axios from 'axios';

import Request from './Request';

import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

export default class MyClaimedRequests extends Component { 
    constructor(props) {
        super(props);

        this.username = 'john';
        this.state = {
            claimedRequests: [],
            focusedRequestId: ''
        }
    }

    async componentDidMount() {
        try {
            let response = await axios.get(`/api/publicRequests/claimed/${this.username}`);
            this.setState({ claimedRequests: response.data });
        } catch (err) {
            console.error(err);
        }
    }

    // This function is a duplicate from AvailablePublicRequest
    expandRequestToggle(requestId) {
        if (this.state.focusedRequestId === requestId) {
          this.setState({ focusedRequestId: null });
        } else {
          this.setState({ focusedRequestId: requestId });
        }
    }

    render() {
        return (
            <div>
                <h3 className="text-center">My Claimed Requests</h3>
                <Container className="px-lg-5">
                    <Row>
                        <Col className="col-sm-5 text-left font-weight-bold">
                            Task
                        </Col>
                        <Col className="col-sm-3 text-left font-weight-bold">
                            Date Claimed
                        </Col>
                        <Col className="col-sm-3 text-left font-weight-bold">
                            Rewards
                        </Col>
                        <Col className="col-sm-1 text-right"></Col>
                    </Row>
                    <hr className="border border-light" />
                    {this.state.claimedRequests.map((claimedRequest, index) =>
                        <Request
                            request={claimedRequest}
                            date={claimedRequest.claimedByTime}
                            index={index}
                            username={this.username}
                            focusedRequestId={this.state.focusedRequestId}
                            updateRequest={this.updateRequest}
                            expandRequestToggle={() =>
                                this.expandRequestToggle(claimedRequest._id, index)
                            }
                        />
                    )}
                </Container>
            </div>
        )
    }
}