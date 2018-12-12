import React, { Component } from 'react'
import { Bar } from 'react-chartjs-2';
import Grid from '../layout/grid'

export default class BarChart extends Component {
    constructor(props) {
        super(props)

        this.state = {
            chartData: {
                labels: ['Sprint 1', 'Sprint 2', 'Sprint 3', 'Sprint 4', 'Sprint 5'],
                datasets: [
                    {
                        label: 'Scrum checklist',
                        data: [4, 6, 9, 7, 8],
                        backgroundColor: ['#00a65a', '#00a65a', '#00a65a', '#00a65a', '#00a65a']
                    },
                    {
                        label: 'Feedback 360',
                        data: [2, 3, 5],
                        backgroundColor: ['#b5bbc8', '#b5bbc8', '#b5bbc8']
                    }
                ]
            }
        }
    }


    render() {
        return (
            <Grid cols={this.props.cols}>
                <div className="box box-default">
                    <div className="box-body">
                        <div className="chart">
                            <Bar
                                data={this.state.chartData}
                                width={100}
                                height={100}
                                options={{}}
                            />
                        </div>
                    </div>
                </div>
            </Grid>
        )
    }
}