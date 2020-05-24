export interface AxiosRequestConfig {
    url: string
    method?: Method
    data?:any
    params?:any
    headers?:any
}

export type Method = 'get' | 'GET' | 
'post' | 'POST' | 
'delete' | 'DELETE' |
'put' | 'PUT' |
'patch' | 'PATCH' |
'head' | 'HEAD' |
'options' | 'OPTIONS'  