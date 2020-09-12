import React, { Component } from 'react';
import Button from 'react-bootstrap/Button';

export default class AddReward extends Component {
  render() {
    return (
      <div className="input-group">
        <select
          className="custom-select"
          id="inputGroupSelectRewardToAdd"
          name="newReward"
          value={this.props.newReward}
          onChange={this.props.onChange}
        >
          <option value="">Add a reward</option>
          <option value="Chocolate Bar">Chocolate Bar</option>
          <option value="Orange Juice">Orange Juice</option>
          <option value="Chips">Chips</option>
          <option value="Candy">Candy</option>
          <option value="Breakfast">Breakfast</option>
        </select>
        <div className="input-group-append">
          <Button
            variant="outline-primary"
            onClick={this.props.addReward}
            disabled={!this.props.newReward}
          >
            Add
          </Button>
        </div>
      </div>
    );
  }
}
