import React, { useState, useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import { Button, Collapse } from 'react-bootstrap';

const Favor = (props) => {
  const [ open, setOpen ] = useState(false);
  const authContext = useContext(AuthContext);
  
  return (
    <tr>
      <td width="30%">{props.favor.description}</td>
      <td width="20%">
        {props.owedByMe ? props.favor.owedTo.username : props.favor.owedBy.username}
      </td>
      <td width="15%">{props.favor.repaid ? 'Repaid' : 'Pending'}</td>
      <td width="35%" className="text-right">
        {props.favor.repaid ?
        <>
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
        </Button>}
      </td>
    </tr>
  );
}

export default Favor;
