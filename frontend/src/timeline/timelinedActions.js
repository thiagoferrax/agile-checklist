import axios from 'axios'
import consts from '../consts'

export function getTimeline() {
    const request = axios.get(`${consts.API_URL}/timelines`)
    return {
        type: 'TIMELINE_FETCHED',
        payload: request
    }
}