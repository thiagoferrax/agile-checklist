const INITIAL_STATE = {list: [], checklist: [], tree: [], checklistId: null, answers: []}

export default (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case 'EVALUATIONS_FETCHED':
            return { ...state, list: action.payload.data }
        case 'CHECKLIST_SELECTED':               
            let tree = state.tree || []
            let checklist = tree.filter(checklist => checklist.id === action.payload)
            
            if(state.answers) {
                const refreshTree = (tree, valuesMap) => {        
                    return tree.map(
                        node => {
                            console.log('node', node, valuesMap.hasOwnProperty(node.id))
                            const children = refreshTree(node.children, valuesMap)            
                            return valuesMap.hasOwnProperty(node.id) ? {...node, value:valuesMap[node.id].value, children} : {...node, children}
                        })
                }

                checklist = refreshTree(checklist, state.answers)
                console.log('CHECKLIST_SELECTED', checklist)
            }

            return { ...state, checklist }
        case 'TREE_FETCHED':
            return { ...state, tree: action.payload.data }
        case 'ANSWERS_FETCHED':
            let answers = action.payload.data
            answers = answers.reduce((map, answer) => {
                map[answer.checklistId] = {value:answer.value}
                return map
            }, {})    
            return { ...state, answers}
        default:
            return state
    }
}