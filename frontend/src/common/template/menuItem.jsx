import React from 'react'
import { Link } from 'react-router-dom'

export default props => (
    <li> 
        <Link to={props.path} onClick={() => props.onItemClick && props.onItemClick()}>
            <i className={`icon ion-md-${props.icon}`}></i> <span>&nbsp;&nbsp;{props.label}</span>
        </Link>
    </li>
)