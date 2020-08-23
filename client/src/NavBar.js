import React from 'react';
import { Link } from 'react-router-dom';

const NavBar = () => (
    <nav>
        <ul>
            <li>
                <Link to="/">Public Request</Link>
            </li>
            <li>
                <Link to="/createPublicRequest">Create Public Request</Link>
            </li>
        </ul>
    </nav>
);

export default NavBar;
