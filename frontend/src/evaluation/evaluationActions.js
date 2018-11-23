import axios from 'axios'
import { toastr } from 'react-redux-toastr'
import { reset as resetForm, initialize } from 'redux-form'
import { showTabs, selectTab } from '../common/tab/tabActions'
import {BASE_URL} from '../../Global'

const INITIAL_VALUES = {}

export function getList() {
    const request = axios.get(`${BASE_URL}/evaluations`)
    return {
        type: 'EVALUATIONS_FETCHED',
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
        axios[method](`${BASE_URL}/evaluations/${id}`, values)
            .then(resp => {
                toastr.success('Sucess', 'Successful operation.')
                dispatch(init())
            })
            .catch(e => {
                e.response.data.errors.forEach(error => toastr.error('Error', error))
            })
    }
}

export function showUpdate(evaluation) {
    return [ 
        showTabs('tabUpdate'),
        selectTab('tabUpdate'),
        initialize('evaluationForm', evaluation)
    ]
}

export function showDelete(evaluation) {
    return [ 
        showTabs('tabDelete'),
        selectTab('tabDelete'),
        initialize('evaluationForm', evaluation)
    ]
}

export function init() {
    return [
        showTabs('tabList', 'tabCreate'),
        selectTab('tabList'),
        getList(),
        initialize('evaluationForm', INITIAL_VALUES)
    ]
}