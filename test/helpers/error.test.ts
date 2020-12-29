import { createError } from '../../src/helpers/error'
import { AxiosRequestConfig, AxiosResponse } from '../../src/types'

describe('helpers:error', () => {
  test('should create an Error with message,config,code,request,response and isAxiosError', () => {
    const request = new XMLHttpRequest()
    const config: AxiosRequestConfig = { method: 'post' }
    const response: AxiosResponse = {
      status: 200,
      statusText: 'ok',
      headers: null,
      request,
      config,
      data: { foo: 'bar' }
    }
    const error = createError('boom', config, 'something', request, response)
    expect(error instanceof Error).toBeTruthy()
    expect(error.message).toBe('boom')
    expect(error.config).toEqual(config)
    expect(error.code).toBe('something')
    expect(error.request).toEqual(request)
    expect(error.response).toEqual(response)
    expect(error.isAxiosError).toBeTruthy()
  })
})
