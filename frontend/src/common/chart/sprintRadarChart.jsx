import React, { Component } from 'react'
import RadarChart from './radarChart'

export default props => {     
    let options = {
        legend: {
            position: 'right',
        },
        scale: {
            ticks: {
                beginAtZero: true,
                max: 10,
                stepWidth: 2
            }
        }
    }

    return (<RadarChart cols={props.cols} data={getRadarChartData(props.evaluations)} options={options}/>)
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
                backgroundColor: getChartColor(color),
                borderColor: getChartBorderColor(color)
            })
            color++
        }

        return map
    }, { labels: [], datasets: [] })

    return RadarChartData
}