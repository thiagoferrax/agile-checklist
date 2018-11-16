import React from 'react'
import './TreeItem.css'

export default props => (
    <div className="treeItem">
        <a onClick={() => props.onClick(props.id)}><i id={`link_${props.id}`} className="fa fa-angle-down ml-2" hidden={props.iconHidden}></i></a>
        <div className="ml-2">{props.description}</div> 
        {props.children}        
    </div>
)

const toggleIcon = nodeId => { 
    const linkIcon  = document.getElementById(`link_${nodeId}`)
    linkIcon.className = linkIcon.className === 'fa fa-angle-down ml-2' ? 'fa fa-angle-right ml-2' : 'fa fa-angle-nodewn ml-2'
}

export {toggleIcon}