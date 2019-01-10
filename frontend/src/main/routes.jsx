import React from 'react'
import { Switch, Redirect } from 'react-router-dom'

import AuthOrApp from './authOrApp'

export default props => (
    <div className="content-wrapper">
        <Switch>
            <AuthOrApp/>
        </Switch>
        <Redirect from='*' to='/' />
    </div>
)
