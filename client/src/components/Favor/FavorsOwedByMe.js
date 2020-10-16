import React, { useEffect, useState, useContext, useRef } from 'react';
import { Table } from 'react-bootstrap';
import Favor from './Favor';
import Pagination from '../Pagination/Pagination';
import FavorService from './FavorService';
import { AuthContext } from '../../context/AuthContext';

const FavorsOwedByMe = (props) => {
  // favor list state
  const [favors, setFavors] = useState([]);
  const [favorsCount, setFavorsCount] = useState(0);
  // user authentication state
  const authContext = useContext(AuthContext);
  // pagination states
  const [limit, setLimit] = useState(5);
  const [skip, setSkip] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const isFirstRun = useRef(true);

  useEffect(() => {
    if (authContext.user) {
      // get favors that are owed by me
      FavorService.getOwedByMeFavors(authContext.user._id, limit, skip).then(
        (data) => {
          setFavors(data);
          setCurrentPage(skip / 5 + 1);
        }
      );
      // get count of favors that are owed by me
      FavorService.getOwedByMeFavorsCount(authContext.user._id).then((data) => {
        setFavorsCount(data);
      });
    }
  }, [authContext.user, limit, skip]);

  useEffect(() => {
    if (isFirstRun.current) {
      isFirstRun.current = false;
      return;
    }
    FavorService.getOwedByMeFavors(authContext.user._id, limit, skip).then(
      (data) => {
        console.log(data);
        setFavors(data);
        setCurrentPage(skip / 5 + 1);
      }
    );
  }, [props.refresh])

  const handlePageSelection = (skip) => {
    setSkip(skip);
  };

  return (
    <div>
      <h3 className="text-center">Favors owed by me</h3>
      <Table responsive striped hover size="sm">
        <thead>
          <tr>
            <th className="text-left font-weight-bold">Description</th>
            <th className="text-left font-weight-bold">Owed to</th>
            <th className="text-left font-weight-bold">Status</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {favors.map((favor) => (
            <Favor
              key={favor._id}
              favor={favor}
              owedByMe={true}
              handleMarkAsRepaid={props.handleMarkAsRepaid}
            />
          ))}
        </tbody>
      </Table>
      <Pagination
        count={favorsCount}
        limit={limit}
        skip={skip}
        onPageSelection={handlePageSelection}
        currentPage={currentPage}
      />
    </div>
  );
};

export default FavorsOwedByMe;
