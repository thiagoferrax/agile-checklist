import React from 'react'
import { Bar } from 'react-chartjs-2'
import Grid from '../layout/grid'

export default props => {
    if (!props.data) {
        return <React.Fragment></React.Fragment>
    }

    return (
        <Grid cols={props.cols}>
            <div className="box box-primary">
                <div className="box-header with-border">
                    <i className="fa fa-bar-chart"></i>
                    <h3 className="box-title">&nbsp;&nbsp;PROGRESS - {props.project}</h3>

                    <div className="box-tools pull-right">
                        <button type="button" className="btn btn-box-tool" data-widget="collapse"><i className="fa fa-minus"></i>
                        </button>
                    </div>
                </div>
                <div className="box-body">
                    <div className="chart">
                        <Bar
                            data={props.data}
                            width={100}
                            height={15}
                            options={{
                                legend: {
                                    position: 'right',
                                },
                                scales: {
                                    xAxes: [{
                                        gridLines: {
                                            display:false
                                        }
                                    }],
                                    yAxes: [{
                                        ticks: {
                                            max: 10,
                                            min: 0,
                                            stepSize: 2
                                        },
                                        gridLines: {
                                            display:false
                                        }
                                    }]
                                }
                               
                            }}
                        />
                    </div>
                </div>
            </div>
        </Grid >
    )
}