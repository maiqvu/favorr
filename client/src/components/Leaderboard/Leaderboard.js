import React, { useState, useContext, useEffect } from 'react';
import { Table, Container } from 'react-bootstrap';
import { AuthContext } from '../../context/AuthContext';
import axios from 'axios';

const Leaderboard = () => {
  const [data, setData] = useState([
    {
      name: '',
      count: ''
    }
  ]);

  const fetchData = async () => {
    const response = await axios.get('http://localhost:3000/api/leaderboard/');
    setData(response.data);
  };
  useEffect(() => { fetchData() }, 200);


  return (
    <Container className="px-lg-5 mt-4">
      <h2 className="text-center mb-4">Leaderboard</h2>
      <h4 className="text-center">People with the most favor</h4>
      <Table responsive striped hover responsive="sm" >
        <thead>
          <tr>
            <th className="text-center font-weight-bold">User name</th>
            <th className="text-center font-weight-bold">Most favor owned to</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <th className="text-center">placeholder</th>
            <th className="text-center">0</th>
            
          </tr>
          
        </tbody>
        
        {JSON.stringify(data)}
      </Table>
    </Container>

  );
}

export default Leaderboard;
