import React from 'react'
import BarChart from './barChart'

export default props => {
    const data = getBarChartData(props.evaluations, props.project.id)
    return (<BarChart cols={props.cols} data={data} />)
}

const getDataSet = (datasets, checklistId) => {
    return datasets.filter(dataset => dataset.label == checklistId)
}

const getChartColor = (index) => {
    const colors = ['#33c9dd', '#c9dd33', '#33dd9c', '#3374dd', '#dd9c33', '#113166', '#dd4733', '#dd33c9']

    if (index > colors.length) {
        index -= colors.length
    }
    return colors[index]
}

const getBarChartData = (evaluations, projectId) => {
    const projectEvaluations =
        evaluations.filter(evaluation => evaluation.projectId === projectId).sort((e1, e2) => e1.sprint - e2.sprint)

    console.log('projectEvaluations', projectEvaluations.length)


    if (!projectEvaluations.length) {
        return 
    }

    let color = 0
    const barChartData = projectEvaluations.reduce((map, evaluation) => {
        const sprint = 'Sprint ' + evaluation.sprint
        const checklist = evaluation.checklistDescription

        if (!map.labels.includes(sprint)) {
            map.labels.push(sprint)
        }

        const dataset = getDataSet(map.datasets, checklist)
        const index = map.labels.indexOf(sprint)
        if (dataset && dataset.length) {
            dataset[0].data[index] = evaluation.score
        } else {
            let data = []
            data[index] = evaluation.score
            map.datasets.push({
                label: checklist,
                data,
                backgroundColor: getChartColor(color++)
            })
        }

        return map
    }, { labels: [], datasets: [] })

    return barChartData
}