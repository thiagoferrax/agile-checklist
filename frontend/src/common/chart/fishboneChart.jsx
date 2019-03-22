import React from 'react'
import FishboneChart from 'fishbone-chart'
import Chart from './chart'

export default props => {
    if (!props.data) {
        return <React.Fragment></React.Fragment>
    }

    const sprints = Object.values(props.data)
    const checklists = Object.values(sprints)
    let hasData = false
    checklists.forEach(data => {
        if (Object.values(data).length > 0) {
            hasData = true
        }
    })

    if (!hasData) {
        return <React.Fragment></React.Fragment>
    }

    return (
        <Chart
            cols={props.cols}
            icon='fa fa-bug'
            title={`CAUSE AND EFFECT - ${props.project}`}
            footerText='Radar of average score per category'>
             <FishboneChart data={props.data} />
        </Chart>
    )
}