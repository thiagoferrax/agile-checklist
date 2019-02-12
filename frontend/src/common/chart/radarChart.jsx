import React, { Component } from 'react'
import { Radar } from 'react-chartjs-2';
import Grid from '../layout/grid'
import If from '../operator/if'

export default class RadarChart extends Component {
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

        return (
            <If test={this.state.chartData}>
                <Grid cols={this.props.cols}>
                    <div className="box box-default">
                        <div className="box-body">
                            <div className="chart">
                                <Radar
                                    data={this.state.chartData}
                                    width={100}
                                    height={50}
                                    options={options}
                                />
                            </div>
                        </div>
                    </div>
                </Grid>
            </If>
        )
    }
}