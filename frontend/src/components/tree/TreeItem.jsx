import React from 'react'
import './TreeItem.css'

export default props => (
    <div className="rowItem">
        <a onClick={() => props.onClick(props.id)}><i id={`link_${props.id}`} className="fa fa-angle-down ml-2" hidden={props.hidden}></i></a>
        <div className="ml-2">{props.description}</div> 
        <div className="slidecontainer">
            <input type="range" min="0" max="100" value="0" className="slider" id={`slide_${props.id}`} value={props.answerList[props.id]}  onChange={e => props.updateSlideBar(e, props.answerList)}/>
        </div>
    </div>
)
    
