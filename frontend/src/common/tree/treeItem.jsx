import React from 'react'
import './treeItem.css'
import If from '../operator/if'

export default props => (
    <div className="treeItem">
        <If test={!props.iconHidden}>
            <a onClick={() => props.onClick(props.id)}><i id={`link_${props.id}`} 
                className={`fa fa-angle-${props.shrink ? 'right' : 'down'} ml-2`} hidden={props.iconHidden}></i></a>
        </If>    
        <div className="treeItemDescription">{props.description}</div> 
        {props.children}        
    </div>
)

const toggleIcon = nodeId => { 
    const downIcon = 'fa fa-angle-down ml-2'
    const linkIcon  = document.getElementById(`link_${nodeId}`)
    linkIcon.className = linkIcon.className === downIcon ? 'fa fa-angle-right ml-2' : downIcon
}

export {toggleIcon}