import '../common/template/dependencies'
import React, { Component } from 'react'
import axios from 'axios'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import Auth from '../auth/auth'
import { validateToken } from '../auth/authActions'
import Dashboard from '../dashboard/dashboard'
import User from '../user/user'
import Project from '../project/project'
import Checklist from '../checklist/checklist'
import Evaluation from '../evaluation/evaluation'

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
            return [
                <Route exact path='/' component={Dashboard} />,
                <Route path='/users' component={User} />,
                <Route path='/projects' component={Project} />,
                <Route path='/checklists' component={Checklist} />,
                <Route path='/evaluations' component={Evaluation} />
            ]
        } else if (!user && !validToken) {
            return <Route path='/' component={Auth} />
        } else {
            return false
        }
    }
}

const mapStateToProps = state => ({ auth: state.auth })
const mapDispatchToProps = dispatch => bindActionCreators({ validateToken }, dispatch)
export default connect(mapStateToProps, mapDispatchToProps)(AuthOrApp)