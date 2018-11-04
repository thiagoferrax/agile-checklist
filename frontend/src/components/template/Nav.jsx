import './Nav.css'
import React from 'react'
import { Link } from 'react-router-dom'

export default props =>
    <aside className="menu-area">
        <nav className="menu">
            {/* Refatorar em casa! */}
            <Link to="/">
                <i className="fa fa-home"></i> Home
            </Link>
            <Link to="/users">
                <i className="fa fa-users"></i> Users
            </Link>
            <Link to="/checklists">
                <i className="fa fa-check-square"></i> Checklists
            </Link>
            <Link to="/assessments">
                <i className="fa fa-check-square"></i> Assessments
            </Link>
        </nav>
    </aside>