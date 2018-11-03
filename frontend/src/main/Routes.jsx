import React from 'react'
import { Switch, Route, Redirect } from 'react-router'

import Home from '../components/home/Home'
import UserCrud from '../components/user/UserCrud'
import ChecklistCrud from '../components/checklist/ChecklistCrud'

export default props => 
    <Switch>
        <Route exact path='/' component={Home} />
        <Route path='/users' component={UserCrud} />
        <Route path='/checklists' component={ChecklistCrud} />
        <Redirect from='*' to='/' />
    </Switch>