import React from 'react'

export default props => {
    return (
        <li>
            <i className={`fa fa-${props.icon} bg-${props.color}`}></i>
            <div className="timeline-item">
                <span className="time"><i className="fa fa-clock-o"></i> {props.time}</span>
                <h3 className="timeline-header">{props.children}</h3>
            </div>
        </li>
    )
}