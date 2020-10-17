import React, { useState, useEffect } from 'react';
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
  //useEffect has [] to stop infinite loop, so leaderboard will update when page refresh
  useEffect(() => {
    fetchData();
  },
  []
  );


  return (
    <Container className="px-lg-5 mt-4">
      <h2 className="text-center mb-4">Leaderboard</h2>
      <h4 className="text-center">Who earned the most favor (All Time)</h4>
      <Table responsive striped hover responsive="sm" >
        <thead>
          <tr>
            <th className="text-center font-weight-bold">User name</th>
            <th className="text-center font-weight-bold">Most favor owned to</th>
          </tr>
        </thead>
        <tbody className="text-center">
          {/* use id and id2 as key to prevent error when rendering the table array */}
          {data.map((name,id) => (
            <tr key={id}>
              {Object.values(name).map((count,id2) => (
                <td key={id2}>{count}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </Table>
    </Container>

  );
}

export default Leaderboard;
