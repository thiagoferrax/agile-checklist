import axios from 'axios'
import { toastr } from 'react-redux-toastr'
import { initialize } from 'redux-form'
import { showTabs, selectTab } from '../common/tab/tabActions'
import consts from '../consts'
import {getSummary} from '../dashboard/dashboardActions'

const INITIAL_VALUES = {checklist:[]}

export function getList() {
    const request = axios.get(`${consts.API_URL}/evaluations`)
    return {
        type: 'EVALUATIONS_FETCHED',
        payload: request
    }
}

export function selectChecklist(checklistId) {
    return {
        type: 'CHECKLIST_SELECTED',
        payload: checklistId
    }
}

export function updateScore(score) {
    return {
        type: 'SCORE_UPDATED',
        payload: score
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
        axios[method](`${consts.API_URL}/evaluations/${id}`, values)
            .then(resp => {
                toastr.success('Sucess', 'Successful operation.')
                dispatch(init())
            })
            .catch(e => {
                e.response.data.errors.forEach(error => toastr.error('Error', error))
            })
    }
}

export function getAnswers(evaluation) {
    const request = axios.get(`${consts.API_URL}/evaluations/${evaluation.id}/answers`)
    return {
        type: 'ANSWERS_FETCHED',
        payload: request
    }
}

export function initializeChecklist() {
    return {
        type: 'CHECKLIST_INITIALIZED'
    }
}

export function showUpdate(evaluation) {
    return [ 
        showTabs('tabUpdate'),
        selectTab('tabUpdate'),        
        getAnswers(evaluation),
        selectChecklist(evaluation.checklistId),
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
        showTabs('tabEvaluate', 'tabList'),
        selectTab('tabList'),
        getList(),
        initializeChecklist(),
        initialize('evaluationForm', INITIAL_VALUES),
        getSummary()
    ]
}