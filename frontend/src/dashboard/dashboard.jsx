import React, { Component } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import { getSummary } from './dashboardActions'
import ContentHeader from '../common/template/contentHeader'
import Content from '../common/template/content'
import InfoBox from '../common/widget/infoBox'
import ProjectBox from '../common/widget/projectBox'
import EvaluationBarChart from '../common/chart/evaluationBarChart'
import SprintRadarChart from '../common/chart/sprintRadarChart'
import FishboneChart from '../common/chart/fishboneChart'


import Row from '../common/layout/row'

class Dashboard extends Component {

    componentWillMount() {
        this.props.getSummary()
    }

    renderProjects() {
        const { projects, evaluations, sprintEvaluations, fishboneData } = this.props.summary

        return projects.map(
            project => (
                <ProjectBox key={project.id} cols='12' color='default' project={project.name}>
                    <Row>
                        <EvaluationBarChart cols='12' evaluations={evaluations} project={project} />
                        <SprintRadarChart cols='12 6' evaluations={sprintEvaluations[project.id]} />                        
                        <FishboneChart cols='12' data={fishboneData[project.id]} />
                    </Row>
                </ProjectBox>)
        )
    }

    render() {
        const { projects, number_evaluations, members, comments } = this.props.summary
        return (
            <div>
                <ContentHeader title='Dashboard' small='Versão 1.0' />
                <Content>
                    <Row>
                        <InfoBox cols='12 4' color='aqua' icon='cube'
                            value={projects.length} text='Projects' />
                        <InfoBox cols='12 4' color='red' icon='options'
                            value={number_evaluations} text='Evaluations' />
                        <InfoBox cols='12 4' color='green' icon='people '
                            value={members} text='Members' />
                        {/*<InfoBox cols='12 3' color='yellow' icon='chatbubbles' value={comments} text='Comments' />*/}
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