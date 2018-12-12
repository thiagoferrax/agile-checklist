import React, { Component } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import { getSummary } from './dashboardActions'
import ContentHeader from '../common/template/contentHeader'
import Content from '../common/template/content'
import InfoBox from  '../common/widget/infoBox'
import ProgressBox from  '../common/widget/progressBox'
import ProjectBox from  '../common/widget/projectBox'
import BarChart from  '../common/chart/barChart'

import Row from  '../common/layout/row'

class Dashboard extends Component {

    componentWillMount() {
        this.props.getSummary()
    }

    renderProjects() {    
        const {projects} = this.props.summary

        return projects.map(
            project => 
            (<ProjectBox key={project.id} cols='12' color='default' project={project.name}>
                <Row>       
                    <BarChart cols='12 4'/>                  
                </Row>
            </ProjectBox>)
        )
    }

    render() {        
        console.log(this.props.summary)
        const {projects, evaluations, comments} = this.props.summary
        return (
            <div> 
                <ContentHeader title='Dashboard' small='Versão 1.0' />
                <Content>
                    <Row> 
                        <InfoBox cols='12 3' color='aqua' icon='cube'
                            value={projects.length} text='Projects' />
                        <InfoBox cols='12 3' color='red' icon='options'
                            value={evaluations} text='Evaluations' />
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

const mapStateToProps = state => ({summary: state.dashboard.summary})
const mapDispatchToProps = dispatch => bindActionCreators({getSummary}, dispatch)
export default connect(mapStateToProps, mapDispatchToProps)(Dashboard)