import React, { useEffect, useState, useContext } from 'react';
import { useHistory } from 'react-router-dom';
import FavorService from './FavorService';
import { AuthContext } from '../../context/AuthContext';
import FavorsOwedByMe from './FavorsOwedByMe';
import FavorsOwedToMe from './FavorsOwedToMe';
import { Container, Button, Toast, Modal, Form } from 'react-bootstrap';

const MyFavors = () => {
  const [ showToast, setShowToast] = useState(false);
  const [ cycleList, setcycleList] = useState([]);
  const [ rewardList, setRewardList] = useState([]);
  const [ refreshFavorList, setRefreshFavorList ] = useState(false);
  const [ showModal, setShowModal ] = useState(false);
  const [ image, setImage ] = useState('');
  
  const authContext = useContext(AuthContext);
  const history = useHistory();
  
  useEffect(() => {
    if (authContext.user) {
      FavorService.findCycle(authContext.user._id)
        .then(data => {
          if (data.cycleList.length !== 0){
            setShowToast(true);
            setcycleList(data.cycleList);
            setRewardList(data.rewardList);
          }
        });
    }
  }, [authContext.user]);
  
  const handleSubmitImage = e => {
    e.preventDefault();
    console.log(image);
    setShowModal(false);
  }
  
  const repaidOwedToMeFavor = async (favorId) => {
    const updatePayload = { repaid: true };
    const response = await FavorService.updateOwedToFavor(favorId, updatePayload);
    
    if (response.status === 200) {
      console.log(response.data);
    } else {
      console.error(response);
    }
  };

  const repaidOwedByMeFavor = async (favorId, image) => {
    const updatePayload = { repaid: true };
    const favorResponse = await FavorService.updateOwedByFavor(favorId, updatePayload);
    const uploadResponse = await FavorService.markRepaidWithImage(image, favorId);
    
    if (favorResponse.status === 200 && uploadResponse.status === 200) {
      console.log(favorResponse.data, uploadResponse.data);
      setRefreshFavorList(!refreshFavorList);
    }
  }

  const PartyDetectMessage = () =>{
    let message = '';
    for (let i = 0; i < cycleList.length; i++){
      if (i === 0)
        message += 'You';
      else if (i === cycleList.length - 1)
        message += ' and ' + cycleList[i];
      else
      message += ', ' + cycleList[i];
    }

    message += 'can go for';

    for (let i = 0; i < rewardList.length; i++){
      if (i === rewardList.length - 1)
        message += ' and ' + rewardList[i];
      else
      message += rewardList[i] + ', ' ;
    }

    message += 'together to clear the debt';

    console.log(message);
  }

  const userList = (
    <div>{cycleList.map((item, idx) => {
      if (idx === 0)
        return <b key={idx}>You </b>
      else if (idx === cycleList.length-1)
        return <b key={idx}> and {item}</b>
      else 
        return <b key={idx}>, {item}</b>
    })} can go for 
    {rewardList.map((item, idx)=>{
      if (idx === 0)
        return <b key={idx}> {item} </b>
      else if (idx === cycleList.length-1)
        return <b key={idx}> and {item} </b>
      else 
        return <b key={idx}> , {item}</b>
    })}
    to clear debts at once!</div>
  );
  
  return (
    <Container fluid>
      <br/>
      <Button
        variant="primary"
        onClick={() => history.push(`/addFavor`)}
      >
        Add New Favor
      </Button>
      <br/>
      
      <FavorsOwedByMe
        handleMarkAsRepaid={repaidOwedByMeFavor}
        refresh={refreshFavorList}
      />
      <Modal
        centered
        backdrop="static"
        dialogClassName="modal-60w"
        show={showModal}
        onHide={() => setShowModal(false)}
      >
        <Modal.Body>
          <Form onSubmit={handleSubmitImage}>
            <Form.Label>Upload photo proof:</Form.Label>
            <input
              type="file"
              id="image"
              accept=".jpg,.png"
              onChange={e => setImage(e.target.files[0])}
            />
            <Button
              type="submit"
              className="btn btn-primary"
            >
              Submit
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
      
      <hr className="border border-light" />
      <FavorsOwedToMe
        handleMarkAsRepaid={repaidOwedToMeFavor}
        refresh={refreshFavorList}
      />
      
      <div aria-live="polite" aria-atomic="true" style={{position: 'relative', minHeight: '100px'}}>
        <Toast style={{position: 'absolute', top:-50, right: 0}}
          show={showToast} 
          onClose={() => setShowToast(false)}
        >
          <Toast.Header>
            <strong className="mr-auto" style={{color: '#e43737'}}>Party found!</strong>
            <small>just now</small>
          </Toast.Header>
          <Toast.Body>
              {userList}
          </Toast.Body>
        </Toast>
      </div>
    </Container>
  )
}

export default MyFavors;
