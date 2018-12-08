import React, { Component } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import { getSummary } from './dashboardActions'
import ContentHeader from '../common/template/contentHeader'
import Content from '../common/template/content'
import InfoBox from  '../common/widget/infoBox'
import ProgressBox from  '../common/widget/progressBox'
import ProjectBox from  '../common/widget/projectBox'

import Row from  '../common/layout/row'

class Dashboard extends Component {

    componentWillMount() {
        this.props.getSummary()
    }

    render() {
        const projects = 0
        const evaluations = 0
        const improvements = 0
        return (
            <div> 
                <ContentHeader title='Dashboard' small='Versão 1.0' />
                <Content>
                    <Row> 
                        <InfoBox cols='12 4' color='blue' icon='cubes'
                            value={projects} text='My Projects' />
                        <InfoBox cols='12 4' color='green' icon='sliders'
                            value={evaluations} text='My Evaluations' />
                        <InfoBox cols='12 4' color='yellow' icon='comments-o'
                            value={improvements} text='Comments' />
                    </Row> 
                    <Row>
                        <ProjectBox cols='12' color='primary' project='Project 1'>
                            <Row>                                      
                            </Row>
                        </ProjectBox>    
                        <ProjectBox cols='12' color='primary' project='Project 2'>
                            <Row>                                 
                            </Row>
                        </ProjectBox>
                    </Row>
                </Content> 
            </div>
        )
    }
}

const mapStateToProps = state => ({summary: state.dashboard.summary})
const mapDispatchToProps = dispatch => bindActionCreators({getSummary}, dispatch)
export default connect(mapStateToProps, mapDispatchToProps)(Dashboard)