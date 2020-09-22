import React, { Component } from 'react';
import Button from 'react-bootstrap/Button';

const AddReward = (props) => {
    return (
      <div className="input-group">
        <select
          className="custom-select"
          id="inputGroupSelectRewardToAdd"
          name="newReward"
          value={props.newReward}
          onChange={props.onChange}
        >
          <option value="">Add a reward</option>
          <option value="Brownie">Brownie</option>
          <option value="Coffee">Coffee</option>
          <option value="Pizza">Pizza</option>
          <option value="Candy">Candy</option>
          <option value="Chocolate Bar">Chocolate Bar</option>
        </select>
        <div className="input-group-append">
          <Button
            variant="outline-primary"
            onClick={props.addReward}
            disabled={!props.newReward}
          >
            Add
          </Button>
        </div>
      </div>
    );
}

export default AddReward;
