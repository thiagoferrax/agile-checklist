import axios from 'axios'
import consts from '../consts'

export function getSummary() {
    const request = axios.get(`${consts.API_URL}/dashboard/summary`)
    return {
        type: 'DASHBOARD_SUMMARY_FETCHED',
        payload: request
    }
}

export function setNextChecklistId(projectId, nextChecklistId) {
    return {
        type: 'DASHBOARD_NEXT_CHECKLIST_SELECTED',
        payload: {projectId, nextChecklistId}
    }
}

export function setProjectId(projectId) {
    return {
        type: 'DASHBOARD_PROJECT_SELECTED',
        payload: projectId
    }
}