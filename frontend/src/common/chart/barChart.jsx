import React from 'react'
import { Bar } from 'react-chartjs-2'
import Chart from './chart'

export default props => {
    if (!props.data) {
        return <React.Fragment></React.Fragment>
    }

    return (
        <Chart
            cols={props.cols}
            icon={'fa fa-bar-chart'}
            title={`PROGRESS - ${props.project}`}
            bodyTitle={`Average score per sprint: ${props.dateInterval}`}
            summaryData={props.summaryData}>
            <Bar
                data={props.data}
                width={100}
                height={20}
                options={{
                    legend: {
                        position: 'right',
                    },
                    scales: {
                        xAxes: [{
                            gridLines: {
                                display: false
                            }
                        }],
                        yAxes: [{
                            ticks: {
                                max: 10,
                                min: 0,
                                stepSize: 2
                            },
                            gridLines: {
                                display: false
                            }
                        }]
                    }

                }}
            />
        </Chart>
    )
}