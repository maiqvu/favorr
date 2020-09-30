import React, { useState, useEffect, useContext } from 'react';
import RequestService from './RequestService';
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

const AvailableRequests = (props) => {
  const [requests, setRequests] = useState([]);
  const [keywordToSearch, setKeywordToSearch] = useState('');
  const [rewardToSearch, setRewardToSearch] = useState('');
  const [filterByKeyword, setFilterByKeyword] = useState(true);

  const [limit, setLimit] = useState(5);
  const [skip, setSkip] = useState(0);
  const [requestCount, setRequestCount] = useState(0);

  const authContext = useContext(AuthContext);

  useEffect(() => {
    // get all available requests
    const getAvailableRequests = async (limit, skip) => {
      const availableRequests = await RequestService.getAvailableRequests(
        limit,
        skip
      );
      setRequests(availableRequests);
    };

    // get total count of all available requests
    const getAvailableRequestCount = async () => {
      const count = await RequestService.getAvailableRequestCount();
      setRequestCount(count);
    };
    getAvailableRequests(limit, skip);
    getAvailableRequestCount();
  }, [authContext.user]);

  useEffect(() => {
    // get available requests when page changes
    const getAvailableRequests = async (limit, skip) => {
      const availableRequests = await RequestService.getAvailableRequests(
        limit,
        skip
      );
      setRequests(availableRequests);
    };
    getAvailableRequests(limit, skip);
  }, [skip, limit]);

  const nextPage = () => {
    const newSkip = skip + limit;
    if (newSkip < requestCount) setSkip(skip + limit);
  };

  const previousPage = () => {
    const newSkip = skip - limit;
    if (newSkip >= 0) setSkip(newSkip);
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

  const updateRequest = async (updatedRequest, index) => {
    let tmpRequests = [...requests];

    // Delete request if there are no more rewards
    if (!updatedRequest.rewards.length) {
      await RequestService.deleteRequest(updatedRequest._id);
      tmpRequests.splice(index, 1);
      // setFocusedRequestId('');
    } else {
      let request = { ...tmpRequests[index] };
      request = updatedRequest;
      tmpRequests[index] = request;
    }
    setRequests(tmpRequests);
  };

  // assign the user to the request and move the request to claimed request page
  const claim = async (requestId, index) => {
    const username = authContext.user.username;

    const updatedRequest = await RequestService.claimRequest(requestId, username);
    updateRequest(updatedRequest, index);
  };

  // get all rewards from the request into an a list to use filter feature
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
              updateRequest={updateRequest}
              claim={claim}
            />
          ) : null
        ) : null
      )}
      {requestCount > limit ? (
        <div className="float-right">
          <Button variant="outline-primary" onClick={previousPage}>
            &laquo;
          </Button>
          &nbsp;
          <Button variant="outline-primary" onClick={nextPage}>
            &raquo;
          </Button>
        </div>
      ) : null}
    </Container>
  );
};

export default AvailableRequests;
