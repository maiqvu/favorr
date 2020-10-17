import React, { useState } from 'react';
import { Button, Collapse } from 'react-bootstrap';

import FavorService from './FavorService';

const Favor = (props) => {
  // const [ open, setOpen ] = useState(false);
  const [ openUpload, setOpenUpload ] = useState(false);
  const [ openRepaidProof, setOpenRepaidProof ] = useState(false);
  const [ openSubmitProof, setOpenSubmitProof ] = useState(false);
  const [ image, setImage ] = useState('');
  
  return (
    <tr>
      <td width="25%">{props.favor.description}</td>
      <td width="20%">
        {props.owedByMe ? props.favor.owedTo.username : props.favor.owedBy.username}
      </td>
      <td width="15%">{props.favor.repaid ? 'Repaid' : 'Pending'}</td>
      <td width="40%" className="text-right">
        {!props.favor.repaid && props.owedByMe ? (
            <div>
              <Button
                size="sm"
                variant="outline-primary"
                onClick={() => {
                  setOpenUpload(!openUpload);
                  setOpenRepaidProof(false);
                  setOpenSubmitProof(false);
                }}
              >
                Mark as repaid
              </Button>
              <Collapse in={openUpload}>
                <div id="favor-repaid-proof-upload" className="text-right">
                  <br/>
                  <p>Upload an image as proof</p>
                  <input
                    type="file"
                    id="image"
                    accept=".jpg,.png"
                    onChange={e => {
                      setImage(e.target.files[0]);
                    }}
                  />
                  <Button variant="primary" size='sm' disabled={!image} 
                    onClick={() => props.handleMarkAsRepaid(props.favor._id, image)}>Upload</Button>
                  <br/>
                </div>
              </Collapse>
            </div>
          ) : null}
        {!props.favor.repaid && !props.owedByMe ? (
          <Button
            size="sm"
            variant="outline-primary"
            onClick={() => props.handleMarkAsRepaid(props.favor._id)}
          >
            Mark as repaid
          </Button>
        ) : null}
        {props.favor.repaid && props.favor.hasOwnProperty('repaidImage') ? (
          <div>
            <Button
              size="sm"
              variant="outline-primary"
              onClick={() => {
                setOpenRepaidProof(!openRepaidProof);
                setOpenUpload(false);
                setOpenSubmitProof(false);
              }}
              aria-controls="favor-repaid-proof"
              aria-expanded={openRepaidProof}
            >
              See repaid proof
            </Button>
            <Collapse in={openRepaidProof}>
              <div id="favor-repaid-proof-image">
                <br/>
                <img src={props.favor.repaidImage} 
                  alt="favor-repaid-proof"
                  width="400" height="200"
                />
                <br/>
              </div>
            </Collapse>
          </div>
        ) : null}
        {props.favor.hasOwnProperty('submitImage') ? (
          <div>
            <Button
              size="sm"
              variant="outline-primary"
              onClick={() => {
                setOpenSubmitProof(!openSubmitProof);
                setOpenRepaidProof(false);
                setOpenUpload(false);
              }}
              aria-controls="favor-submit-proof"
              aria-expanded={openSubmitProof}
            >
              See creation proof
            </Button>
            <Collapse in={openSubmitProof}>
              <div id="favor-submit-proof-image">
                <br/>
                <img src={props.favor.submitImage} 
                  alt="favor-submit-proof"
                  width="400" height="200"
                />
                <br/>
              </div>
            </Collapse>
          </div>
        ) : null}
      </td>
    </tr>
  );
}

export default Favor;
