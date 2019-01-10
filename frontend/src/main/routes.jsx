import React from 'react'
import { Switch, Route, Redirect } from 'react-router-dom'

import Dashboard from '../dashboard/dashboard'
import User from '../user/user'
import Project from '../project/project'
import Checklist from '../checklist/checklist'
import Evaluation from '../evaluation/evaluation';
import AuthOrApp from './authOrApp'
export default props => (
    <div className="content-wrapper">
        <Switch>
            <AuthOrApp/>
        </Switch>
        <Redirect from='*' to='/' />
    </div>
)
