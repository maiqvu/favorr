import React, { useState } from 'react';
import { Button, Collapse } from 'react-bootstrap';

import FavorService from './FavorService';

const Favor = (props) => {
  // const [ open, setOpen ] = useState(false);
  const [ openUpload, setOpenUpload ] = useState(false);
  const [ image, setImage ] = useState('');
  
  return (
    <tr>
      <td width="30%">{props.favor.description}</td>
      <td width="20%">
        {props.owedByMe ? props.favor.owedTo.username : props.favor.owedBy.username}
      </td>
      <td width="15%">{props.favor.repaid ? 'Repaid' : 'Pending'}</td>
      <td width="35%" className="text-right">
        {!props.favor.repaid && props.owedByMe ? (
            <div>
              <Button
                size="sm"
                variant="outline-primary"
                onClick={() => setOpenUpload(!openUpload)}
              >
                Mark as repaid
              </Button>
              <Collapse in={openUpload}>
                <div id="favor-repaid-proof">
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
                    onClick={() => {
                        props.handleMarkAsRepaid(props.favor._id, image);
                        props.refreshTableTrigger();
                      }}>Upload</Button>
                  <br/>
                </div>
              </Collapse>
            </div>
          ) : null
        }
      </td>
    </tr>
  );
}

export default Favor;

{/* <>
          <Button
            size="sm"
            variant="outline-primary"
            onClick={() => setOpen(!open)}
            aria-controls="favor-repaid-proof"
            aria-expanded={open}
          >
            See proof
          </Button>
          <Collapse in={open}>
            <div id="favor-repaid-proof">
              <br/>
              <img src={props.favor.image} 
                alt="favor-repaid-proof"
                width="400" height="200"
              />
              <br/>
            </div>
          </Collapse>
        </> : 
        <Button
          size="sm"
          variant="outline-primary"
          onClick={() => props.handleMarkAsRepaid(props.favor._id, props.favor.repaid)}
        >
          Mark as repaid
        </Button> */}