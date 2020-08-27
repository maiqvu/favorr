import React, { Component } from 'react';
import axios from 'axios';

export default class PublicRequestPage extends Component {
    constructor(props) {
        super(props);

        this.state = {
            publicRequestList: []
        }
    }

    componentDidMount() {
        axios.get("http://localhost:8081/api/publicRequest/publicRequest")
          .then((response) => {
            this.setState({publicRequestList: response.data})
          })
          .catch(err => console.error(err));
    }

    render() {
        return (
            <div>
                <h3>View all Public Requests</h3>
                <table>
                    <thead>
                        <tr>
                            <th>Creator</th>
                            <th>Request Detail</th>
                            <th>Reward Item</th>
                        </tr>
                    </thead>
                    <tbody>
                        { this.state.publicRequestList.map((item) => 
                            <tr>
                                <td key={item.creator}>{item.creator}</td>
                                <td key={item.requestDetail}>{item.requestDetail}</td>
                                {item.reward.map((reward) => <td key={reward.item}>{reward.item}</td>)}
                            </tr>)
                        }
                    </tbody>
                </table>
            </div>
        )
    }
}
