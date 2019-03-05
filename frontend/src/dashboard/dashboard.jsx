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
        const { projects, evaluations, sprintEvaluations, fishboneData } = this.props.summary

        return projects.map(
            project => ([
                        <EvaluationBarChart cols='12' evaluations={evaluations} project={project}/>,
                        <SprintRadarChart cols='12 12 6' evaluations={sprintEvaluations[project.id]} project={project.name}/>,
                        <ComparativeLineChart cols='12 12 6' evaluations={sprintEvaluations[project.id]} project={project.name}/>,
                        <FishboneChart cols='12' data={fishboneData[project.id]} project={project.name}/>
                    ])
        )
    }

    render() {
        const { projects, number_checklists, number_evaluations, members } = this.props.summary
        return (
            <div>
                <ContentHeader title='Dashboard' small='Version 1.0' />
                <Content>
                    <Row>
                        <InfoBox cols='12 6 3' color='aqua' icon='cube'
                            value={projects.length} text='Projects' />
                        <InfoBox cols='12 6 3' color='red' icon='checkbox-outline'
                            value={number_checklists} text='Checklists' />
                        <InfoBox cols='12 6 3' color='green' icon='options'
                            value={number_evaluations} text='Evaluations' />
                        <InfoBox cols='12 6 3' color='yellow' icon='people '
                            value={members.length} text='Members' />
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