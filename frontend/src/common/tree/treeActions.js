export function selectChecklist(tree, nodeId) {
    console.log('tree' + tree)
    console.log('nodeId' + nodeId)
    return {
        type: 'CHECKLIST_SELECTED',
        payload: tree
    }
}