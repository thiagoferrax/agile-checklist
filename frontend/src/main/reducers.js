import { combineReducers } from 'redux'
import { reducer as formReducer } from 'redux-form'
import { reducer as toastrReducer } from 'react-redux-toastr'

import DashboardReducer from '../dashboard/dashboardReducer'
import TabReducer from '../common/tab/tabReducer'
import ProjectReducer from '../project/projectReducer'
import ChecklistReducer from '../checklist/checklistReducer'
import EvaluationReducer from '../evaluation/evaluationReducer'
import AuthReducer from '../auth/authReducer'
import UserReducer from '../user/userReducer'
import TimelineReducer from '../timeline/timelineReducer'

const rootReducer = combineReducers({
    dashboard: DashboardReducer,
    tab: TabReducer,
    project: ProjectReducer,
    checklist: ChecklistReducer,
    evaluation: EvaluationReducer,
    form: formReducer,    
    toastr: toastrReducer,
    auth: AuthReducer,
    user: UserReducer,
    timeline: TimelineReducer,
})

export default rootReducer