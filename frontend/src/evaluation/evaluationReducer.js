const INITIAL_STATE = {list: [], checklistId: ''}

export default (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case 'EVALUATIONS_FETCHED':
            return { ...state, list: action.payload.data }
        case 'CHECKLIST_SELECTED':
             return { ...state, checklistId: action.payload }
        default:
            return state
    }
}