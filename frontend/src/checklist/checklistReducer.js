const INITIAL_STATE = { description: '', parentId: null, list: [], myChecklists: [], tree: [], myTree: [] }
export default (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case 'CHECKLISTS_FETCHED':
            return { ...state, list: action.payload.data }
        case 'MY_CHECKLISTS_FETCHED':
            return { ...state, myChecklists: action.payload.data }
        case 'TREE_FETCHED':
            return { ...state, tree: action.payload.data }
        case 'MY_TREE_FETCHED':
            return { ...state, myTree: action.payload.data }
        case 'PARENT_SELECTED':
            return { ...state, parentId: action.payload }
        default:
            return state
    }
}