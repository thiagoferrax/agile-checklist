import React, { Component } from 'react'
import RadarChart from './radarChart'

export default props => {     
    let options = {
        legend: {
            position: 'right',
        }
    }
    
    return (<RadarChart cols={props.cols} data={getRadarChartData(props.evaluations)} options={options}/>)
}

const getDataSet = (datasets, checklistId) => {
    return datasets.filter(dataset => dataset.label == checklistId)
}

const getChartColor = (index) => {
    const colors = ['#33c9dd', '#c9dd33', '#dd33c9', '#dd4733', '#33dd9c', '#3374dd', '#dd9c33', '#113166']

    if (index > colors.length) {
        index -= colors.length
    }
    return colors[index]
}

const getRadarChartData = (evaluations) => {
    let color = 0
    const RadarChartData = evaluations && evaluations.reduce((map, evaluation) => {
        const sprint = 'Sprint ' + evaluation.sprint
        const checklist = evaluation.checklistDescription

        if (!map.labels.includes(checklist)) {
            map.labels.push(checklist)
        }

        const dataset = getDataSet(map.datasets, sprint)
        const index = map.labels.indexOf(checklist)
        if (dataset && dataset.length) {
            dataset[0].data[index] = evaluation.score
        } else {
            let data = []
            data[index] = evaluation.score
            map.datasets.push({
                label: sprint,
                data,
                backgroundColor: getChartColor(color++)
            })
        }

        return map
    }, { labels: [], datasets: [] })

    return RadarChartData
}