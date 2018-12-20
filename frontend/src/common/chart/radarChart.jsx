import React, { Component } from 'react'
import { Radar } from 'react-chartjs-2';
import Grid from '../layout/grid'

export default class RadarChart extends Component {    
    componentWillMount() {
        this.setState({chartData:this.props.data})
    }

    render() {
        return (
            <Grid cols={this.props.cols}>
                <div className="box box-default">
                    <div className="box-body">
                        <div className="chart">
                            <Radar
                                data={this.state.chartData}
                                width={100}
                                height={50}
                                options={{
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
                                  }}
                            />
                        </div>
                    </div>
                </div>
            </Grid>
        )
    }
}