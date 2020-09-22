import React from 'react';
import Button from 'react-bootstrap/Button';

const RemoveReward = (props) => {
  return (
    <div className="input-group">
      <select
        className="custom-select"
        id="inputGroupSelectRewardToRemove"
        name="removeRewardId"
        value={props.removeRewardId}
        onChange={props.onChange}
      >
        <option value="">Remove a reward</option>
        {props.request._id === props.focusedRequestId
          ? props.request.rewards.map((reward) =>
              reward.username === props.username ? (
                <option value={reward._id}>{reward.item}</option>
              ) : null
            )
          : null}
      </select>
      <div className="input-group-append">
        <Button
          variant="outline-primary"
          onClick={props.removeReward}
          disabled={!props.removeRewardId}
        >
          Remove
        </Button>
      </div>
    </div>
  );
};

export default RemoveReward;
