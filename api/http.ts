import axios from 'axios'
import AsyncStorage from '@react-native-async-storage/async-storage'

export const http = axios.create({
    baseURL: 'http://localhost:8000/api/v1',
    headers: {
        'Content-type': 'application/json',
    },
    withCredentials: true
})


function createAxiosResponseInterceptor() {
    const interceptor = http.interceptors.response.use(
        (response) => response,
        async (error) => {
            if (error.response.status !== 401) {
                return await Promise.reject(error)
            }

            http.interceptors.response.eject(interceptor)

            return await http
                .get('/auth/token/refresh')
                .then(async (response) => {
                    error.response.config.headers.Authorization = 'Bearer ' + response.data.access_token
                    await AsyncStorage.setItem('token', response.data.access_token)
                    http.defaults.headers.common.Authorization = 'Bearer ' + response.data.access_token

                    return axios(error.response.config)
                })
                .catch(async (error2) => {
                    return await Promise.reject(error2)
                })
                .finally(createAxiosResponseInterceptor)
        },
    )
}

createAxiosResponseInterceptor()
