import React, { useState, useEffect, useContext } from 'react';
import RequestService from './RequestService';
import Request from './Request';
import { AuthContext } from '../../context/AuthContext';

import { Container, Row, Col } from 'react-bootstrap';

const ClaimedRequests = (props) => {
  const [claimedRequests, setClaimedRequests] = useState([]);
  const [focusedRequestId, setFocusedRequestId] = useState('');

  const authContext = useContext(AuthContext);

  useEffect(() => {
    const getClaimedRequests = async (username) => {
      const requests = await RequestService.getClaimedRequests(username);
      setClaimedRequests(requests);
    };

    if (authContext.user) {
      getClaimedRequests(authContext.user.username);
    }
  }, [authContext.user]);

  const expandRequestToggle = (requestId) => {
    if (focusedRequestId === requestId) {
      setFocusedRequestId(null);
    } else {
      setFocusedRequestId(requestId);
    }
  };

  const updateRequest = (updatedRequest, index) => {
    let tmpRequests = [...claimedRequests];

    let request = { ...tmpRequests[index] };
    request = updatedRequest;
    tmpRequests[index] = request;

    setClaimedRequests(tmpRequests);
  };

  return (
    <Container className="px-lg-5 mt-4">
      <h4 className="text-center mb-4">My Claimed Requests</h4>
      <Row>
        <Col className="col-sm-5 text-left font-weight-bold">Task</Col>
        <Col className="col-sm-3 text-left font-weight-bold">Date Claimed</Col>
        <Col className="col-sm-3 text-left font-weight-bold">Rewards</Col>
      </Row>
      <hr className="border border-light" />

      {claimedRequests.map((claimedRequest, index) => (
        <Request
          key={index}
          request={claimedRequest}
          date={claimedRequest.claimedByTime}
          user={authContext.user}
          focusedRequestId={focusedRequestId}
          updateRequest={updateRequest}
          expandRequestToggle={() =>
            expandRequestToggle(claimedRequest._id, index)
          }
        />
      ))}
    </Container>
  );
};

export default ClaimedRequests;
