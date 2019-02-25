import React from 'react'
import { Bar } from 'react-chartjs-2';
import Grid from '../layout/grid'
import './chart.css'

export default props => {
    if (!props.data) {
        return <React.Fragment></React.Fragment>
    }

    return (
        <Grid cols={props.cols}>
            <div className="chart_border">
                <Bar
                    data={props.data}
                    width={100}
                    height={20}
                    options={{
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
                    }}
                />
            </div>
        </Grid >
    )
}