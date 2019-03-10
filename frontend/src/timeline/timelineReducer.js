const INITIAL_STATE = {timeline: {}}

export default function(state = INITIAL_STATE, action) {
    switch (action.type) {
        case 'TIMELINE_FETCHED':
            if(!action.payload.data) {
                return { ...state, timeline: INITIAL_STATE.timeline }    
            }
            return { ...state, timeline: action.payload.data }
        default:
            return state
    }
}