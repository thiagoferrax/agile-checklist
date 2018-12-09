import axios from 'axios'
import {BASE_URL} from '../Global'

export function getSummary() {
    const request = axios.get(`${BASE_URL}/dashboard/summary`)
    return {
        type: 'DASHBOARD_SUMMARY_FETCHED',
        payload: request
    }
}