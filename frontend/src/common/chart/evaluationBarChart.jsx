import React from 'react'
import BarChart from './barChart'
import './chart.css'

export default props => {
    const data = getBarChartData(props.evaluations, props.project.id)

    if(!data) {
        return <React.Fragment/>
    }

    return (<BarChart cols={props.cols} data={data} project={props.project.name} summaryData={props.summaryData}/>)
}

const getDataSet = (datasets, checklistId) => {
    return datasets.filter(dataset => dataset.label === checklistId)
}

const getChartColor = (index) => {

    const colors = [
        'rgb(0, 192, 239, .4)',
        'rgb(216, 27, 96, .4)',
        'rgb(104,115,140, .4)',
        'rgb(48, 187, 187, .4)',
        'rgb(11, 120, 206, .4)',
        'rgb(255, 119, 1, .4)',
        'rgb(17, 17, 17, .4)',
        'rgb(96, 92, 168, .4)'
        
    ]

    if (index > colors.length) {
        index -= colors.length
    }
    return colors[index]
}

const getChartBorderColor = (index) => {
    const colors = [
        'rgb(0, 192, 239)',
        'rgb(216, 27, 96)',
        'rgb(104,115,140)',
        'rgb(48, 187, 187)',
        'rgb(11, 120, 206)',
        'rgb(255, 119, 1)',
        'rgb(17, 17, 17)',
        'rgb(96, 92, 168)'
    ]

    if (index > colors.length) {
        index -= colors.length
    }
    return colors[index]
}

const getBarChartData = (evaluations, projectId) => {
    const projectEvaluations =
        evaluations.filter(evaluation => evaluation.projectId === projectId).sort((e1, e2) => e1.sprint - e2.sprint)

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
                borderWidth: 1.5,
                backgroundColor: getChartColor(color),
                borderColor: getChartBorderColor(color)
            })
            color++
        }

        return map
    }, { labels: [], datasets: [] })

    return barChartData
}