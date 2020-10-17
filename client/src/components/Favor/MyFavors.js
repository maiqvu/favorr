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
  const [ rewardList, setRewardList] = useState([]);
  
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
  
  const handleMarkAsRepaid = async (favorId, favorStatus) => {
    const updatedValue = { repaid: !favorStatus };
    const response = await FavorService.updateFavor(favorId, updatedValue);
    
    if (response.status === 200) {
      console.log(response.data);
    } else {
      console.error(response);
    }
  };


  const userList = (
    <div>{cycleList.map((item, idx) => {
      if (idx == 0)
        return <b key={idx}>You </b>
      else if (idx == cycleList.length-1)
        return <b key={idx}> and {item}</b>
      else 
        return <b key={idx}>, {item}</b>
    })} can go for 
    {rewardList.map((item, idx)=>{
      if (idx == 0)
        return <b key={idx}> {item} </b>
      else if (idx == rewardList.length-1)
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
        handleMarkAsRepaid={handleMarkAsRepaid}/>
      <hr className="border border-light" />
      <FavorsOwedToMe 
        handleMarkAsRepaid={handleMarkAsRepaid}/>
      <div aria-live="polite" aria-atomic="true" style={{position: 'relative', minHeight: '100px'}}>
        <Toast style={{position: 'absolute', top:0, right: 0}}
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
