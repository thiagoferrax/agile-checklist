import React, { Component } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import { getSummary } from './dashboardActions'
import ContentHeader from '../common/template/contentHeader'
import Content from '../common/template/content'
import InfoBox from '../common/widget/infoBox'
import EvaluationBarChart from '../common/chart/evaluationBarChart'
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
        const { projects, evaluations, sprintEvaluations, fishboneData, paretoData, summaryData } = this.props.summary

        return projects.map(
            project => ([
                <EvaluationBarChart key={`barChart_${project.id}`} cols='12' evaluations={evaluations} project={project} summaryData={summaryData[project.id]} />,
                <ComparativeLineChart key={`lineChart_${project.id}`} cols='12 12 6' evaluations={sprintEvaluations[project.id]} project={project.name} summaryData={summaryData[project.id]} footerText="Comparison of average score per category"/>,
                <SprintRadarChart key={`radarChart_${project.id}`} cols='12 12 6' evaluations={sprintEvaluations[project.id]} project={project.name} summaryData={summaryData[project.id]} footerText="Radar of average score per category" />,
                <ParetoChart key={`paretoChart_${project.id}`} cols='12' data={paretoData[project.id]} project={project.name} summaryData={summaryData[project.id]} footerText="Number of items (average score < 7.0) per category" />,
                <FishboneChart key={`fishboneChart_${project.id}`} cols='12' data={fishboneData[project.id]} project={project.name} summaryData={summaryData[project.id]} footerText="Number of items (average score < 7.0) per category"/>
            ])
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

const mapStateToProps = state => ({ summary: state.dashboard.summary })
const mapDispatchToProps = dispatch => bindActionCreators({ getSummary }, dispatch)
export default connect(mapStateToProps, mapDispatchToProps)(Dashboard)