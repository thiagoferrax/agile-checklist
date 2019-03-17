import React from 'react'
import { Line } from 'react-chartjs-2';
import Grid from '../layout/grid'

export default props => {
    if (!props.data) {
        return <React.Fragment></React.Fragment>
    }

    let options = {
        legend: {
            position: 'right',
        },
        scales: {
            pointRadius: 1,
            xAxes: [{
                gridLines: {
                    display: false
                }
            }],
            yAxes: [{
                gridLines: {
                    display: false
                },
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

    let height = 45
    if (props.height) {
        height = props.height
    }

    return (
        <Grid cols={props.cols}>
            <div className="box box-primary">
                <div className="box-header with-border">
                    <i className="fa fa-area-chart"></i>
                    <h3 className="box-title">&nbsp;&nbsp;COMPARISON - {props.project}</h3>
                </div>
                <div className="box-body">
                    <div className="chart">
                        <Line
                            data={props.data}
                            width={100}
                            height={height}
                            options={options}
                        />
                    </div>
                </div>
                <div className="box-footer">
                    <i className="icon ion-md-information-circle-outline"></i> {'Comparison of average score per category'}
                </div>
            </div>
        </Grid >
    )
}