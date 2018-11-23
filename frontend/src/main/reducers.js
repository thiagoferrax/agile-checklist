import { combineReducers } from 'redux'
import { reducer as formReducer } from 'redux-form'
import { reducer as toastrReducer } from 'react-redux-toastr'

import DashboardReducer from '../dashboard/dashboardReducer'
import TabReducer from '../common/tab/tabReducer'
import UserReducer from '../user/userReducer'
import ProjectReducer from '../project/projectReducer'
import ChecklistReducer from '../checklist/checklistReducer'

const rootReducer = combineReducers({
    dashboard: DashboardReducer,
    tab: TabReducer,
    user: UserReducer,
    project: ProjectReducer,
    checklist: ChecklistReducer,
    form: formReducer,    
    toastr: toastrReducer
})

export default rootReducer