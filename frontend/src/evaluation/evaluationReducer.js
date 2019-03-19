const INITIAL_STATE = { list: [], checklist: [], tree: [], checklistId: null, score: null, completion: 0 }

export default (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case 'EVALUATIONS_FETCHED':
            return { ...state, list: action.payload.data }
        case 'CHECKLIST_SELECTED':
            let tree = state.tree || []
            let checklist = tree.filter(checklist => checklist.id === action.payload)
            return { ...state, checklist, score: null }
        case 'TREE_FETCHED':
            return { ...state, tree: action.payload.data }
        case 'SCORE_UPDATED':
            const score =
                action.payload &&
                action.payload.filter(item => item.parentId === null)[0].value

            const getItemsQuantitative =
                (treeScore, initialItems = { total: 0, withValue: 0 }) =>
                    (treeScore && treeScore.reduce((items, item) => {
                        items.total++
                        if (item.value !== undefined) {
                            items.withValue++
                        }
                        if (item.children) {
                            return getItemsQuantitative(item.children, items)
                        }
                        return items
                    }, initialItems))

            const itemsQuantitative = getItemsQuantitative(action.payload)

            const completion = itemsQuantitative.total !== 0 ? 
                parseInt(100* itemsQuantitative.withValue / itemsQuantitative.total) : 0 

            return { ...state, score, completion }
        case 'ANSWERS_FETCHED':
            let answers = action.payload.data
            answers = answers.reduce((map, answer) => {
                map[answer.checklistId] = { value: answer.value }
                return map
            }, {})

            let checklistWithAnswers = state.checklist
            if (answers) {
                const refreshTree = (tree, valuesMap) => {
                    return tree.map(
                        node => {
                            const children = refreshTree(node.children, valuesMap)
                            return valuesMap.hasOwnProperty(node.id) ? { ...node, value: valuesMap[node.id].value, children } : { ...node, children }
                        })
                }

                checklistWithAnswers = refreshTree(state.checklist, answers)
            }
            return { ...state, checklist: checklistWithAnswers }
        case 'CHECKLIST_INITIALIZED':
            return { ...state, checklist: [] }
        default:
            return state
    }
}