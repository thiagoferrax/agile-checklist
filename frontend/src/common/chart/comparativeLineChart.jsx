import React from 'react'
import LineChart from './lineChart'

const MAX_DATASETS = 2

export default props => {     

    const chartData = getLineChartData(props.evaluations)

    if(chartData && chartData.categories > 1) {
        const cols = chartData.categories > 2 ? props.cols : '12'
        const height = chartData.categories > 2 ? 50 : 20
        return (<LineChart cols={cols} data={chartData} height={height} project={props.project}/>)
    } else {
        return (<React.Fragment/>)
    }
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

const getLineChartData = (evaluations) => {
    let color = 0
    let datasets = 0
    const LineChartData = evaluations && evaluations.reduce((map, evaluation) => {
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
                borderWidth: 1.5,
                backgroundColor: getChartColor(color),
                borderColor: getChartBorderColor(color)
            })
            color++
            datasets++
        }

        return map
    }, { labels: [], datasets: [], categories:0 })

    return LineChartData
}