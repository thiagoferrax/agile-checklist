import axios from 'axios'
import consts from '../consts'

export function getList() {
    const request = axios.get(`${consts.API_URL}/users`)
    return {
        type: 'USERS_FETCHED',
        payload: request
    }
}

