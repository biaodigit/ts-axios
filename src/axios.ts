import { connect } from 'http2'
import Axios from './core/Axios'
import { extend } from './helpers/utils'
import { AxiosInstance } from './types'

function createInstance(): AxiosInstance {
    const context = new Axios()
    const instance = Axios.prototype.request.bind(context)

    extend(instance, context)

    return instance as AxiosInstance
}

const axios = createInstance()

export default axios