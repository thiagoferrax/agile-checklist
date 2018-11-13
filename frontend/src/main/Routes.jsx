import React from 'react'
import { Switch, Route, Redirect } from 'react-router'

import Home from '../components/home/Home'
import UserCrud from '../components/user/UserCrud'
import ChecklistCrud from '../components/checklist/ChecklistCrud'
import AssessmentCrud from '../components/checklist/AssessmentCrud'
import ProjectCrud from '../components/project/ProjectCrud'

export default props => 
    <Switch>
        <Route exact path='/' component={Home} />
        <Route path='/users' component={UserCrud} />
        <Route path='/checklists' component={ChecklistCrud} />
        <Route path='/assessments' component={AssessmentCrud} />
        <Route path='/projects' component={ProjectCrud} />
        <Redirect from='*' to='/' />

    </Switch>