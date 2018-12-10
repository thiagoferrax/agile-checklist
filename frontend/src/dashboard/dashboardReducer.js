const INITIAL_STATE = {summary: {projects: [], evaluations: 0, comments: 8}}

export default function(state = INITIAL_STATE, action) {
    switch (action.type) {
        case 'DASHBOARD_SUMMARY_FETCHED':
            return { ...state, summary: action.payload.data }
        default:
            return state
    }
}