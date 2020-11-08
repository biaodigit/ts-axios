import Axios from './core/Axios'
import defaults from './default'
import mergeConfig from './core/mergeConfig'
import { extend } from './helpers/utils'
import { AxiosStatic, AxiosRequestConfig } from './types'

function createInstance(config: AxiosRequestConfig): AxiosStatic {
    const context = new Axios(config)
    const instance = Axios.prototype.request.bind(context)

    extend(instance, context)

    return instance as AxiosStatic
}

const axios = createInstance(defaults)

axios.create = function (config) {
    return createInstance(mergeConfig(defaults, config))
}

export default axios