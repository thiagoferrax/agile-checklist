import '../common/template/dependencies'
import React, { Component } from 'react'
import axios from 'axios'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import Auth from '../auth/auth'
import { validateToken } from '../auth/authActions'
import Dashboard from '../dashboard/dashboard'
import Project from '../project/project'
import Checklist from '../checklist/checklist'
import Evaluation from '../evaluation/evaluation'
import Timeline from '../timeline/timeline'

import { Route } from 'react-router-dom'

class AuthOrApp extends Component {
    componentWillMount() {
        if (this.props.auth.user) {
            this.props.validateToken(this.props.auth.user.token)
        }
    }

    render() {
        const { user, validToken } = this.props.auth
        if (user && validToken) {
            axios.defaults.headers.common['authorization'] = user.token
            return [<Route exact key='route_dashboard' path='/' component={Dashboard}/>,
            <Route key='route_projects' path='/projects' component={Project} />,
            <Route key='route_checklists' path='/checklists' component={Checklist} />,
            <Route key='route_evaluations' path='/evaluations' component={Evaluation} />,
            <Route key='route_timeline' path='/timeline' component={Timeline} />]
        } else if (!user && !validToken) {
            return <Route key='route_auth' path='/' component={Auth}/>
        } else {
            return false
        }
    }
}

const mapStateToProps = state => ({ auth: state.auth })
const mapDispatchToProps = dispatch => bindActionCreators({ validateToken }, dispatch)
export default connect(mapStateToProps, mapDispatchToProps)(AuthOrApp)