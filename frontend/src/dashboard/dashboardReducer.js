const INITIAL_STATE = {summary: {projects: [], evaluations: [], number_checklists: 0, number_evaluations: 0, members: [], nextChecklistId: 1}}

export default function(state = INITIAL_STATE, action) {
    switch (action.type) {
        case 'DASHBOARD_SUMMARY_FETCHED':
            if(!action.payload.data) {
                return { ...state, summary: INITIAL_STATE.summary }    
            }
            
            return { ...state, summary: action.payload.data }
        case 'DASHBOARD_NEXT_CHECKLIST_SELECTED':
            return { ...state, nextChecklistId: action.payload.nextChecklistId }
        case 'DASHBOARD_PROJECT_SELECTED':
            return { ...state, projectId: action.payload }    
        default:
            return state
    }
}