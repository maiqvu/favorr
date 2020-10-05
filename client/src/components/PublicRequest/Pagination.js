import React, { useEffect, useState } from 'react';
import Button from 'react-bootstrap/Button';

const Pagination = (props) => {
  const [totalPageCount, setTotalPageCount] = useState(props.count);

  useEffect(() => {
    setTotalPageCount(
      Math.ceil(props.count / props.limit)
    );
    console.log(props.count);
  }, [props.count])
  
  const nextPage = () => {
      const newSkip = props.skip + props.limit
    if (newSkip < props.count) {
      props.onPageSelection(newSkip);
    }
  };

  const previousPage = () => {
    const newSkip = props.skip - props.limit
    if (newSkip >= 0) {
      props.onPageSelection(newSkip);
    }
  };

  return (
    <div>
      {props.count > props.limit ? (
        <div className="float-right">
          Page {props.currentPage} of {totalPageCount}
          &nbsp;
          <Button variant="outline-primary" onClick={previousPage}>
            &laquo;
          </Button>
          &nbsp;
          <Button variant="outline-primary" onClick={nextPage}>
            &raquo;
          </Button>
        </div>
      ) : null}
    </div>
  );
};

export default Pagination;
