import React, { Component } from 'react';

export default class PublicRequestPage extends Component {
    render() {
        return (
            <div>
                <h3>View all Public Requests</h3>
            </div>
        )
    }
}

PublicRequestPage.defaultProps = {
    action: "",
    method: "get"
}