const INITIAL_STATE = {list: [], tree: []}

export default (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case 'CHECKLISTS_FETCHED':
            return { ...state, list: action.payload.data }
        case 'TREE_FETCHED':
            return { ...state, tree: action.payload.data }    
        default:
            return state
    }
}