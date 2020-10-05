import React, { useState, useContext } from 'react';
import { Table, Container } from 'react-bootstrap';
import { AuthContext } from '../../context/AuthContext';


const Leaderboard = () => {
  // const [ task, setTask ] = useState('');
  // const [ reward, setReward ] = useState('');
  // const [ successText, setSuccessText ] = useState('');

  // const authContext = useContext(AuthContext);



  return (
    <Container className="px-lg-5 mt-4">
      <h2 className="text-center mb-4">Leaderboard</h2>
      <h4 className="text-center">People with the most favor</h4>
      <Table responsive striped hover responsive="sm" >
        <thead>
          <tr>
            <th className="text-left font-weight-bold">Description</th>
            <th className="text-left font-weight-bold">Owed by</th>
            </tr>
        </thead>
        <tbody>

        </tbody>
      </Table>
    </Container>
  );
}

export default Leaderboard;
