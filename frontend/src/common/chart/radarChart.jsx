import React from 'react'
import { Radar } from 'react-chartjs-2';
import Grid from '../layout/grid'
import If from '../operator/if'
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

    return (
        <Grid cols={props.cols}>
            <div className="radar_chart">
                <Radar
                    data={props.data}
                    width={100}
                    height={40}
                    options={options}
                />
            </div>
        </Grid >
    )
}