export function selectChecklist(tree, nodeId) {
    return {
        type: 'CHECKLIST_SELECTED',
        payload: tree
    }
}

