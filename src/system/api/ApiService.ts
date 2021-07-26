import axios, { AxiosResponse } from 'axios'

export const ApiService = axios.create({
  baseURL: '',
  timeout: 10000,
})


ApiService.interceptors.response.use(
  (response: AxiosResponse) => {

    // console.log
   console.log('res', response.status)
    return response.data
  },
  // (error: AxiosError) => {
  //   console.log('ERROR')
  // }
)

// ApiService.interceptors.request.use(function (config) {
//   // Do something before request is sent
//   console.log(config)
//   return config;
// }, function (error) {
//   // Do something with request error
//   return Promise.reject(error);
// })