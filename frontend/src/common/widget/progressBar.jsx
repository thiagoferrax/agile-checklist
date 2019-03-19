import React from 'react'
import './progressBar.css'

export default props => {
    const getColor = (value) => {
        let color = ''
        if (value === null) {
            color = 'gray_pb'
        } else if (value == 0) {
            color = 'red_pb'
        } else if (value < 3) {
            color = 'orange_pb'
        } else if (value < 5) {
            color = 'light_orange_pb'
        } else if (value == 5) {
            color = 'yellow_pb'
        } else if (value < 8) {
            color = 'yellow_green_pb'
        } else if (value < 10) {
            color = 'light_green_pb'
        } else if (value == 10) {
            color = 'green_pb'
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