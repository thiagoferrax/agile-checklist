import React from 'react'
import { Router, Route, IndexRoute, Redirect, hashHistory } from 'react-router'

import App from './app'
import Dashboard from '../dashboard/dashboard'
import User from '../user/user'
import Project from '../project/project'
import Checklist from '../checklist/checklist';

export default props => (
    <Router history={hashHistory}>
        <Route path='/' component={App}>
            <IndexRoute component={Dashboard} />
            <Route path='users' component={User} />
            <Route path='projects' component={Project} />
            <Route path='checklists' component={Checklist} />
        </Route>
        <Redirect from='*' to='/' />
    </Router>
)
