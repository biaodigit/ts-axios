import { AxiosPromise, AxiosRequestConfig, AxiosResponse } from './types'
import { parseHeaders } from './helpers/headers'
import { createError } from './helpers/error'
import { isURLSameOrigin } from './helpers/url'
import { isFormData } from './helpers/utils'
import cookie from './helpers/cookie'

export default function xhr(config: AxiosRequestConfig): AxiosPromise {
    return new Promise((resolve, reject) => {
        const {
            method = 'get',
            data = null,
            url,
            headers,
            auth,
            responseType,
            timeout,
            cancelToken,
            withCredentials,
            xsrfCookieName,
            xsrfHeaderName,
            validateStatus,
            onDownloadProgress,
            onUploadProgress
        } = config
        const request = new XMLHttpRequest()

        request.open(method.toUpperCase(), url!, true)

        configureRequest()

        addEvents()

        processHeaders()

        processCancel()

        request.send(data)

        function configureRequest(): void {
            if (responseType) {
                request.responseType = responseType
            }
            // 超时设置
            if (timeout) {
                request.timeout = timeout
            }

            if (withCredentials) {
                request.withCredentials = withCredentials
            }
        }

        function addEvents(): void {
            // 响应成功
            request.onreadystatechange = function handleLoad() {
                if (request.readyState !== 4) return

                if (request.status === 0) return

                // 获取响应数据
                const responseHeaders = parseHeaders(request.getAllResponseHeaders())
                const responseData = responseType !== 'text' ? request.response : request.responseText
                const response: AxiosResponse = {
                    data: responseData,
                    status: request.status,
                    statusText: request.statusText,
                    headers: responseHeaders,
                    config,
                    request
                }
                handleResponse(response)
            }

            // 网络错误
            request.onerror = function handleError() {
                reject(createError(
                    'Network Error',
                    config,
                    null,
                    request
                ))
            }

            // 超时
            request.ontimeout = function handleTimeout() {
                reject(createError(
                    `Timeout of ${config.timeout} ms exceeded`,
                    config,
                    'ECONNABORTED',
                    request
                ))
            }

            if (onDownloadProgress) {
                request.onprogress = onDownloadProgress
            }

            if (onUploadProgress) {
                request.upload.onprogress = onUploadProgress
            }
        }

        function processHeaders(): void {
            if (isFormData(data)) {
                delete headers['Content-Type']
            }

            if ((withCredentials || isURLSameOrigin(url!)) && xsrfCookieName) {
                const xsrfValue = cookie.read(xsrfCookieName)
                if (xsrfValue && xsrfHeaderName) {
                    headers[xsrfHeaderName] = xsrfValue
                }
            }

            if (auth) {
                headers['Authorization'] = 'Basic ' + btoa(auth.username + ':' + auth.password)
            }
            Object.keys(headers).forEach(name => {
                if (data === null && name.toLowerCase() === 'content-type') {
                    delete headers[name]
                } else {
                    request.setRequestHeader(name, headers[name])
                }
            })
        }

        function processCancel(): void {
            if (cancelToken) {
                cancelToken.promise.then(reason => {
                    request.abort()
                    reject(reason)
                })
            }
        }

        function handleResponse(response: AxiosResponse) {
            if (!validateStatus || validateStatus(response.status)) {
                resolve(response)
            } else {
                reject(createError(
                    `Request failed with status code ${response.status}`,
                    config,
                    null,
                    request,
                    response
                ))
            }
        }
    })
}

