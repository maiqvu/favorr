import React, { useEffect, useState, useContext } from 'react';
import FavorService from './FavorService';
import { AuthContext } from '../../context/AuthContext';

import { Container, Row, Col, Button } from 'react-bootstrap';

const MyFavors = (props) => {
  const [ favorsOwedByMe, setFavorsOwedByMe ] = useState([]);
  const [ favorsOwedToMe, setFavorsOwedToMe ] = useState([]);
  
  const authContext = useContext(AuthContext);
  
  useEffect(() => {
    FavorService.getFavors(authContext.user._id).then(data => {
      setFavorsOwedByMe(data.owedByMe);
      setFavorsOwedToMe(data.owedToMe);
    })
  }, []);
  
  return (
    <React.Fragment>
      <Button
        variant="primary"
        onClick={() => props.history.push('/addFavor')}
      >
        Add New Favor
      </Button>
      
      <h3 className="text-center">Favors owed by me</h3>
      <Container className="px-lg-5">
        <Row>
          <Col className="col-sm-5 text-left font-weight-bold">Description</Col>
          <Col className="col-sm-3 text-left font-weight-bold">Owed by</Col>
          <Col className="col-sm-3 text-left font-weight-bold">Owed to</Col>
        </Row>
        <hr className="border border-light" />
        {
          favorsOwedByMe.map(favor => {
            return (
              <Row key={favor._id}>
                <Col className="col-sm-5 text-left">
                  { favor.description }
                </Col>
                <Col className="col-sm-3 text-left">
                  { authContext.user.username }
                </Col>
                <Col className="col-sm-3 text-left">
                  { favor.owedTo.username }
                </Col>
              </Row>
            )
          })
        }
      </Container>
      <br/>
      
      <h3 className="text-center">Favors owed to me</h3>
      <Container className="px-lg-5">
        <Row>
          <Col className="col-sm-5 text-left font-weight-bold">Description</Col>
          <Col className="col-sm-3 text-left font-weight-bold">Owed by</Col>
          <Col className="col-sm-3 text-left font-weight-bold">Owed to</Col>
        </Row>
        <hr className="border border-light" />
        {
          favorsOwedToMe.map(favor => {
            return (
              <Row key={favor._id}>
                <Col className="col-sm-5 text-left">
                  { favor.description }
                </Col>
                <Col className="col-sm-3 text-left">
                  { favor.owedBy.username }
                </Col>
                <Col className="col-sm-3 text-left">
                  { authContext.user.username }
                </Col>
              </Row>
            )
          })
        }
      </Container>
    </React.Fragment>
  )
}

export default MyFavors;
