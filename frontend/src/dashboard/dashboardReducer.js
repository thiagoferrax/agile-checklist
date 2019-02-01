const INITIAL_STATE = {summary: {projects: [], evaluations: [], comments: 0}}

export default function(state = INITIAL_STATE, action) {
    switch (action.type) {
        case 'DASHBOARD_SUMMARY_FETCHED':
            if(!action.payload.data) {
                return { ...state, summary: INITIAL_STATE.summary }    
            }
            return { ...state, summary: action.payload.data }
        default:
            return state
    }
}