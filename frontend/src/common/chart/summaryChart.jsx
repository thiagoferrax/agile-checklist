import React, { Component } from 'react'
import ReactCSSTransitionGroup from 'react-addons-css-transition-group'
import Grid from '../layout/grid'
import If from '../operator/if'

const INITIAL_STATE = { index: 0, animation: false }

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
        this.setState({ index, animation: true })
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
        
        let grids = ['12 3', '6 2', '6 2', '6 2', '6 3']
        if (this.props.summaryData.length > 1) {
            grids = ['11 2', '6 2', '6 2', '6 2', '5 2']
        }

        return (
            <div className="row">
                <If test={this.props.summaryData.length > 1} >
                    <Grid cols='1'>
                        <div className="carousel_controller">
                            <a href="javascript:;" onClick={() => this.nextChecklist(-1)}>
                                <span className="fa fa-angle-left fa-2x"></span>
                            </a>
                        </div>
                    </Grid>
                </If>
                <ReactCSSTransitionGroup key={`animation_${this.props.title}_${this.state.index}`}
                    transitionName="animation"
                    transitionAppear={true}
                    transitionAppearTimeout={250} 
                    transitionEnterTimeout={250} 
                    transitionLeaveTimeout={250} 
                    transitionEnter={true}
                    transitionLeave={true} >
                    <Grid cols={grids[0]}>
                        <div className="description-block border-right carousel-inner">
                            <span className="description-percentage text-muted">Sprint {this.props.summaryData[this.state.index].currentSprint}</span>
                            <h5 className="description-header">{this.props.summaryData[this.state.index].checklist}</h5>
                            <span className="description-text">MY CHECKLIST</span>
                        </div>
                    </Grid>
                    <Grid cols={grids[1]}>
                        <div className="description-block border-right">
                            <span className={`description-percentage text-${this.getPercentageColor(this.props.summaryData[this.state.index].currentScore.percentageDirection)}`}><i className={`fa fa-caret-${this.props.summaryData[this.state.index].currentScore.percentageDirection}`}></i> {this.props.summaryData[this.state.index].currentScore.percentage}%</span>
                            <h5 className="description-header">{this.props.summaryData[this.state.index].currentScore.value}</h5>
                            <span className="description-text">CURRENT SCORE</span>
                        </div>
                    </Grid>
                    <Grid cols={grids[2]}>
                        <div className="description-block border-right">
                            <span className={`description-percentage text-${this.getPercentageColor(this.props.summaryData[this.state.index].teamParticipation.percentageDirection)}`}><i className={`fa fa-caret-${this.props.summaryData[this.state.index].teamParticipation.percentageDirection}`}></i> {this.props.summaryData[this.state.index].teamParticipation.percentage}%</span>
                            <h5 className="description-header">{`${this.props.summaryData[this.state.index].teamParticipation.value}%`}</h5>
                            <span className="description-text">TEAM PARTICIPATION</span>
                        </div>
                    </Grid>
                    <Grid cols={grids[3]}>
                        <div className="description-block border-right">
                            <span className="description-percentage text-muted">{`Sprint ${this.props.summaryData[this.state.index].maximumScore.sprint}`}</span>
                            <h5 className="description-header">{this.props.summaryData[this.state.index].maximumScore.value}</h5>
                            <span className="description-text">MAXIMUM SCORE</span>
                        </div>
                    </Grid>
                    <Grid cols={grids[4]}>
                        <div className="description-block">
                            <span className={`description-percentage text-${this.getPercentageColor(this.props.summaryData[this.state.index].totalAverage.percentageDirection)}`}><i className={`fa fa-caret-${this.props.summaryData[this.state.index].totalAverage.percentageDirection}`}></i> {this.props.summaryData[this.state.index].totalAverage.percentage}%</span>
                            <h5 className="description-header">{this.props.summaryData[this.state.index].totalAverage.value}</h5>
                            <span className="description-text">TOTAL AVERAGE</span>
                        </div>
                    </Grid>
                </ReactCSSTransitionGroup >
                <If test={this.props.summaryData.length > 1} >
                    <Grid cols='1'>
                        <div className="carousel_controller">
                            <a href="javascript:;" onClick={() => this.nextChecklist(1)}>
                                <span className="fa fa-angle-right fa-2x"></span>
                            </a>
                        </div>
                    </Grid>
                </If>
            </div>

        )
    }
}