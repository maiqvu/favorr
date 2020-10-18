import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import RequestService from './RequestService';

import AddReward from './AddReward';
import RemoveReward from './RemoveReward';

import {Row, Col, Button, Collapse} from 'react-bootstrap';

const Request = (props) => {
  const [newReward, setNewReward] = useState('');
  const [removeRewardId, setRemoveRewardId] = useState('');
  const [showUploadOption, setShowUploadOption] = useState(false);
  const [open, setOpen] = useState(false);
  const [image, setImage] = useState('');
  const [resolved, setResolved] = useState(props.request.resolved);
  const history = useHistory();

  useEffect(() => {
    // reset expand toggle when the request has changed
    setOpen(false);
  }, [props.request._id])

  const handleSelectNewReward = (e) => {
    setNewReward(e.target.value);
  };

  const handleSelectRemoveRewardId = (e) => {
    setRemoveRewardId(e.target.value);
  };

  const expandRequestToggle = () => {
    setOpen(!open);
  };

  const toggleUploadOption = () => {
    setShowUploadOption(!showUploadOption);
  };

  // add a reward with reference to the logged in user and update the request
  const addReward = async (requestId, index) => {
    const updatedRequest = await RequestService.addReward(
      requestId,
      props.user.username,
      newReward
    );
    props.updateRequest(updatedRequest, index);
    setNewReward('');
  };

  // remove a reward that is created by the logged in user and update the request
  const removeReward = async (requestId, index) => {
    const updatedRequest = await RequestService.removeReward(
      requestId,
      removeRewardId
    );

    props.updateRequest(updatedRequest, index);
    setRemoveRewardId('');
  };

  // full reward list for displaying in expanded view
  const constructFullRewardItemList = (rewards) => {
    let fullRewardItemList = [];

    for (const reward of rewards) {
      fullRewardItemList.push(reward.item);
    }

    return fullRewardItemList.join(', ');
  };

  // limited reward list for displaying in row
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
  };

  const resolve = async (requestId, index) => {
    const updatedRequest = await RequestService.resolveRequest(
      requestId,
      image
    );
    props.updateRequest(updatedRequest, index);
    // Hide resolve and upload options
    setShowUploadOption(false);
    // Show resolved message
    setResolved(true);
  }

  return (
    <React.Fragment>
      <Row>
        <Col className="col-sm-5 text-left">{props.request.task}</Col>
        <Col className="col-sm-3 text-left">
          {new Date(Date.parse(props.date)).toString().slice(0, 15)}
        </Col>
        <Col className="col-sm-3 text-left">
          {constructLimitedRewardItemList(props.request.rewards)}
        </Col>
        <Col className="col-sm-1 text-right">
          <button 
            variant="transparant"
            id="dropdown-basic"
            onClick={expandRequestToggle}
            aria-controls={props.request._id}
            aria-haspopup="true" 
            aria-expanded={open}
            type="button" 
            className="dropdown-toggle btn btn-transparant">
          </button>
        </Col>
      </Row>
      <Collapse in={open} className="p-3 mb-2 ">
        <div className="bg-light text-dark" id={props.request._id}>
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
                  {new Date(Date.parse(props.request.createdAt)).toString()}
                </span>
              </Col>
              <Col className="col-sm-7">
                <strong>Rewards:&ensp;</strong>
                <span>
                  {constructFullRewardItemList(props.request.rewards)}
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
                      user={props.user}
                      removeRewardId={removeRewardId}
                      onChange={handleSelectRemoveRewardId}
                      removeReward={() =>
                        removeReward(props.request._id, props.index)
                      }
                    />
                  </Col>
                </Row>
              ) : null}
              <div className="text-right">
                {props.user.username &&
                props.user.username !== props.request.creator.username &&
                props.user._id !== props.request.claimedBy ? (
                  <Button
                    variant="primary"
                    onClick={() => props.claim(props.request._id, props.index)}
                  >
                    Claim
                  </Button>
                ) : null}
                {props.user.username && !resolved &&
                props.user._id === props.request.claimedBy ? (
                  <div>
                    <Button onClick={toggleUploadOption}>Resolve</Button>
                  </div>
                ) : null}
                {showUploadOption ? (
                  <div>
                    <div className='text-left'>
                      <label htmlFor="image">Please upload a photo proof.</label><br/>
                    </div>
                    <Row>
                      <Col className="md-8 text-left">
                        <input
                          type="file"
                          id="image"
                          accept=".jpg,.png"
                          onChange={e => setImage(e.target.files[0])}
                        />
                      </Col>
                      <Col className="md-4 text-right">
                        <Button variant="primary" disabled={!image} onClick={() => resolve(props.request._id, props.index)}>Upload</Button>
                      </Col>
                    </Row>
                  </div>
                ) : null}
                {resolved ? (
                  <div className='bg-light'>
                    Go to updated favor list.{' '}
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={() => history.push(`/myFavors`)}
                    >
                      My Favors
                    </Button> | Resolved
                  </div>
                ) : null}
              </div>
            </div>
          ) : null}
        </div>
      </Collapse>
      <hr />
    </React.Fragment>
  );
};

export default Request;
