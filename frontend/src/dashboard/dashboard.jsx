import React, { Component } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import { getSummary } from './dashboardActions'
import ContentHeader from '../common/template/contentHeader'
import Content from '../common/template/content'
import InfoBox from '../common/widget/infoBox'
import ProgressBox from '../common/widget/progressBox'
import ProjectBox from '../common/widget/projectBox'
import BarChart from '../common/chart/barChart'

import Row from '../common/layout/row'

class Dashboard extends Component {

    componentWillMount() {
        this.props.getSummary()
    }

    getDataSet(datasets, checklistId) {
        return datasets.filter(dataset => dataset.label == checklistId)
    }

    getChartColor(index) {
        const colors =[
        '#33c9dd',
        '#c9dd33',
        '#dd33c9',
        '#dd4733',
        '#33dd9c',
        '#3374dd',
        '#dd9c33',
        '#113166']

        if(index > colors.length) {
            index -= colors.length
        }
        return colors[index]
    }
    
    getBarChartData(evaluations, projectId) {
        const projectEvaluations = evaluations.filter(evaluation => evaluation.projectId === projectId)

        let color = 0
        const sprintChecklistMap = projectEvaluations.reduce((map, evaluation) => {
            const sprint = 'Sprint ' + evaluation.sprint
            const checklist = evaluation.checklistDescription
            const score = evaluation.score
            
            if(!map.labels.includes(sprint)) {
                map.labels.push(sprint)                
            }             
                
            const dataset = this.getDataSet(map.datasets, checklist)
            const index = map.labels.indexOf(sprint)
            if(dataset && dataset.length) {
                dataset[0].data[index] = evaluation.score
            } else {
                let data = []                
                data[index] = evaluation.score
                map.datasets.push({
                    label: checklist,
                    data,
                    backgroundColor: this.getChartColor(color++)
                })
            }

            return map
        }, {labels:[], datasets:[]})

        return sprintChecklistMap
    }

    renderProjects() {
        const { projects, evaluations } = this.props.summary

        return projects.map(
            project => {
                const barChartData = this.getBarChartData(evaluations, project.id)

                return (<ProjectBox key={project.id} cols='12' color='default' project={project.name}>
                    <Row>
                        <BarChart cols='12 6' data={barChartData}/>
                    </Row>
                </ProjectBox>)
            }

        )
    }

    render() {
        console.log(this.props.summary)
        const { projects, evaluations, comments } = this.props.summary
        return (
            <div>
                <ContentHeader title='Dashboard' small='Versão 1.0' />
                <Content>
                    <Row>
                        <InfoBox cols='12 3' color='aqua' icon='cube'
                            value={projects.length} text='Projects' />
                        <InfoBox cols='12 3' color='red' icon='options'
                            value={evaluations.length} text='Evaluations' />
                        <InfoBox cols='12 3' color='green' icon='people '
                            value={comments} text='Members' />
                        <InfoBox cols='12 3' color='yellow' icon='chatbubbles'
                            value={comments} text='Comments' />
                    </Row>
                    <Row>
                        {this.renderProjects()}
                    </Row>
                </Content>
            </div>
        )
    }
}

const mapStateToProps = state => ({ summary: state.dashboard.summary })
const mapDispatchToProps = dispatch => bindActionCreators({ getSummary }, dispatch)
export default connect(mapStateToProps, mapDispatchToProps)(Dashboard)