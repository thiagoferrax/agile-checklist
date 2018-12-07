import React from 'react'
import { Switch, Route, Redirect } from 'react-router'

import Dashboard from '../dashboard/dashboard'
import User from '../user/user'
import Project from '../project/project'
import Checklist from '../checklist/checklist'
import Evaluation from '../evaluation/evaluation';

export default props => (
    <div className="content-wrapper">
        <Switch>
            <Route exact path='/' component={Dashboard}/>
            <Route path='/users' component={User} />
            <Route path='/projects' component={Project} />
            <Route path='/checklists' component={Checklist} />
            <Route path='/evaluations' component={Evaluation} />
            <Redirect from='*' to='/' />
        </Switch>
    </div>
)
