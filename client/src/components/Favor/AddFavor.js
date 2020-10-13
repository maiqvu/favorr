import React, { useState, useContext } from 'react';
import { useHistory } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import FavorService from './FavorService';
import { favors } from './FavorOptions';
import { Form, Row, Col, Button, Modal } from 'react-bootstrap';

const AddFavor = () => {
  const [ newFavor, setNewFavor ] = useState({
    description: '',
    owedBy: '',
    owedTo: ''
  });
  const [ owedByMe, setOwedByMe ] = useState(null);
  const [ myFriend, setMyFriend ] = useState('');
  const [ image, setImage ] = useState('');
  const [ showModal, setShowModal ] = useState(false);
  const [ err, setErr ] = useState('');
  
  const authContext = useContext(AuthContext);
  const history = useHistory();
  
  const handleSelectFavor = (e) => {
    setNewFavor({ ...newFavor, [e.target.name]: e.target.value });
  };
  
  const handleSearchMyFriend = () => {
    FavorService.findUserByUsername(myFriend).then(res => {
      if (res.username !== authContext.user.username) {
        setErr(null);
        setShowModal(true);
        
        if (owedByMe) {
          setNewFavor({
            ...newFavor,
            owedBy: authContext.user.username,
            owedTo: myFriend
          });
        } else {
          setNewFavor({
            ...newFavor,
            owedBy: myFriend,
            owedTo: authContext.user.username
          });
        }
      } else {
        setErr(`Invalid search. Please enter your friend's username.`);
        setShowModal(true);
      }
    }).catch(err => {
      console.error(err.message);
      setErr('Cannot find this username.');
      setShowModal(true);
    });
  }
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(image);
    await FavorService.addFavor(newFavor, image);
    // setTimeout(() => {
    //   console.log('2 seconds after favor saved in backend');
    //   history.push(`/myFavors`);
    // }, 2000);
  };
  
  return (
    <Form onSubmit={handleSubmit}>
      <h3 className="text-center font-weight-bold">Create a new favor</h3>
      <br/>
      
      <Form.Group as={Row}>
        <Form.Label column sm={2}>Description *</Form.Label>
        <Col sm={8}>
          <Form.Control 
            required
            as="select"
            name="description"
            value={newFavor.description}
            onChange={handleSelectFavor}
          >
            <option value="">Select a favor</option>
            {favors.map(favor => 
              <option value={favor.item}>{favor.item}</option>
            )}
          </Form.Control>
        </Col>
      </Form.Group>

      <Form.Group as={Row}>
        <Form.Label as="legend" column sm="2">Owed by *</Form.Label>
        <Col>
          <Form.Check
            type="radio"
            inline
            label="me"
            checked={owedByMe === true}
            onChange={() => setOwedByMe(true)}
          />
          <Form.Check
            type="radio"
            inline
            label="my friend"
            checked={owedByMe === false}
            onChange={() => setOwedByMe(false)}
          />
        </Col>
      </Form.Group>
      
      <Form.Group as={Row}>
        <Form.Label as="legend" column sm="2">Owed to *</Form.Label>
        <Col>
          <Form.Check
            type="radio"
            inline
            label="me"
            checked={owedByMe === false}
            onChange={() => setOwedByMe(false)}
          />
          <Form.Check
            type="radio"
            inline
            label="my friend"
            checked={owedByMe === true}
            onChange={() => setOwedByMe(true)}
          />
        </Col>
      </Form.Group>
      
      <Col sm={10}>
        <div className="input-group mb-3">
          <input type="text"
            className="form-control"
            placeholder="Search your friend's username"
            value={myFriend}
            onChange={e => setMyFriend(e.target.value)}
          />
          <div className="input-group-append">
            <button
              type="button"
              className="btn btn-outline-primary"
              onClick={handleSearchMyFriend}
            >
              Search
            </button>
          </div>
        </div>
      </Col>
      
      <Modal
        centered
        backdrop="static"
        dialogClassName="modal-60w"
        show={showModal}
        onHide={() => setShowModal(false)}
      >
        <Modal.Body>
          {!err ? <h4>Found your friend <strong>{myFriend}</strong>!</h4> : <h4>{err}</h4>}
          
        </Modal.Body>
        <Modal.Footer>
          <Button
            size="sm"
            variant="outline-primary"
            onClick={() => setShowModal(false)}
          >
            OK
          </Button>
        </Modal.Footer>
      </Modal>
      
      {!owedByMe && <Form.Group>
        <label htmlFor="image">Please upload a photo proof.</label><br/>
        <input
          type="file"
          id="image"
          accept=".jpg,.png"
          onChange={e => setImage(e.target.files[0])}
        />
      </Form.Group>}
      
      <Button type="submit" className="btn btn-primary">
        Submit
      </Button>
    </Form>
  );
};

export default AddFavor;
