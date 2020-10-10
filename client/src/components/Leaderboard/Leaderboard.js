import React, { useState, useContext, useEffect } from 'react';
import { Table, Container } from 'react-bootstrap';
import axios from 'axios';
import { environment as env } from '../../environments/environment';

const Leaderboard = () => {
  const [data, setData] = useState([
    {
      name: '',
      count: ''
    }
  ]);

  const fetchData = async () => {
    const response = await axios.get(`/${env.favorrApiName}/${env.leaderboardPath}/`);
    setData(response.data);
  };
  //delay function to be developed to work with useEffect infinite loop
  //currently use [], leaderboard will update when page refresh
  useEffect(() => {
    fetchData();
  },
  []
  );


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
        <tbody className="text-center">
          {data.map((person) => (
            <tr key={person.id}>
              {Object.values(person).map((val) => (
                <td>{val}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </Table>
    </Container>

  );
}

export default Leaderboard;
