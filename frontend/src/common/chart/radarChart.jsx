import React from 'react'
import { Radar } from 'react-chartjs-2';
import Chart from './chart'

export default props => {
    if (!props.data) {
        return <React.Fragment></React.Fragment>
    }

    let options = {
        legend: { position: 'right' },
        scale: {
            ticks: {
                beginAtZero: true,
                max: 10,
                stepSize: 2,
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
        <Chart
            cols={props.cols}
            icon='fa fa-area-chart'
            title={`RADAR - ${props.project}`}
            footerText='Radar of average score per category'>
            <Radar
                data={props.data}
                width={100}
                height={50}
                options={options}
            />
        </Chart>
    )
}