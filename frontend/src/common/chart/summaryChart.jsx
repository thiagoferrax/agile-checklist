import React from 'react'

export default props => {
    if (!props.summaryData) {
        return <React.Fragment></React.Fragment>
    }

    const index = 0

    const getPercentageColor = percentageDirection => {
        let color = 'mute'
        if (percentageDirection === 'up') {
            color = 'green'
        } else if (percentageDirection === 'down') {
            color = 'red'
        }
        return color
    }
    return (
        <div className="row">
            <div className="col-sm-2 col-xs-6">
                <div className="description-block border-right">
                    <span className="fa fa-chevron-right"></span><span className="fa fa-chevron-right"></span>
                    <h5 className="description-header">{props.summaryData[index].checklist}</h5>
                    <span className="description-text">CHECKLIST</span>
                </div>
            </div>
            <div className="col-sm-2 col-xs-6">
                <div className="description-block border-right">
                    <span class={`description-percentage text-${getPercentageColor(props.summaryData[index].currentScore.percentageDirection)}`}><i class={`fa fa-caret-${props.summaryData[index].currentScore.percentageDirection}`}></i> {props.summaryData[index].currentScore.percentage}%</span>
                    <h5 className="description-header">{props.summaryData[index].currentScore.value}</h5>
                    <span className="description-text">CURRENT SCORE</span>
                </div>
            </div>
            <div className="col-sm-2 col-xs-6">
                <div className="description-block border-right">
                    <span class={`description-percentage text-${getPercentageColor(props.summaryData[index].teamParticipation.percentageDirection)}`}><i class={`fa fa-caret-${props.summaryData[index].teamParticipation.percentageDirection}`}></i> {props.summaryData[index].teamParticipation.percentage}%</span>
                    <h5 className="description-header">{`${props.summaryData[index].teamParticipation.value}%`}</h5>
                    <span className="description-text">TEAM PARTICIPATION</span>
                </div>
            </div>
            <div className="col-sm-2 col-xs-6">
                <div className="description-block border-right">
                    <span class="description-percentage text-muted">{`Sprint ${props.summaryData[index].minimumScore.sprint}`}</span>
                    <h5 className="description-header">{props.summaryData[index].minimumScore.value}</h5>
                    <span className="description-text">MINIMUM SCORE</span>
                </div>
            </div>
            <div className="col-sm-2 col-xs-6">
                <div className="description-block">
                    <span class="description-percentage text-muted">{`Sprint ${props.summaryData[index].maximumScore.sprint}`}</span>
                    <h5 className="description-header">{props.summaryData[index].maximumScore.value}</h5>
                    <span className="description-text">MAXIMUM SCORE</span>
                </div>
            </div>
            <div className="col-sm-2 col-xs-6">
                <div className="description-block border-right">
                    <span class={`description-percentage text-${getPercentageColor(props.summaryData[index].totalAverage.percentageDirection)}`}><i class={`fa fa-caret-${props.summaryData[index].totalAverage.percentageDirection}`}></i> {props.summaryData[index].totalAverage.percentage}%</span>
                    <h5 className="description-header">{props.summaryData[index].totalAverage.value}</h5>
                    <span className="description-text">TOTAL AVERAGE</span>
                </div>
            </div>
        </div>
    )
}