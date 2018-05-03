import axios from 'axios'
import config from '../config/config'

// 跨域需要带cookie
axios.defaults.withCredentials = true
// 防xsrf攻击，要在request header设置相关header
// axios.defaults.xsrfCookieName = 'csrfToken'
// axios.defaults.xsrfHeaderName = 'x-csrf-token'

// 设置响应拦截器统一处理错误
axios.interceptors.response.use((res) => {
    if (res.data.code === 0) {
        return res.data
    }
    return res.data
}, (error) => {
    throw new Error(error)
})

// 设置请求拦截器
axios.interceptors.request.use((config) => {
    config.headers = Object.assign({}, config.headers, {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
    })
    return config
})

function makeUrl(url) {
    return config.API_HOST + url
}

const Http = {
    async post(url, data) {
        return await axios.post(makeUrl(url), data)
    },
    async get(url) {
        return await axios.get(makeUrl(url))
    },
    async delete(url) {
        return await axios.delete(makeUrl(url))
    },
    setParam (url, params) {
        params.forEach((param) => {
            url = url.replace(`:${param.name}`, param.value)
        })

        return url
    }
}

export default Http
