import React, { useEffect, useState, useContext } from 'react';
import { useHistory } from 'react-router-dom';
import Favor from './Favor';
import FavorService from './FavorService';
import { AuthContext } from '../../context/AuthContext';
import { Container, Button, Table, Toast, ToastBody } from 'react-bootstrap';

const MyFavors = () => {
  const [ favorsOwedByMe, setFavorsOwedByMe ] = useState([]);
  const [ favorsOwedToMe, setFavorsOwedToMe ] = useState([]);
  const [ showToast, setShowToast] = useState(false);
  const [ cycleList, setcycleList] = useState([]);
  const [ rewardList, setRewardList] = useState([]);
  
  const authContext = useContext(AuthContext);
  const history = useHistory();
  
  useEffect(() => {
    if (authContext.user) {
      FavorService.getFavors(authContext.user._id)
        .then(data => {
          setFavorsOwedByMe(data.owedByMe);
          setFavorsOwedToMe(data.owedToMe);
          
        });

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

  const PartyDetectMessage = () =>{
    let message = '';
    for (let i = 0; i < cycleList.length; i++){
      if (i == 0)
        message += 'You';
      else if (i == cycleList.length - 1)
        message += ' and ' + cycleList[i];
      else
      message += ', ' + cycleList[i];
    }

    message += 'can go for';

    for (let i = 0; i < rewardList.length; i++){
      if (i == rewardList.length - 1)
        message += ' and ' + rewardList[i];
      else
      message += rewardList[i] + ', ' ;
    }

    message += 'together to clear the debt';

    console.log(message);
  }

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
      else if (idx == cycleList.length-1)
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
      
      <h3 className="text-center">Favors owed by me</h3>
      <Table responsive striped hover size="sm" >
        <thead>
          <tr>
            <th className="text-left font-weight-bold">Description</th>
            <th className="text-left font-weight-bold">Owed by</th>
            <th className="text-left font-weight-bold">Owed to</th>
            <th className="text-left font-weight-bold">Status</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {favorsOwedByMe.map(favor => (
            <Favor
              key={favor._id}
              favor={favor}
              owedByMe={true}
              handleMarkAsRepaid={handleMarkAsRepaid}
            />
          ))}
        </tbody>
      </Table>
      
      <hr className="border border-light" />
      
      <h3 className="text-center">Favors owed to me</h3>
      <Table responsive striped hover size="sm" >
        <thead>
          <tr>
            <th className="text-left font-weight-bold">Description</th>
            <th className="text-left font-weight-bold">Owed by</th>
            <th className="text-left font-weight-bold">Owed to</th>
            <th className="text-left font-weight-bold">Status</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {favorsOwedToMe.map(favor => (
            <Favor
              key={favor._id}
              favor={favor}
              owedByMe={false}
              handleMarkAsRepaid={handleMarkAsRepaid}
            />
          ))}
        </tbody>
      </Table>
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
