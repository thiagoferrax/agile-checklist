const INITIAL_STATE = {list: [], checklist: [], tree: [], checklistId: null}

export default (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case 'EVALUATIONS_FETCHED':
            return { ...state, list: action.payload.data }
        case 'CHECKLIST_SELECTED':       
        console.log('CHECKLIST_SELECTED', state.tree)
            let tree = state.tree || []
            const checklist = tree.filter(checklist => checklist.id === action.payload)
            return { ...state, checklist }
        case 'TREE_FETCHED':
            return { ...state, tree: action.payload.data }
        default:
            return state
    }
}