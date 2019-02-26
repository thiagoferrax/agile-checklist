import React from 'react'
import RadarChart from './radarChart'

const MAX_DATASETS = 1

export default props => {     
    let options = {
        legend: {
            position: 'right',
        },
        scale: {
            ticks: {
                beginAtZero: true,
                max: 10,
                stepSize: 2
            }
        }
    }

    const chartData = getRadarChartData(props.evaluations)

    if(chartData && chartData.categories > 2) {
        return (<RadarChart cols={props.cols} data={chartData} options={options}/>)
    } else {
        return (<React.Fragment/>)
    }
}

const getDataSet = (datasets, checklistId) => {
    return datasets.filter(dataset => dataset.label === checklistId)
}

const getChartColor = (index) => {

    const colors = [
        'rgb(0, 192, 239, .3)',
        'rgb(216, 27, 96, .3)',
        'rgb(104,115,140, .3)',
        'rgb(48, 187, 187, .3)',
        'rgb(11, 120, 206, .3)',
        'rgb(255, 119, 1, .3)',
        'rgb(17, 17, 17, .3)',
        'rgb(96, 92, 168, .3)'
        
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

const getRadarChartData = (evaluations) => {
    let color = 0
    let datasets = 0
    const RadarChartData = evaluations && evaluations.reduce((map, evaluation) => {
        const sprint = 'Sprint ' + evaluation.sprint
        const checklist = evaluation.checklistDescription

        if (!map.labels.includes(checklist)) {
            map.labels.push(checklist)
            map.categories++
        }

        const dataset = getDataSet(map.datasets, sprint)
        const index = map.labels.indexOf(checklist)
        if (dataset && dataset.length) {
            dataset[0].data[index] = evaluation.score
        } else {
            let data = []
            data[index] = evaluation.score
            let hidden = datasets >= MAX_DATASETS
            map.datasets.push({
                label: sprint,
                data,
                hidden,
                borderWidth: 2,
                backgroundColor: getChartColor(color),
                borderColor: getChartBorderColor(color)
            })
            color++
            datasets++
        }

        return map
    }, { labels: [], datasets: [],  categories: 0})

    return RadarChartData
}