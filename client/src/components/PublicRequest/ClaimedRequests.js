import React, { useState, useEffect, useContext } from 'react';
import RequestService from './RequestService';
import Request from './Request';
import { AuthContext } from '../../context/AuthContext';

import { Container, Row, Col } from 'react-bootstrap';

const ClaimedRequests = (props) => {
  const [claimedRequests, setClaimedRequests] = useState([]);

  const authContext = useContext(AuthContext);

  // get all claimed requests of the user
  useEffect(() => {
    if (authContext.user) {
      getClaimedRequests(authContext.user.username);
    }
  }, [authContext.user]);

  // get the user's claimed requests
  const getClaimedRequests = async (username) => {
    const requests = await RequestService.getClaimedRequests(username);
    setClaimedRequests(requests);
  };

  // update the request when it is resolved by the user
  const updateRequest = (updatedRequest, index) => {
    let tmpRequests = [...claimedRequests];

    let request = { ...tmpRequests[index] };
    request = updatedRequest;
    tmpRequests[index] = request;
    setClaimedRequests(tmpRequests);
  };

  // displays user's claimed requests
  return (
    <Container className="px-lg-5 mt-4">
      <h4 className="text-center mb-4">My Claimed Requests</h4>
      <Row>
        <Col className="col-sm-5 text-left font-weight-bold">Task</Col>
        <Col className="col-sm-3 text-left font-weight-bold">Date Claimed</Col>
        <Col className="col-sm-3 text-left font-weight-bold">Rewards</Col>
      </Row>
      <hr className="border border-light" />
      {claimedRequests.length ? (
        claimedRequests.map((claimedRequest, index) => (
          <Request
            key={index}
            request={claimedRequest}
            date={claimedRequest.claimedByTime}
            user={authContext.user}
            updateRequest={updateRequest}
          />
        ))
      ) : null}
    </Container>
  );
};

export default ClaimedRequests;
