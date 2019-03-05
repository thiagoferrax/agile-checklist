import React from 'react'

export default props => (
    <li className='treeview'> 
        <a href={props.path}> 
            <i className={`icon ion-md-${props.icon}`}></i> <span>&nbsp;&nbsp;&nbsp;{props.label}</span>
            <i className='fa fa-angle-left pull-right'></i>
        </a>
        <ul className='treeview-menu'> 
            {props.children}
        </ul>
    </li>
)