import React, { useState, useContext } from 'react';
import axios from 'axios';

import AddReward from './AddReward';
import RemoveReward from './RemoveReward';
import UploadProof from './UploadProof';

import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import Dropdown from 'react-bootstrap/Dropdown';

const Request = (props) => {
  const [ newReward, setNewReward ] = useState('');
  const [ removeRewardId, setRemoveRewardId ] = useState('');
  const [ showUploadOption, setShowUploadOption ] = useState(false);
  const [ showGiveUpConfirmation, setShowGiveUpConfirmation ] = useState(false);

  const handleSelectNewReward = (e) => {
    setNewReward(e.target.value);
  };

  const handleSelectRemoveRewardId = (e) => {
    setRemoveRewardId(e.target.value);
  };

  const toggleUploadOption = () => {
    if (showGiveUpConfirmation === true) {
      setShowGiveUpConfirmation(!showGiveUpConfirmation);
    }
    setShowUploadOption(!showUploadOption);
  }

  const toggleGiveUpConfirmation = () => {
    if (showUploadOption === true) {
      setShowUploadOption(!showUploadOption);
    }
    setShowGiveUpConfirmation(!showGiveUpConfirmation);
  }

  const addReward = async (requestId, index) => {
    try {
      let response = await axios.post(
        `/api/publicRequests/${requestId}/add-reward`,
        {
          username: props.user.username,
          item: newReward,
        }
      );
      props.updateRequest(response.data, index);
      setNewReward('');
    } catch (err) {
      console.error(err);
    }
  }

  const removeReward = async (requestId, index) => {
    try {
      let response = await axios.patch(
        `/api/publicRequests/${requestId}/remove-reward`,
        { rewardId: removeRewardId }
      );      
      props.updateRequest(response.data, index);
      setRemoveRewardId('');
    } catch (err) {
      console.error(err);
    }
  }

  const constructFullRewardItemList = (rewards) => {
    let fullRewardItemList = [];

    for (const reward of rewards) {
      fullRewardItemList.push(reward.item);
    }

    return fullRewardItemList.join(', ');
  }

  const constructLimitedRewardItemList = (rewards) => {
    let displayList;
    let rewardItemList = [];

    for (let reward of rewards) {
      rewardItemList.push(reward.item);
    }

    if (rewardItemList.length > 2) {
      displayList = rewardItemList.slice(0, 2).join(', ') + '...';
    } else {
      displayList = rewardItemList.join(', ');
    }

    return displayList;
  }

  return (
    <React.Fragment>
      <Row>
        <Col className="col-sm-5 text-left">
          {props.request.task}
        </Col>
        <Col className="col-sm-3 text-left">
          {new Date(Date.parse(props.date))
            .toString()
            .slice(0, 15)}
        </Col>
        <Col className="col-sm-3 text-left">
          {constructLimitedRewardItemList(props.request.rewards)}
        </Col>
        <Col className="col-sm-1 text-right">
          <Dropdown>
            <Dropdown.Toggle
              variant="transparant"
              id="dropdown-basic"
              onClick={props.expandRequestToggle}
            />
          </Dropdown>
        </Col>
      </Row>
      {props.request._id === props.focusedRequestId ? (
        <div className="p-3 mb-2 bg-light text-dark">
          <div className="p-2">
            <h5 className="text-left">REQUEST DETAILS:</h5>
            <Row className="mb-4">
              <Col className="col-sm-5">
                <strong>Creator:&ensp;</strong>
                <span>{props.request.creator.username}</span>
              </Col>
              <Col className="col-sm-7">
                <strong>Task:&ensp;</strong>
                <span>{props.request.task}</span>
              </Col>
            </Row>
            <Row className="mb-4">
              <Col className="col-sm-5">
                <strong>Time Submitted:&ensp;</strong>
                <span>
                  {new Date(
                    Date.parse(props.request.createdAt)
                  ).toString()}
                </span>
              </Col>
              <Col className="col-sm-7">
                <strong>Rewards:&ensp;</strong>
                <span>
                  {constructFullRewardItemList(
                    props.request.rewards
                  )}
                </span>
              </Col>
            </Row>
          </div>
          {props.user ? (
            <div>
              {props.user.username && !props.request.claimedBy ? (
                <Row>
                  <Col className="col-sm-5">
                    <AddReward
                      newReward={newReward}
                      onChange={handleSelectNewReward}
                      addReward={() =>
                        addReward(props.request._id, props.index)
                      }
                    />
                  </Col>
                  <Col className="col-sm-5">
                    <RemoveReward
                      request={props.request}
                      focusedRequestId={props.focusedRequestId}
                      user={props.user}
                      removeRewardId={removeRewardId}
                      onChange={handleSelectRemoveRewardId}
                      removeReward={() =>
                        removeReward(
                          props.request._id,
                          props.index
                        )
                      }
                    />
                  </Col>
                </Row>
              ) : null}
              <div className="text-right">
                {props.user.username && (props.user.username !== props.request.creator.username)
                  && (props.user._id !== props.request.claimedBy) ? (
                  <Button
                    variant="primary"
                    onClick={() =>
                      props.claim(props.request._id, props.index)
                    }
                  >
                    Claim
                  </Button>
                ) : null}
                {props.user.username && (props.user._id === props.request.claimedBy) ? (
                  <div>
                    <Button onClick={toggleUploadOption}>Resolve</Button>
                    &ensp;
                    <Button onClick={toggleGiveUpConfirmation} variant="secondary">Give Up</Button>
                  </div>
                ) : null}
                {showUploadOption ? (
                  <UploadProof />
                ) : null}
                {showGiveUpConfirmation ? (
                  <div>
                    <br />
                    <h6>Are you sure?</h6>
                    <Button variant="danger">Yes</Button>
                  </div>
                ) : null}
              </div>
            </div>
          ) : null }
        </div>
      ) : null}
      <hr />
    </React.Fragment>
  );
};

export default Request;
