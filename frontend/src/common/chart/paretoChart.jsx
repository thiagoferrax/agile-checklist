import React from 'react'
import ParetoChart from 'pareto-chart';
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
            icon='fa fa-line-chart'
            title={`PARETO - ${props.project}`}
            footerText='Number of items (average score <= 5.0) per category'>
            <ParetoChart
                lineLabel="Accumulated"
                width={100}
                height={20}
                data={props.data} />
        </Chart>
    )
}