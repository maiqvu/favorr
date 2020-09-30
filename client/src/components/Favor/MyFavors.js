import React, { useEffect, useState, useContext } from 'react';
import { useHistory } from 'react-router-dom';
import Favor from './Favor';
import FavorService from './FavorService';
import { AuthContext } from '../../context/AuthContext';
import { Container, Button, Table } from 'react-bootstrap';

const MyFavors = () => {
  const [ favorsOwedByMe, setFavorsOwedByMe ] = useState([]);
  const [ favorsOwedToMe, setFavorsOwedToMe ] = useState([]);
  
  const authContext = useContext(AuthContext);
  const history = useHistory();
  
  useEffect(() => {
    if (authContext.user) {
      FavorService.getFavors(authContext.user._id)
        .then(data => {
          setFavorsOwedByMe(data.owedByMe);
          setFavorsOwedToMe(data.owedToMe);
        })
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
    </Container>
  )
}

export default MyFavors;
