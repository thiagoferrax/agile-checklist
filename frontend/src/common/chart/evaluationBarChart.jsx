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

    const colors = [
        'rgb(0, 192, 239, .4)',
        'rgb(221, 75, 57, .4)',
        'rgb(0, 166, 90, .4)',
        'rgb(243, 156, 18, .4)',
        'rgb(202, 25, 90, .4)',
        'rgb(85, 82, 153, .4)',
        'rgb(255, 119, 1, .4)'
    ]

    if (index > colors.length) {
        index -= colors.length
    }
    return colors[index]
}

const getChartBorderColor = (index) => {
    const colors = [
        'rgb(0, 192, 239)',
        'rgb(221, 75, 57)',
        'rgb(0, 166, 90)',
        'rgb(243, 156, 18)',
        'rgb(202, 25, 90)',
        'rgb(85, 82, 153)',
        'rgb(255, 119, 1)'
    ]

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
                borderWidth: 2,
                backgroundColor: getChartColor(color),
                borderColor: getChartBorderColor(color)
            })
            color++
        }

        return map
    }, { labels: [], datasets: [] })

    return barChartData
}