import React from 'react'
import './slideBar.css'
import If from '../operator/if'

const MIN = 0
const MAX = 10

export default props => {
    return (
        <If test={!props.hideSlideBar}>
            <div className="slidecontainer ">
                <input className={`slider ${getColor(props.node.value)}`} type="range" min={MIN} max={MAX}
                    id={`slide_${props.node.id}`} value={props.node.value || MIN} onChange={e => handleChange(e, props)} />
            </div>
        </If>        
    )
}

const handleChange = (event, props) => {
    if (props.onChange) {
        props.onChange(event.target.value, props.node)
    }
}

const getColor = (value) => {
    let color = ''
    if (value === null) {
        color = 'gray'
    } else if (value == 0) {
        color = 'red'
    } else if (value < 3) {
        color = 'orange'
    } else if (value < 5) {
        color = 'light_orange'
    } else if (value == 5) {
        color = 'yellow'
    } else if (value < 8) {
        color = 'yellow_green'
    } else if (value < 10) {
        color = 'light_green'
    } else if (value == 10) {
        color = 'green'
    }
    return color
}