import React, { useEffect, useState, useContext } from 'react';
import { useHistory } from 'react-router-dom';
import FavorService from './FavorService';
import { AuthContext } from '../../context/AuthContext';
import FavorsOwedByMe from './FavorsOwedByMe';
import FavorsOwedToMe from './FavorsOwedToMe';
import { Container, Button, Toast } from 'react-bootstrap';

const MyFavors = () => {
  const [ showToast, setShowToast] = useState(false);
  const [ cycleList, setcycleList] = useState([]);
  
  const authContext = useContext(AuthContext);
  const history = useHistory();
  
  useEffect(() => {
    if (authContext.user) {
      FavorService.findCycle(authContext.user._id)
        .then(data => {
          if (data.cycleList.length !== 0){
            setShowToast(true);
            setcycleList(data.cycleList);
          }
        });
    }
  }, [authContext.user]);
  
  const handleMarkAsRepaid = async (favorId, favorStatus) => {
    const updatedValue = { repaid: !favorStatus };
    const response = await FavorService.updateFavor(favorId, updatedValue);
    
    if (response.status === 200) {
      console.log(response.data);
    } else {
      console.error(response);
    }
  };
  
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
        handleMarkAsRepaid={handleMarkAsRepaid}/>
      <hr className="border border-light" />
      <FavorsOwedToMe 
        handleMarkAsRepaid={handleMarkAsRepaid}/>
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
            <p>{cycleList.map(item => (
                <b>{item.username}, </b>
              ))} can clear debts at once!</p>
          </Toast.Body>
        </Toast>
      </div>
    </Container>
  )
}

export default MyFavors;
