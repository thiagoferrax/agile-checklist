import React, { Component } from 'react'

const INITIAL_STATE = { index: 0 }

export default class SummaryChart extends Component {
    constructor(props) {
        super(props)
        this.state = INITIAL_STATE
    }

    nextChecklist() {
        let index = this.state.index
        index++
        if(!this.props.summaryData[index]) {
            index = 0
        }
        this.setState({ index })
    }

    getPercentageColor = percentageDirection => {
        let color = 'mute'
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
        return (
            <div className="row">
                <div className="col-sm-2 col-xs-6">
                    <div className="description-block border-right">
                        <button type="button" class="btn_ btn-default_" title="Next Checklist" onClick={() => this.nextChecklist()}><i class="fa fa-chevron-right"></i><i class="fa fa-chevron-right"></i></button>
                        <h5 className="description-header">{this.props.summaryData[this.state.index].checklist}</h5>
                        <span className="description-text">CHECKLIST</span>
                    </div>
                </div>
                <div className="col-sm-2 col-xs-6">
                    <div className="description-block border-right">
                        <span class={`description-percentage text-${this.getPercentageColor(this.props.summaryData[this.state.index].currentScore.percentageDirection)}`}><i class={`fa fa-caret-${this.props.summaryData[this.state.index].currentScore.percentageDirection}`}></i> {this.props.summaryData[this.state.index].currentScore.percentage}%</span>
                        <h5 className="description-header">{this.props.summaryData[this.state.index].currentScore.value}</h5>
                        <span className="description-text">CURRENT SCORE</span>
                    </div>
                </div>
                <div className="col-sm-2 col-xs-6">
                    <div className="description-block border-right">
                        <span class={`description-percentage text-${this.getPercentageColor(this.props.summaryData[this.state.index].teamParticipation.percentageDirection)}`}><i class={`fa fa-caret-${this.props.summaryData[this.state.index].teamParticipation.percentageDirection}`}></i> {this.props.summaryData[this.state.index].teamParticipation.percentage}%</span>
                        <h5 className="description-header">{`${this.props.summaryData[this.state.index].teamParticipation.value}%`}</h5>
                        <span className="description-text">TEAM PARTICIPATION</span>
                    </div>
                </div>
                <div className="col-sm-2 col-xs-6">
                    <div className="description-block border-right">
                        <span class="description-percentage text-muted">{`Sprint ${this.props.summaryData[this.state.index].minimumScore.sprint}`}</span>
                        <h5 className="description-header">{this.props.summaryData[this.state.index].minimumScore.value}</h5>
                        <span className="description-text">MINIMUM SCORE</span>
                    </div>
                </div>
                <div className="col-sm-2 col-xs-6">
                    <div className="description-block">
                        <span class="description-percentage text-muted">{`Sprint ${this.props.summaryData[this.state.index].maximumScore.sprint}`}</span>
                        <h5 className="description-header">{this.props.summaryData[this.state.index].maximumScore.value}</h5>
                        <span className="description-text">MAXIMUM SCORE</span>
                    </div>
                </div>
                <div className="col-sm-2 col-xs-6">
                    <div className="description-block border-right">
                        <span class={`description-percentage text-${this.getPercentageColor(this.props.summaryData[this.state.index].totalAverage.percentageDirection)}`}><i class={`fa fa-caret-${this.props.summaryData[this.state.index].totalAverage.percentageDirection}`}></i> {this.props.summaryData[this.state.index].totalAverage.percentage}%</span>
                        <h5 className="description-header">{this.props.summaryData[this.state.index].totalAverage.value}</h5>
                        <span className="description-text">TOTAL AVERAGE</span>
                    </div>
                </div>
            </div>
        )
    }
}