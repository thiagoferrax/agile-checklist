import React from 'react'
import { Line } from 'react-chartjs-2';
import Grid from '../layout/grid'
import './chart.css'

export default props => {
    if (!props.data) {
        return <React.Fragment></React.Fragment>
    }

    let options = {
        legend: {
            position: 'right',
        },
        scales: {
            yAxes: [{
                ticks: {
                    max: 10,
                    min: 0,
                    stepSize: 2
                }
            }]
        }
    }

    if (props.options) {
        options = props.options
    }

    let height = 40
    if (props.height) {
        height = props.height
    }

    return (
        <Grid cols={props.cols}>
            <div className="line_chart">
                <Line
                    data={props.data}
                    width={100}
                    height={height}
                    options={options}
                />
            </div>
        </Grid >
    )
}