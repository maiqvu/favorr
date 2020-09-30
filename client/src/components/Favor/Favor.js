import React, { useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import { Button } from 'react-bootstrap';

const Favor = (props) => {
  const authContext = useContext(AuthContext);
  
  return (
    <tr>
      <td width="20%">{props.favor.description}</td>
      <td width="20%">
        {props.owedByMe
        ? authContext.user.username
        : props.favor.owedBy.username}
      </td>
      <td width="20%">
        {props.owedByMe
        ? props.favor.owedTo.username
        : authContext.user.username}
      </td>
      <td width="20%">{props.favor.repaid ? 'Repaid' : 'Pending'}</td>
      <td width="20%">
        {props.favor.repaid ? null : <Button
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
