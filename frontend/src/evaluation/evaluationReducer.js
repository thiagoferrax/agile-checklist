const INITIAL_STATE = {list: [], checklist: [], tree: []}

export default (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case 'EVALUATIONS_FETCHED':
            return { ...state, list: action.payload.data }
        case 'CHECKLIST_SELECTED':       
        console.log('CHECKLIST_SELECTED', state.tree)
            let tree = state.tree || []
            const checklist = tree.filter(checklist => checklist.id === action.payload)
            return { ...state, checklist }
        case 'CHECKLIST_CHANGED':  
            const item = action.payload

            const buildTree = (tree, onChange) => tree && tree.map(node => {
                const children = node.children
                const childrenTree = children && buildTree(children, onChange)            

                const value = node.id == item.id ? item.value : node.value
                const newNode = {...node, value}
                newNode.children = childrenTree 

                return newNode
            })

            return { ...state, checklist: buildTree(state.checklist) }
        case 'TREE_FETCHED':
            return { ...state, tree: action.payload.data }
        default:
            return state
    }
}
