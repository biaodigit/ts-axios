import { AxiosRequestConfig } from './types'

export default function xhr(config: AxiosRequestConfig) {
    const { method = 'get', data = null, url } = config

    const request = new XMLHttpRequest()

    request.open(method.toUpperCase(),url,true)

    request.send(data)
}

