import React, { Component } from 'react';
import Button from 'react-bootstrap/Button';

export default class RemoveReward extends Component {
  render() {
    return (
      <div className="input-group">
        <select
          className="custom-select"
          id="inputGroupSelectRewardToRemove"
          name="removeRewardId"
          value={this.props.removeRewardId}
          onChange={this.props.onChange}
        >
          <option value="">Remove a reward</option>
          {this.props.request._id === this.props.focusedRequestId
            ? this.props.request.reward.map((reward) =>
                reward.name === this.props.username ? (
                  <option value={reward._id}>{reward.item}</option>
                ) : null
              )
            : null}
        </select>
        <div className="input-group-append">
          <Button
            variant="outline-primary"
            onClick={this.props.removeReward}
            disabled={!this.props.removeRewardId}
          >
            Remove
          </Button>
        </div>
      </div>
    );
  }
}
