import React, { useEffect, useState } from 'react';
import FavorService from './FavorService';

import { Container, Row, Col } from 'react-bootstrap';

const MyFavors = (props) => {
  const [ favorsOwedByMe, setFavorsOwedByMe ] = useState([]);
  const [ favorsOwedToMe, setFavorsOwedToMe ] = useState([]);
  
  useEffect(() => {
    FavorService.getFavors('5f43ce92511127371f476dd5').then(data => {
      setFavorsOwedByMe(data.owedByMe);
      setFavorsOwedToMe(data.owedToMe);
    })
  }, []);
  
  return (
    <React.Fragment>
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
                  { favor.owedBy.email }
                </Col>
                <Col className="col-sm-3 text-left">
                  { favor.owedTo.email }
                </Col>
              </Row>
            )
          })
        }
      </Container>
      <br/>
      <h3 className="text-center">Favors owed to me:</h3>
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
                  { favor.owedBy.email }
                </Col>
                <Col className="col-sm-3 text-left">
                  { favor.owedTo.email }
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
