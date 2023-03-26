//封装方法 =》请求后端接口
import ajax from "./ajax"
let baseURL = "/api"
//封装登录的方法
export const loginApi = (name: any, password: any) => ajax(`${baseURL}/login/${name}-${password}`)
//封装获取支部管理员列表数据的方法
export const getadminusers = () => ajax(`${baseURL}/getadminusers`)
//封装支部管理员添加的方法
export const adduser = (G_ZH: any, G_MM: any, G_SQ: any, G_DZZ: any) => ajax(`${baseURL}/addusers/${G_ZH}-${G_MM}-${G_SQ}-${G_DZZ}`)
//封装支部管理员搜索方法
export const searchusers = (keyword: any) => ajax(`${baseURL}/searchusers/${keyword}`)
//封装支部管理员删除的方法
export const deluser = (id: any) => ajax(`${baseURL}/delusers/${id}`)
//封装支部管理员修改方法
export const updateuser = (id: any, G_ZH: any, G_MM: any, G_SQ: any, G_DZZ: any) => ajax(`${baseURL}/updateusers/${id}-${G_ZH}-${G_MM}-${G_SQ}-${G_DZZ}`)
// 封装角色获取方法
export const getroles = () => ajax(`${baseURL}/getroles`)
//封装支部管理员分配方法
export const setroles = (id: any, G_SF: any) => ajax(`${baseURL}/roleusers/${id}-${G_SF}`)