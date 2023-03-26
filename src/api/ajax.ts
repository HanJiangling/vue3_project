//放置的是封装的axios库
//封装下axios库(先直接拿过来用,大体给你解释下,后续我们会亲自写)
/*ajax 请求函数模块
 */
//axios库在使用的时候 一般会结合谁？ 请求拦截器和响应拦截器(vue3项目里加)
//导入axios
import axios from 'axios'
import { ElMessage } from "element-plus";
import { useRouter } from "vue-router";
// 请求拦截器存在两个函数参数，分别是允许请求发送，不允许请求发送
axios.interceptors.request.use(
  // console.log()
   // config 就是请求对象
  (config) => {
    // console.log(config)
    const token = localStorage.getItem('token')
    // 将token添加到请求对象的请求头中，跟随请求一并发送至服务器
    if (token) config.headers.Authorization = `Bearer ${token}`;
    // 请求拦截器，允许请求发送的话别忘了给请求对象返回出去，否则请求发不出去
    return config
  },
  (error) => Promise.reject(error),
)
let router = useRouter();
// 这里我们假设通过后端响应的数据中的值判断响应是否成功
axios.interceptors.response.use(
  (response:any) => {    
    console.log(response) 
    const res = response.data
    if (res.msg && res.msg !== "ok") {
      //判断下token有没有
      if(!response.config.headers['Authorization']){
        ElMessage.error("token过期,请重新登录");
        router.push("/login")
      }
      
      //请求失败（302，404...根据和后端约定好的状态码做出不同的处理）
      if(res.status===404){
        ElMessage.error("请求页面找不到");
      }
      if(res.status===500){
        ElMessage.error("服务器有问题");
      }
      if(res.status===401){
        ElMessage.error("服务器正在维护请稍后再试");

      }

      //提示出信息
  }else{
      //请求成功
      // return response或者res(具体看情况)
      return response
  }
  },
  error=>{
      return Promise.reject(error)
  }
)
//暴露一个方法  ajax====axios
//url=》通过axios请求的后端接口的地址
//data=>通过axios请求的后端接口的时候附加的参数
//type=>axios请求类型 get  post 
export default function ajax(url = '', data:any = {}, type = 'GET') {
  return new Promise(function (resolve, reject) {
    let promise
    if (type === 'GET') {
        // http://localhost:8000/admins?name=李海&pass=123456
      // 准备 url query 参数数据
      let dataStr = '' // 数据拼接字符串
      Object.keys(data).forEach(key => {
        dataStr += key + '=' + data[key] + '&'
      })
      if (dataStr !== '') {
        dataStr = dataStr.substring(0, dataStr.lastIndexOf('&'))
        url = url + '?' + dataStr
      }
      // 发送 get 请求
      promise = axios.get(url)
    } else {
      // 发送 post 请求
      promise = axios.post(url, data)
    }
    promise.then(response => {
        resolve(response.data) //返回后端数据
      })
      .catch(error => {
        reject(error) //后端没有成功返回响应数据 暴露一些错误
      })
  })
}
