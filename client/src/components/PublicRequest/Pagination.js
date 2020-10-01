import React from 'react';
import Button from 'react-bootstrap/Button';

const Pagination = (props) => {
    const totalPageCount = Math.ceil(props.count / props.limitPerPage);
    return (
        <div>
            {props.count > props.limitPerPage ? (
                <div className="float-right">
                    Page {props.currentPage} of {totalPageCount}
                    &nbsp;
                    <Button variant="outline-primary" onClick={props.previousPage}>
                        &laquo;
                    </Button>
                    &nbsp;
                    <Button variant="outline-primary" onClick={props.nextPage}>
                        &raquo;
                    </Button>
                </div>
            ) : null}
        </div>
    )
}

export default Pagination;
