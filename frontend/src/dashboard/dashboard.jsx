import React, { Component } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import { getSummary } from './dashboardActions'
import { getList } from '../project/projectActions'
import ContentHeader from '../common/template/contentHeader'
import Content from '../common/template/content'
import InfoBox from '../common/widget/infoBox'
import EvaluationBarChart from '../common/chart/evaluationBarChart'
import SummaryChart from '../common/chart/summaryChart'
import SprintRadarChart from '../common/chart/sprintRadarChart'
import ComparativeLineChart from '../common/chart/comparativeLineChart'
import FishboneChart from '../common/chart/fishboneChart'
import ParetoChart from '../common/chart/paretoChart'


import Row from '../common/layout/row'

class Dashboard extends Component {
    componentWillMount() {
        this.props.getSummary()
        this.props.getList()
    }

    componentDidMount() {
        this.interval = setInterval(() => this.props.getSummary(), 5000)
    }

    componentWillUnmount() {
        clearInterval(this.interval)
    }

    renderProjects() {
        const { projects, evaluationsPerChecklist, sprintEvaluations, feedbackData, fishboneData, paretoData, summaryData } = this.props.summary

        let projectId = this.props.projectId || projects && projects[0] && projects[0].id

        let projectsFiltered = projectId ? projects.filter(p => p.id == projectId) : projects

        const { name, email } = this.props.user

        return projectsFiltered.map(

            project => {
                let projectId = project.id

                if (!summaryData[projectId]) {
                    return
                }

                let checklistId = this.props.nextChecklistId || summaryData[projectId][0].checklistId
                let data = summaryData[projectId] && summaryData[projectId].filter(data => data.checklistId === +checklistId)
                let checklist = data[0] && data[0].checklist

                if (!checklist) {
                    return
                }

                let key = `${projectId}_${checklistId}`

                let hasUserRadar = feedbackData[key] && feedbackData[key].length > 0

                if(hasUserRadar) {
                    return ([
                        <SummaryChart key={`summaryChart_${projectId}`} cols='12' evaluations={evaluationsPerChecklist[key]} project={project} summaryData={summaryData[projectId]} checklist={checklist} />,
                        <EvaluationBarChart key={`barChart_${projectId}`} cols='12' evaluations={evaluationsPerChecklist[key]} project={project} checklist={checklist} />,
                        <SprintRadarChart key={`radarChart_${projectId}`} cols='12 12 6' evaluations={sprintEvaluations[key]} project={project.name} summaryData={summaryData[projectId]} checklist={checklist} />,
                        <SprintRadarChart key={`radarChart_${projectId}_2`} cols='12 12 6' evaluations={feedbackData[key]} project={project.name} summaryData={summaryData[projectId]} checklist={`${checklist} \\ ${name}`} />,
                        <ParetoChart key={`paretoChart_${projectId}`} cols='12' data={paretoData[key]} project={project.name} summaryData={summaryData[projectId]} checklist={checklist} />,
                    ])
                } else {
                    return ([
                        <SummaryChart key={`summaryChart_${projectId}`} cols='12' evaluations={evaluationsPerChecklist[key]} project={project} summaryData={summaryData[projectId]} checklist={checklist} />,
                        <EvaluationBarChart key={`barChart_${projectId}`} cols='12' evaluations={evaluationsPerChecklist[key]} project={project} checklist={checklist} />,
                        <ComparativeLineChart key={`lineChart_${projectId}`} cols={'12 12 6'} evaluations={sprintEvaluations[key]} project={project.name} summaryData={summaryData[projectId]} checklist={checklist} />,
                        <SprintRadarChart key={`radarChart_${projectId}`} cols='12 12 6' evaluations={sprintEvaluations[key]} project={project.name} summaryData={summaryData[projectId]} checklist={checklist} />,
                        <ParetoChart key={`paretoChart_${projectId}`} cols='12' data={paretoData[key]} project={project.name} summaryData={summaryData[projectId]} checklist={checklist} />,
                        <FishboneChart key={`fishboneChart_${projectId}`} cols='12' data={fishboneData[key]} project={project.name} summaryData={summaryData[projectId]} checklist={checklist} />
                    ])
                }
                
            }
        )
    }

    render() {
        const { projects, number_checklists, number_evaluations, members } = this.props.summary
        return (
            <div>
                <ContentHeader title='Dashboard' small='Control Panel' />
                <Content>
                    <Row>
                        <InfoBox cols='12 6 3' color='aqua' icon='cube'
                            value={projects.length} text='Projects' />
                        <InfoBox cols='12 6 3' color='red' icon='people '
                            value={members.length} text='Members' />
                        <InfoBox cols='12 6 3' color='yellow' icon='checkbox-outline'
                            value={number_checklists} text='Checklists' />
                        <InfoBox cols='12 6 3' color='green' icon='options'
                            value={number_evaluations} text='Evaluations' />
                    </Row>
                    <Row>
                        {this.renderProjects()}
                    </Row>
                </Content>
                <br />
                <br />
            </div>
        )
    }
}

const mapStateToProps = state => ({
    summary: state.dashboard.summary,
    nextChecklistId: state.dashboard.nextChecklistId,
    projectId: state.dashboard.projectId,
    user: state.auth.user
})
const mapDispatchToProps = dispatch => bindActionCreators({ getSummary, getList }, dispatch)
export default connect(mapStateToProps, mapDispatchToProps)(Dashboard)