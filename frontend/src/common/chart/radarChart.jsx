import React from 'react'
import { Radar } from 'react-chartjs-2';
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
            <div className="box box-primary">
                <div className="box-header with-border">
                <i className="icon ion-md-pulse"></i>                
                    <h3 className="box-title">&nbsp;&nbsp;&nbsp;RADAR - {props.project}</h3>

                    <div className="box-tools pull-right">
                        <button type="button" className="btn btn-box-tool" data-widget="collapse"><i className="fa fa-minus"></i>
                        </button>
                    </div>
                </div>
                <div className="box-body">
                    <div className="chart">
                        <Radar
                            data={props.data}
                            width={100}
                            height={50}
                            options={options}
                        />
                    </div>
                </div>
            </div>
        </Grid >
    )
}