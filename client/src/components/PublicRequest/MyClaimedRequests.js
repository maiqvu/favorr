import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import Request from './Request';
import { AuthContext } from '../../context/AuthContext';

import { Container, Row, Col } from 'react-bootstrap';

const MyClaimedRequests = (props) => {
  const [ claimedRequests, setClaimedRequests ] = useState([]);
  const [ focusedRequestId, setFocusedRequestId ] = useState('');
  
  const authContext = useContext(AuthContext);
  
  useEffect(() => {
    axios.get(`/api/publicRequests/claimed/john`)
    // axios.get(`/api/publicRequests/claimed/${authContext.user._id}`)
      .then(res => setClaimedRequests(res.data))
      .catch(err => console.error(err));
  }, [authContext.user._id]);
  
  // This function is a duplicate from AvailablePublicRequest
  const expandRequestToggle = (requestId) => {
    if (focusedRequestId === requestId) {
      setFocusedRequestId(null);
    } else {
      setFocusedRequestId(requestId);
    }
  };
  
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
        </Row>
        <hr className="border border-light" />
        
        {claimedRequests.map((claimedRequest, index) =>
          <Request
            key={index}
            request={claimedRequest}
            date={claimedRequest.claimedByTime}
            username={authContext.user.username}
            focusedRequestId={focusedRequestId}
            // updateRequest={updateRequest}
            expandRequestToggle={() => expandRequestToggle(claimedRequest._id, index)} />
        )}
      </Container>
    </div>
  );
};

export default MyClaimedRequests;
