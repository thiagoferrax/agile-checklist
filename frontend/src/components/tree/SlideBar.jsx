import React from 'react'
import './SlideBar.css'

export default props => {
    return (
        <div className="slidecontainer">
            <input className="slider" type="range" min="0" max="100" value="0" 
                id={`slide_${props.id}`} 
                value={props.value}  
                onChange={e => props.onChange(e, props.answers)}/>
        </div>
    )
}

const updateSlideBarColor = (checklistId, answer) => {
    const slideId = `slide_${checklistId}`
    document.getElementById(slideId).style = `background: ${getSlideBarColor(answer)} !important`
}

const getSlideBarColor = (answer) => {
    const colors = ['rgb(220, 53, 69)', '#FF3300', '#ff6600', '#ff9900', '#FFCC00', 'rgb(255, 193, 7)', '#ccff00', '#ccff00', '#99ff00', '#66ff00', 'rgb(40, 167, 69)'] 
    
    let color = colors[9]
    if(answer<=10) {
        color = colors[0]
    } else if(answer<=20) {
        color = colors[1]
    } else if(answer<=30) {
        color = colors[2]
    } else if(answer<=40) {
        color = colors[3]
    } else if(answer<=50) {
        color = colors[4]
    } else if(answer<=60) {
        color = colors[5]
    } else if(answer<=70) {
        color = colors[6]
    } else if(answer<=80) {
        color = colors[7]
    } else if(answer<=90) {
        color = colors[8]
    }     
    return color
}

export {updateSlideBarColor}