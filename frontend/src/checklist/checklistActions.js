import axios from 'axios'
import { toastr } from 'react-redux-toastr'
import { reset as resetForm, initialize } from 'redux-form'
import { showTabs, selectTab } from '../common/tab/tabActions'
import {BASE_URL} from '../../Global'

const INITIAL_VALUES = {description: '', parentId: null, list: [], tree:[]}

export function getList() {
    const request = axios.get(`${BASE_URL}/checklists`)
    return {
        type: 'CHECKLISTS_FETCHED',
        payload: request
    }
}

export function getTree() {
    const request = axios.get(`${BASE_URL}/checklists/tree`)
    return {
        type: 'TREE_FETCHED',
        payload: request
    }
}

export function selectParent(parentId) {
    console.log('Redux Action', parentId)
    return {
        type: 'PARENT_SELECTED',
        payload: parentId
    }
}

export function create(values) {
    return submit(values, 'post')
}

export function update(values) {
    return submit(values, 'put')
}

export function remove(values) {
    return submit(values, 'delete')
}

function submit(values, method) {
    console.log('Submit', values)
    return dispatch => {
        const id = values.id ? values.id : ''
        axios[method](`${BASE_URL}/checklists/${id}`, values)
            .then(resp => {
                toastr.success('Sucess', 'Successful operation.')
                dispatch(init())
            })
            .catch(e => {
                e.response.data.errors.forEach(error => toastr.error('Error', error))
            })
    }
}

export function showUpdate(checklist) {
    return [ 
        showTabs('tabUpdate'),
        selectTab('tabUpdate'),
        initialize('checklistForm', checklist)
    ]
}

export function showDelete(checklist) {
    return [ 
        showTabs('tabDelete'),
        selectTab('tabDelete'),
        initialize('checklistForm', checklist)
    ]
}

export function init() {
    return [
        showTabs('tabList', 'tabCreate'),
        selectTab('tabList'),
        getList(),
        initialize('checklistForm', INITIAL_VALUES)
    ]
}