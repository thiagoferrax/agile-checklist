import React from 'react'
import './progressBar.css'

export default props => {
    const getColor = (value) => {
        let color = ''
        if (value === null) {
            color = 'gray_'
        } else if (value == 0) {
            color = 'red_'
        } else if (value < 3) {
            color = 'orange_'
        } else if (value < 5) {
            color = 'light_orange_'
        } else if (value == 5) {
            color = 'yellow_'
        } else if (value < 8) {
            color = 'yellow_green_'
        } else if (value < 10) {
            color = 'light_green_'
        } else if (value == 10) {
            color = 'green_'
        }
        return color
    }

    return (
        <div className="progress">
            <div
                className={`progress-bar ${getColor(props.score)}`}
                role="progressbar"
                aria-valuenow={props.completion}
                aria-valuemin="0" aria-valuemax="100"
                style={{ width: props.completion + '%' }}>
            </div>
        </div>
    )
}