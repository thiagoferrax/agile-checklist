import React, { Component } from 'react'
import { Line } from 'react-chartjs-2';
import Grid from '../layout/grid'
import If from '../operator/if'
import './chart.css'

export default class LineChart extends Component {
    componentWillMount() {
        this.setState({ chartData: this.props.data })
    }

    render() {
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

        if (this.props.options) {
            options = this.props.options
        }

        let height = 50
        if (this.props.height) {
            height = this.props.height
        }

        return (
            <If test={this.state.chartData}>
                <Grid cols={this.props.cols}>
                    <div className="line_chart">
                        <Line
                            data={this.state.chartData}
                            width={100}
                            height={height}
                            options={options}
                        />
                    </div>
                </Grid>
            </If>
        )
    }
}