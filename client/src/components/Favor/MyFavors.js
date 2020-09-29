import React, { useEffect, useState, useContext } from 'react';
import FavorService from './FavorService';
import { AuthContext } from '../../context/AuthContext';
import { Container, Button, Table } from 'react-bootstrap';

const MyFavors = (props) => {
  const [ favorsOwedByMe, setFavorsOwedByMe ] = useState([]);
  const [ favorsOwedToMe, setFavorsOwedToMe ] = useState([]);
  
  const authContext = useContext(AuthContext);
  
  useEffect(() => {
    if (authContext.user) {
      FavorService.getFavors(authContext.user._id)
        .then(data => {
          setFavorsOwedByMe(data.owedByMe);
          setFavorsOwedToMe(data.owedToMe);
        })
    }
  }, [authContext.user]);
  
  return (
    <Container fluid>
      <br/>
      
      <Button
        variant="primary"
        onClick={() => props.history.push('/addFavor')}
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
            <tr key={favor._id}>
              <td width="20%">{favor.description}</td>
              <td width="20%">{authContext.user.username}</td>
              <td width="20%">{favor.owedTo.username}</td>
              <td width="20%">{favor.repaid ? 'Repaid' : 'Pending'}</td>
              <td width="20%">
                {favor.repaid ? null : <Button
                  size="sm"
                  variant="outline-primary"
                >
                  Mark as repaid
                </Button>}
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
      
      <hr className="border border-light" />
      <br/>
      
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
            <tr key={favor._id}>
              <td width="20%">{favor.description}</td>
              <td width="20%">{favor.owedBy.username}</td>
              <td width="20%">{authContext.user.username}</td>
              <td width="20%">{favor.repaid ? 'Repaid' : 'Pending'}</td>
              <td width="20%">
                {favor.repaid ? null : <Button
                  size="sm"
                  variant="outline-primary"
                >
                  Mark as repaid
                </Button>}
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </Container>
  )
}

export default MyFavors;
