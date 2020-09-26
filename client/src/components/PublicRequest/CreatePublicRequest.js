import React, { useState, useContext } from 'react';
import { Form, Button } from 'react-bootstrap';
import axios from 'axios';
import { AuthContext } from '../../context/AuthContext';

const CreatePublicRequest = (props) => {
  const [ task, setTask ] = useState('');
  const [ reward, setReward ] = useState('');
  // to be used in future validation
  const [ formIsValid, setFormIsValid ] = useState(true);
  const [ successText, setSuccessText ] = useState('');

  const authContext = useContext(AuthContext);

  const handleReset = () => {
    setTask('');
    setReward('');
  }

  const handleTaskChange = (event) => {
    setTask(event.target.value);
  }

  const handleRewardChange = (event) => {
    setReward(event.target.value);
  }

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      await axios.post(`/api/publicRequests`,
        {
          creator: authContext.user.username,
          claimedBy: null,
          claimedByTime: null,
          task: task,
          reward: { 
            user: authContext.user.username,
            item: reward
          }
        })
      setSuccessText('Success! Request has been posted.');
      setTask('');
      setReward('');
    } catch (err) {
      console.log(err);
      setSuccessText('Error! Please contact Admin');
    }
  };

  return (
    <Form onSubmit={handleSubmit}>
      <h3>Create a Public Request</h3>
      <Form.Group controlId="taskDetail">
        <Form.Label>Task Details*:</Form.Label>
        <Form.Control as="textarea"
          required
          name="task"
          rows="2"
          value={task}
          onChange={handleTaskChange}
          placeholder="Eg: Collect parcels..."
        />
      </Form.Group>
      <Form.Group controlId="selectReward">
        <Form.Label>Reward*:</Form.Label>
        <Form.Control as="select"
          name="reward"
          value={reward}
          onChange={handleRewardChange}
          custom='true'
        >
          <option value="">Select a reward</option>
          <option value="Brownie">Brownie</option>
          <option value="Coffee">Coffee</option>
          <option value="Pizza">Pizza</option>
          <option value="Candy">Candy</option>
          <option value="Chocolate Bar">Chocolate Bar</option>
        </Form.Control>
      </Form.Group>
      <div className="disclaimer">*required</div>
      <Form.Group controlId="buttonGroup">
        <Button
          variant="secondary"
          onClick={handleReset}
        >
          Reset
        </Button>{' '}
        <Button
          variant="primary"
          type="submit"
          disabled={!reward && formIsValid}
        >
          Submit
        </Button>
        {' '}
        {successText}
      </Form.Group>
    </Form>
  );
}

export default CreatePublicRequest;

// class CreatePublicRequestPage {
//   constructor(props) {
//     super(props);

//     this.state = {
//       creator: 'alex',
//       requestDetail: '',
//       reward: '',
//       //to be used in future validation
//       formIsValid: true,
//       successText: ""
//     };
//     this.handleReset = this.handleReset.bind(this);
//     this.handleChange = this.handleChange.bind(this);
//     this.handleSubmit = this.handleSubmit.bind(this);

//   }
//   handleReset = () => {
//     this.setState({
//       requestDetail: '',
//       reward: ''
//     });
//   };

//   handleChange = event => {
//     this.setState({
//       [event.target.name]: event.target.value
//     });
//   };

//   handleSubmit = async event => {
//     const { creator, requestDetail, reward } = this.state;
//     event.preventDefault();

//     await axios
//       .post(`/api/publicRequests`,
//         {
//           creator: creator,
//           claimedBy: null,
//           claimedByTime: null,
//           task: requestDetail,
//           reward: [{ name: creator, item: reward }],
//         })
//       .then(this.setState({ successText: 'Request has been successfully posted.' }))
//       .catch(err => this.setState({ successText: 'Error! Please contact Admin' }));
//   };

//   render() {
//     return (
//       <Form onSubmit={this.handleSubmit}>
//         <h3>Create a Public Request</h3>
//         <Form.Group controlId="taskDetail">
//           <Form.Label>Task Details*:</Form.Label>
//           <Form.Control as="textarea"
//             required
//             name="requestDetail"
//             rows="2"
//             value={this.state.requestDetail}
//             onChange={this.handleChange}
//             placeholder="Eg: Collect parcels..."
//           />
//         </Form.Group>
//         <Form.Group controlId="selectReward">
//           <Form.Label>Reward*:</Form.Label>
//           <Form.Control as="select"
//             name="reward"
//             value={this.state.reward}
//             onChange={this.handleChange}
//             custom='true'
//           >
//             <option value="">Add a reward</option>
//             <option value="Chocolate Bar">Chocolate Bar</option>
//             <option value="Orange Juice">Orange Juice</option>
//             <option value="Chips">Chips</option>
//             <option value="Candy">Candy</option>
//             <option value="Breakfast">Breakfast</option>
//           </Form.Control>
//         </Form.Group>
//         <div className="disclaimer">*required</div>
//         <Form.Group controlId="buttonGroup">
//           <Button
//             variant="secondary"
//             onClick={this.handleReset}
//           >
//             Reset
//           </Button>{' '}
//           <Button
//             variant="primary"
//             type="submit"
//             disabled={this.state.reward === "" && this.state.formIsValid}
//           >
//             Submit
//           </Button>
//           {' '}
//           {this.state.successText}
//         </Form.Group>
//       </Form>
//     );
//   }
// }
