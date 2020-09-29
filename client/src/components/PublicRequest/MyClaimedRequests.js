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
    if (authContext.user) {
      axios.get(`/api/publicRequests/claimed/${authContext.user.username}`)
        .then(res => setClaimedRequests(res.data))
        .catch(err => console.error(err));
    }
  }, [authContext.user]);
  
  // This function is a duplicate from AvailablePublicRequest
  const expandRequestToggle = (requestId) => {
    if (focusedRequestId === requestId) {
      setFocusedRequestId(null);
    } else {
      setFocusedRequestId(requestId);
    }
  };

  // This function is a duplicate from AvailablePublicRequest (This is not needed, but I want to reuse updateRequest function later.)
  const deleteRequest = async (request) => {
    try {
      await axios.delete(`/api/publicRequests/${request._id}`);
    } catch (err) {
      console.error(err);
    }
  }

  // This function is a duplicate from AvailablePublicRequest
  const updateRequest = async (updatedRequest, index) => {
    let tmpRequests = [...claimedRequests];

    // Delete request if there are no more rewards
    if (!updatedRequest.rewards.length) {
      deleteRequest(updatedRequest);
      tmpRequests.splice(index, 1);
      setFocusedRequestId('');
    } else {
      let request = { ...tmpRequests[index] };
      request = updatedRequest;
      tmpRequests[index] = request;
    }
    setClaimedRequests(tmpRequests)
  }
  
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
            user={authContext.user}
            focusedRequestId={focusedRequestId}
            updateRequest={updateRequest}
            expandRequestToggle={() => expandRequestToggle(claimedRequest._id, index)} />
        )}
      </Container>
    </div>
  );
};

export default MyClaimedRequests;
