import React, { useState, useEffect, useContext } from 'react';
import RequestService from './RequestService';
import Request from './Request';
import { AuthContext } from '../../context/AuthContext';
import Pagination from './Pagination';
import {
  Container,
  Row,
  Col,
  InputGroup,
  FormControl,
  Button,
} from 'react-bootstrap';

const AvailableRequests = () => {
  const [requests, setRequests] = useState([]);
  const [keywordToSearch, setKeywordToSearch] = useState('');
  const [rewardToSearch, setRewardToSearch] = useState('');
  const [filterByKeyword, setFilterByKeyword] = useState(true);

  const [limit, setLimit] = useState(5);
  const [skip, setSkip] = useState(0);
  const [currentPage, setCurrentPage] = useState(1)
  const [requestCount, setRequestCount] = useState(0);

  const authContext = useContext(AuthContext);

  // get available requests
  useEffect(() => {
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

  // get available requests when page changes
  useEffect(() => {
    const getAvailableRequests = async (limit, skip) => {
      const availableRequests = await RequestService.getAvailableRequests(
        limit,
        skip
      );
      setRequests(availableRequests);
      // set current page number after getting next available requests
      setCurrentPage(skip / 5 + 1);
    };
    getAvailableRequests(limit, skip);
  }, [skip, limit, requestCount]);

  const handlePageSelection = (skip) => {
    setSkip(skip)
  }

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

  // for updating the request whenever a reward is added or removed
  const updateRequest = async (updatedRequest, index) => {
    let tmpRequests = [...requests];

    // Delete request if there are no more rewards
    if (!updatedRequest.rewards.length) {
      await RequestService.deleteRequest(updatedRequest._id);
      tmpRequests.splice(index, 1);
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

    // claimRequest method returns updated request if successful and null if unsuccessful
    const updatedRequest = await RequestService.claimRequest(requestId, username);

    // update only if updatedRequest is successful
    if (updatedRequest) {
      updateRequest(updatedRequest, index);
      // return to first page whenever a request is claimed
      setSkip(0);
      // decrease the requests count by one if a request is claimed
      setRequestCount(requestCount - 1);
    }
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
      <Pagination 
        count={requestCount}
        limit={limit}
        skip={skip}
        onPageSelection={handlePageSelection}
        currentPage={currentPage} />
    </Container>
  );
};

export default AvailableRequests;
