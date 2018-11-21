import React from 'react'
import './SlideBar.css'

const COLORS = ['#DC3545', '#FF3300', '#ff6600', '#ff9900', '#FFCC00', '#FFC107', '#ccff00', '#ccff00', '#99ff00', '#66ff00', '#28A745'] 
const MIN = 0
const MAX = 100

export default props => {
    return (
        <div className="slidecontainer">
            <input className="slider" type="range" min={MIN} max={MAX} value={MIN} 
                id={`slide_${props.id}`} 
                value={props.value}  
                onChange={e => props.onChange(e, props.answers)}/>
        </div>
    )
}

const updateSlideBarColor = (nodeId, answer) => {
    const slideId = `slide_${nodeId}`
    document.getElementById(slideId).style = `background: ${getSlideBarColor(answer)} !important`
}

const getSlideBarColor = (answer) => {
    let color = COLORS[9]
    if(answer<=10) {
        color = COLORS[0]
    } else if(answer<=20) {
        color = COLORS[1]
    } else if(answer<=30) {
        color = COLORS[2]
    } else if(answer<=40) {
        color = COLORS[3]
    } else if(answer<=50) {
        color = COLORS[4]
    } else if(answer<=60) {
        color = COLORS[5]
    } else if(answer<=70) {
        color = COLORS[6]
    } else if(answer<=80) {
        color = COLORS[7]
    } else if(answer<=90) {
        color = COLORS[8]
    }     
    return color
}

export {updateSlideBarColor}