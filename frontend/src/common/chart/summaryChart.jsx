import React, { Component } from 'react'
import { fadeIn } from 'react-animations'
import Radium, { StyleRoot } from 'radium'
import Grid from '../layout/grid'
import If from '../operator/if'


const INITIAL_STATE = { index: 0 }

export default class SummaryChart extends Component {
    constructor(props) {
        super(props)
        this.state = INITIAL_STATE
    }

    nextChecklist(step) {
        let index = this.state.index
        index += step

        if (!this.props.summaryData[index]) {
            index = step > 0 ? 0 : this.props.summaryData.length - 1
        }
        this.setState({ index })
    }

    getPercentageColor = percentageDirection => {
        let color = 'yellow'
        if (percentageDirection === 'up') {
            color = 'green'
        } else if (percentageDirection === 'down') {
            color = 'red'
        }
        return color
    }

    render() {
        if (!this.props.summaryData) {
            return <React.Fragment></React.Fragment>
        }

        const styles = {
            fadeIn: {
                animation: 'x 1.5s',
                animationName: Radium.keyframes(fadeIn, 'fadeIn')
            }
        }
        return (
            <StyleRoot>
                <div className="row" style={styles.fadeIn}>
                    <Grid cols='6 2'>
                        <div className="description-block border-right carousel-inner">
                            <span className="description-percentage text-muted">Sprint {this.props.summaryData[this.state.index].currentSprint}</span>
                            <h5 className="description-header">{this.props.summaryData[this.state.index].checklist}</h5>
                            <span className="description-text">MY CHECKLIST</span>

                            <If test={this.props.summaryData.length > 1} >
                                <a class="left carousel-control" href="javascript:;" onClick={() => this.nextChecklist(-1)} data-slide="prev">
                                    <span class="icon ion-ios-arrow-back"></span>
                                    <span class="icon ion-ios-arrow-back"></span>
                                    <span class="sr-only">Previous</span>
                                </a>
                                <a class="right carousel-control" href="javascript:;" onClick={() => this.nextChecklist(1)} data-slide="next">
                                    <span class="icon ion-ios-arrow-forward"></span>
                                    <span class="icon ion-ios-arrow-forward"></span>
                                    <span class="sr-only">Next</span>
                                </a>
                            </If>
                        </div>
                    </Grid>
                    <Grid cols='6 2'>
                        <div className="description-block border-right">
                            <span className={`description-percentage text-${this.getPercentageColor(this.props.summaryData[this.state.index].currentScore.percentageDirection)}`}><i className={`fa fa-caret-${this.props.summaryData[this.state.index].currentScore.percentageDirection}`}></i> {this.props.summaryData[this.state.index].currentScore.percentage}%</span>
                            <h5 className="description-header">{this.props.summaryData[this.state.index].currentScore.value}</h5>
                            <span className="description-text">CURRENT SCORE</span>
                        </div>
                    </Grid>
                    <Grid cols='6 2'>
                        <div className="description-block border-right">
                            <span className={`description-percentage text-${this.getPercentageColor(this.props.summaryData[this.state.index].teamParticipation.percentageDirection)}`}><i className={`fa fa-caret-${this.props.summaryData[this.state.index].teamParticipation.percentageDirection}`}></i> {this.props.summaryData[this.state.index].teamParticipation.percentage}%</span>
                            <h5 className="description-header">{`${this.props.summaryData[this.state.index].teamParticipation.value}%`}</h5>
                            <span className="description-text">TEAM PARTICIPATION</span>
                        </div>
                    </Grid>
                    <Grid cols='6 2'>
                        <div className="description-block border-right">
                            <span className="description-percentage text-muted">{`Sprint ${this.props.summaryData[this.state.index].minimumScore.sprint}`}</span>
                            <h5 className="description-header">{this.props.summaryData[this.state.index].minimumScore.value}</h5>
                            <span className="description-text">MINIMUM SCORE</span>
                        </div>
                    </Grid>
                    <Grid cols='6 2'>
                        <div className="description-block">
                            <span className="description-percentage text-muted">{`Sprint ${this.props.summaryData[this.state.index].maximumScore.sprint}`}</span>
                            <h5 className="description-header">{this.props.summaryData[this.state.index].maximumScore.value}</h5>
                            <span className="description-text">MAXIMUM SCORE</span>
                        </div>
                    </Grid>
                    <Grid cols='6 2'>
                        <div className="description-block border-right">
                            <span className={`description-percentage text-${this.getPercentageColor(this.props.summaryData[this.state.index].totalAverage.percentageDirection)}`}><i className={`fa fa-caret-${this.props.summaryData[this.state.index].totalAverage.percentageDirection}`}></i> {this.props.summaryData[this.state.index].totalAverage.percentage}%</span>
                            <h5 className="description-header">{this.props.summaryData[this.state.index].totalAverage.value}</h5>
                            <span className="description-text">TOTAL AVERAGE</span>
                        </div>
                    </Grid>
                </div>
            </StyleRoot>
        )
    }
}