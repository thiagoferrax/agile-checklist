import axios from 'axios'
import consts from '../consts'

export function getSummary() {
    const request = axios.get(`${consts.API_URL}/dashboard/summary`)
    return {
        type: 'DASHBOARD_SUMMARY_FETCHED',
        payload: request
    }
}