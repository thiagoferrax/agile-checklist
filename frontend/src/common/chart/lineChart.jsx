import React from 'react'
import { Line } from 'react-chartjs-2';
import Chart from './chart'

export default props => {
    if (!props.data) {
        return <React.Fragment></React.Fragment>
    }

    let options = props.options || {
        legend: { position: 'right' },
        scales: {
            pointRadius: 1,
            xAxes: [{
                gridLines: { display: false }
            }],
            yAxes: [{
                gridLines: { display: false },
                ticks: { max: 10, min: 0, stepSize: 2 }
            }]
        }
    }

    let height = props.height || 45

    return (
        <Chart
            cols={props.cols}
            icon='fa fa-area-chart'
            title={`COMPARISON - ${props.project}`}
            footerText='Comparison of average score per category'>
            <Line
                data={props.data}
                width={100}
                height={height}
                options={options}
            />
        </Chart>
    )
}