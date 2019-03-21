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
        scale: {
            ticks: {
                beginAtZero: true,
                max: 10,
                stepSize: 2,
                userCallback: function (label, index, labels) {

                    return label;

                },
            }
        },
        tooltips: {
            enabled: true,
            callbacks: {
                label: function (tooltipItem, data) {
                    var datasetLabel = data.datasets[tooltipItem.datasetIndex].label || ''
                    return datasetLabel + ': ' + tooltipItem.yLabel
                }
            }
        }
    }

    return (
        <Grid cols={props.cols}>
            <div className="box box-primary">
                <div className="box-header with-border">
                    <i className="icon ion-md-pulse"></i>
                    <h3 className="box-title">&nbsp;&nbsp;RADAR - {props.project}</h3>
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
                <div className="box-footer">
                    <i className="icon ion-md-information-circle-outline"></i> {'Radar of average score per category'}
                </div>
            </div>
        </Grid >
    )
}