import React, { useState, useEffect, useContext, useRef } from 'react';
import RequestService from './RequestService';
import Request from './Request';
import { AuthContext } from '../../context/AuthContext';
import Pagination from '../Pagination/Pagination';
import { useHistory } from 'react-router-dom';
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
  const isFirstRun = useRef(true);
  const history = useHistory();

  // get available requests and total count
  useEffect(() => {
    getAvailableRequests(limit, skip);
    getAvailableRequestCount();
  }, [authContext.user]);

  // get available requests when page changes
  useEffect(() => {
    // ensure that this occurs only when changing pages and not when the page refreshes
    if (isFirstRun.current) {
      isFirstRun.current = false;
      return;
    }
    getAvailableRequests(limit, skip);
  }, [skip, limit]);

  // get available requests to display
  const getAvailableRequests = async (limit, skip) => {
    const availableRequests = await RequestService.getAvailableRequests(
      limit,
      skip
    );
    setRequests(availableRequests);
    setCurrentPage(skip / 5 + 1);
  };

  // get total count of all available requests
  const getAvailableRequestCount = async () => {
    const count = await RequestService.getAvailableRequestCount();
    setRequestCount(count);
  };

  // sets the next page's request index to retrieve
  const handlePageSelection = (skip) => {
    setSkip(skip)
  }

  // search keywords from the request's task description
  const handleKeywordToSearchInput = (e) => {
    setKeywordToSearch(e.target.value);
  };

  // remove filters when changing to search by keyword
  const handleSelectFilterByKeyword = (flag) => {
    setKeywordToSearch('');
    setRewardToSearch('');
    setFilterByKeyword(flag);
  };

  // search requests by a single reward
  const handleRewardToSearchInput = (e) => {
    setRewardToSearch(e.target.value);
  };

  // function to handle current page and total page count whenever
  // a request is claimed or removed
  const updateListOnRequestRemoval = () => {
    // return to first page
    setSkip(0);
    // decrease the requests count by one
    setRequestCount(requestCount - 1);
  }

  // for updating the request whenever a reward is added or removed
  const updateRequest = async (updatedRequest, index) => {
    let tmpRequests = [...requests];

    // Delete request if there are no more rewards
    if (!updatedRequest.rewards.length) {
      await RequestService.deleteRequest(updatedRequest._id);
      tmpRequests.splice(index, 1);
      updateListOnRequestRemoval();
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
      updateListOnRequestRemoval();
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

  // displays the list of available requests
  return (
    <Container className="px-lg-5 mt-4">
      {authContext.user ? (
        <Button
        variant="primary"
        onClick={() => history.push(`/createPublicRequest`)}
        >
          Add New Request
        </Button>
      ) : null}
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
