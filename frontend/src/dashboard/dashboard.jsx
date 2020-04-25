import React, { Component } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import { getSummary } from './dashboardActions'
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
    }

    componentDidMount() {
        this.interval = setInterval(() => this.props.getSummary(), 5000)
    }

    componentWillUnmount() {
        clearInterval(this.interval)
    }

    renderProjects() {
        const { projects, evaluationsPerChecklist, sprintEvaluations, fishboneData, paretoData, summaryData } = this.props.summary

        return projects.map(

            project => {

                if(!summaryData[project.id]) {
                    return
                }

                let checklistId = this.props.nextChecklistId || summaryData[project.id][0].checklistId    
                let data = summaryData[project.id] && summaryData[project.id].filter(data => data.checklistId === +checklistId)
                let checklist = data[0] && data[0].checklist
                
                if(!checklist) {
                    return
                }

                
                let key = `${project.id}_${checklistId}`

                return ([
                <SummaryChart key={`summaryChart_${project.id}`} cols='12' evaluations={evaluationsPerChecklist[key]} project={project.name} summaryData={summaryData[project.id]} checklist={checklist}/>,
                <EvaluationBarChart key={`barChart_${project.id}`} cols='12' evaluations={evaluationsPerChecklist[key]} project={project} checklist={checklist}/>,
                <ComparativeLineChart key={`lineChart_${project.id}`} cols='12 12 6' evaluations={sprintEvaluations[key]} project={project.name} summaryData={summaryData[project.id]} checklist={checklist}/>,
                <SprintRadarChart key={`radarChart_${project.id}`} cols='12 12 6' evaluations={sprintEvaluations[key]} project={project.name} summaryData={summaryData[project.id]} checklist={checklist}/>,
                <ParetoChart key={`paretoChart_${project.id}`} cols='12' data={paretoData[key]} project={project.name} summaryData={summaryData[project.id]} checklist={checklist}/>,
                <FishboneChart key={`fishboneChart_${project.id}`} cols='12' data={fishboneData[key]} project={project.name} summaryData={summaryData[project.id]} checklist={checklist}/>
            ])}
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

const mapStateToProps = state => ({ summary: state.dashboard.summary, nextChecklistId: state.dashboard.nextChecklistId })
const mapDispatchToProps = dispatch => bindActionCreators({ getSummary }, dispatch)
export default connect(mapStateToProps, mapDispatchToProps)(Dashboard)