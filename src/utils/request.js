// 引入axios
import axios from 'axios';
// request对象，用于发送请求到后端
const request = axios.create({
    timeout: 5000,
})

// request拦截器处理，可以对请求做统一的处理
request.interceptors.request.use((config) => {
    config.headers["content-type"] = "application/json;charset=UTF-8";
    return config;
}, (error) => {
    return Promise.reject(error);
})


// response拦截器。在调用接口相应后，统一处理返回结果
request.interceptors.response.use((response) => {
    let res =  response.data;
    if(response.config.responseType === "blob"){
        return res;
    }
    if(typeof res === 'string'){
        // 如果是string，就转换成json对象
        res = res ? JSON.parse(res) : res;
    }
    return res;
}, (error) => {
    console.log(error);
    return Promise.reject(error);
})

//导出
export default request;