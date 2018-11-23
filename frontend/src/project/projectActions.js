import axios from 'axios'
import { toastr } from 'react-redux-toastr'
import { reset as resetForm, initialize } from 'redux-form'
import { showTabs, selectTab } from '../common/tab/tabActions'
import {BASE_URL} from '../../Global'

const INITIAL_VALUES = {}

export function getList() {
    const request = axios.get(`${BASE_URL}/projects`)
    return {
        type: 'PROJECTS_FETCHED',
        payload: request
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
    return dispatch => {
        const id = values.id ? values.id : ''
        axios[method](`${BASE_URL}/projects/${id}`, values)
            .then(resp => {
                toastr.success('Sucess', 'Successful operation.')
                dispatch(init())
            })
            .catch(e => {
                e.response.data.errors.forEach(error => toastr.error('Error', error))
            })
    }
}

export function showUpdate(project) {
    return [ 
        showTabs('tabUpdate'),
        selectTab('tabUpdate'),
        initialize('projectForm', project)
    ]
}

export function showDelete(project) {
    return [ 
        showTabs('tabDelete'),
        selectTab('tabDelete'),
        initialize('projectForm', project)
    ]
}

export function init() {
    return [
        showTabs('tabList', 'tabCreate'),
        selectTab('tabList'),
        getList(),
        initialize('projectForm', INITIAL_VALUES)
    ]
}