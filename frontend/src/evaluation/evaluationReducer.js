const INITIAL_STATE = {list: [], checklist: [], tree: [], checklistId: null}

export default (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case 'EVALUATIONS_FETCHED':
            return { ...state, list: action.payload.data }
        case 'CHECKLIST_SELECTED':               
            let tree = state.tree || []
            let checklist = tree.filter(checklist => checklist.id === action.payload)
            return { ...state, checklist }
        case 'TREE_FETCHED':
            return { ...state, tree: action.payload.data }
        case 'ANSWERS_FETCHED':
            let answers = action.payload.data
            answers = answers.reduce((map, answer) => {
                map[answer.checklistId] = {value:answer.value}
                return map
            }, {})    

            let checklistWithAnswers = state.checklist
            if(answers) {
                const refreshTree = (tree, valuesMap) => {        
                    return tree.map(
                        node => {
                            const children = refreshTree(node.children, valuesMap)            
                            return valuesMap.hasOwnProperty(node.id) ? {...node, value:valuesMap[node.id].value, children} : {...node, children}
                        })
                }

                checklistWithAnswers = refreshTree(state.checklist, answers)
            }
            
            return { ...state, checklist: checklistWithAnswers}
        default:
            return state
    }
}