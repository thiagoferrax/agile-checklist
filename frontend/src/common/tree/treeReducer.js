const INITIAL_STATE = { tree: [] }

export default (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case 'CHECKLIST_SELECTED':
            console.log(action.payload)
            return { ...state, tree: action.payload }
         default:
            return state
    }
}