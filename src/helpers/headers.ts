import { isPlainObject } from './utils'

/**
 * 标准化键名
 * @param headers 
 * @param normalizedName 
 */
function normalizeHeaderName(headers: any, normalizedName: string): void {
    if (!headers) return

    Object.keys(headers).forEach(name => {
        if (name !== normalizedName && normalizedName.toUpperCase() === name.toUpperCase()) {
            headers[normalizedName] = headers[name]
            delete headers[name]
        }
    })
}

/**
 * 规范化headers
 * @param headers 
 * @param data 
 */
export function processHeaders(headers: any, data: any): any {
    normalizeHeaderName(headers, 'Content-Type')
    if (isPlainObject(data)) {
        if (headers && !headers['Content-Type']) {
            headers['Content-Type'] = 'application/json;charset=utf-8'
        }
    }
    return headers
}

/**
 * 分析headers
 * @param headers 
 */
export function parseHeaders(headers: string): any {
    let parsed = Object.create(null)
    if (!headers) return parsed

    headers.split('\r\n').forEach(line => {
        let [key, val] = line.split(':')
        key = key.trim().toLowerCase()

        if (!key) return
        if (val) val = val.trim()
        parsed[key] = val
    })

    return parsed
}