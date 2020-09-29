import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';

import Request from './Request';
import { AuthContext } from '../../context/AuthContext';

import {
  Container,
  Row,
  Col,
  InputGroup,
  FormControl,
  Button,
} from 'react-bootstrap';

const AvailablePublicRequests = (props) => {
  const [requests, setRequests] = useState([]);
  const [focusedRequestId, setFocusedRequestId] = useState('');
  const [keywordToSearch, setKeywordToSearch] = useState('');
  const [rewardToSearch, setRewardToSearch] = useState('');
  const [filterByKeyword, setFilterByKeyword] = useState(true);

  const [limit, setLimit] = useState(5);
  const [skip, setSkip] = useState(0);
  const [requestCount, setRequestCount] = useState(0);

  const authContext = useContext(AuthContext);

  useEffect(() => {
    axios
      .get(`/api/publicRequests/available?limit=${limit}&skip=${skip}`)
      .then((res) => setRequests(res.data))
      .catch((err) => console.error(err));
    
    axios
      .get(`/api/publicRequests/available/count`)
      .then((res) => setRequestCount(res.data.count))
      .catch((err) => console.error(err));
  }, [authContext.user]);

  useEffect(() => {
    axios
      .get(`/api/publicRequests/available?limit=${limit}&skip=${skip}`)
      .then((res) => setRequests(res.data))
      .catch((err) => console.error(err));
  }, [skip, limit])

  const nextPage = () => {
    const newSkip = skip + limit;
    if (newSkip < requestCount)
      setSkip(skip + limit)
  }

  const previousPage = () => {
      const newSkip = skip - limit;
      if (newSkip >= 0)
        setSkip(newSkip)
  }

  const deleteRequest = async (request) => {
    try {
      await axios.delete(`/api/publicRequests/${request._id}`);
    } catch (err) {
      console.error(err);
    }
  };

  const handleKeywordToSearchInput = (e) => {
    setKeywordToSearch(e.target.value);
  };

  const handleSelectFilterByKeyword = (flag) => {
    setKeywordToSearch('');
    setRewardToSearch('');
    setFilterByKeyword(flag);
  };

  const handleRewardToSearchInput = (e) => {
    setRewardToSearch(e.target.value);
  };

  // This function is a duplicate from MyClaimedRequests
  const updateRequest = async (updatedRequest, index) => {
    let tmpRequests = [...requests];

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
    setRequests(tmpRequests);
  };

  // This function is a duplicate from MyClaimedRequests
  const expandRequestToggle = (requestId) => {
    if (focusedRequestId === requestId) {
      setFocusedRequestId('');
    } else {
      setFocusedRequestId(requestId);
    }
  };

  const claim = async (requestId, index) => {
    try {
      let response = await axios.patch(
        `/api/publicRequests/${requestId}/claim/${authContext.user.username}`
      );
      updateRequest(response.data, index);
    } catch (err) {
      console.error(err);
    }
  };

  const requestRewardItems = (rewards) => {
    let itemList = [];

    for (let reward of rewards) {
      itemList.push(reward.item);
    }
    return itemList;
  };

  return (
    <Container className="px-lg-5 mt-4">
      <h4 className="text-center mb-4">Available Public Requests</h4>
      <InputGroup className="mb-3">
        <InputGroup.Prepend>
          <InputGroup.Text id="inputGroup-sizing-default">
            Filter by
          </InputGroup.Text>
          <div className="btn-group btn-group-toggle" data-toggle="buttons">
            <Button
              variant="outline-secondary"
              className="active"
              onClick={() => handleSelectFilterByKeyword(true)}
            >
              <input type="radio" name="options" id="option1" defaultChecked />
              Keyword
            </Button>
            <Button
              variant="outline-secondary"
              onClick={() => handleSelectFilterByKeyword(false)}
            >
              <input type="radio" name="options" id="option2" />
              Reward
            </Button>
          </div>
        </InputGroup.Prepend>
        {filterByKeyword ? (
          <FormControl
            id="searchByKeyword"
            aria-label="Default"
            aria-describedby="inputGroup-sizing-default"
            placeholder="Type here to filter by keyword"
            onChange={handleKeywordToSearchInput}
          />
        ) : (
          <select
            className="custom-select"
            id="searchByReward"
            onChange={handleRewardToSearchInput}
          >
            <option value="">Select to filter a reward</option>
            <option value="Brownie">Brownie</option>
            <option value="Coffee">Coffee</option>
            <option value="Pizza">Pizza</option>
            <option value="Candy">Candy</option>
            <option value="Chocolate Bar">Chocolate Bar</option>
          </select>
        )}
      </InputGroup>
      <Row>
        <Col className="col-sm-5 text-left font-weight-bold">Task</Col>
        <Col className="col-sm-3 text-left font-weight-bold">
          Date Submitted
        </Col>
        <Col className="col-sm-3 text-left font-weight-bold">Rewards</Col>
        <Col className="col-sm-1 text-right"></Col>
      </Row>
      <hr className="border border-light" />
      {requests.map((request, index) =>
        !request.claimedBy ? (
          (request.task.toLowerCase().includes(keywordToSearch.toLowerCase()) &&
            filterByKeyword) ||
          (requestRewardItems(request.rewards).includes(rewardToSearch) &&
            !filterByKeyword) ||
          (keywordToSearch === '' && rewardToSearch === '') ? (
            <Request
              key={index}
              request={request}
              date={request.createdAt}
              index={index}
              user={authContext.user}
              focusedRequestId={focusedRequestId}
              updateRequest={updateRequest}
              expandRequestToggle={() =>
                expandRequestToggle(request._id, index)
              }
              claim={claim}
            />
          ) : null
        ) : null
      )}
      <div className="float-right"> 
          <Button variant="outline-primary" onClick={previousPage}>&laquo;</Button>
          &nbsp;
          <Button variant="outline-primary" onClick={nextPage}>&raquo;</Button> 
      </div>
    </Container>
  );
};

export default AvailablePublicRequests;
