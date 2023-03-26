import { createRouter, createWebHashHistory, RouteRecordRaw } from "vue-router";
import store from "@/store/index";
//进度条
import NProgress from 'nprogress';
import 'nprogress/nprogress.css';
const routes: Array<RouteRecordRaw> = [
    {
        path: "/login",
        name: "login",
        component: () => import("@/views/login/login.vue"),
    },

];

const router = createRouter({
    history: createWebHashHistory(),
    routes,
});

router.beforeEach((to: any, from: any, next: any) => {
    NProgress.start();
    //未登陆
    if (!window.localStorage.getItem("token") && to.path !== "/login") {
        return next({ path: "/login" });
    };
    //已登陆
    if (window.localStorage.getItem("token") && to.path == "/login") return next({ path: "/" });
    //重新加载动态路由
    if (!store.state.permissionList && to.path != '/login') {
        // router.removeRoute('router');
        return store.dispatch("FETCH_PERMISSION").then(() => {
            next({ ...to, replace: true });
        });
    } else {
        next();
    }
});
router.afterEach((to: any, from: any, next: any) => {
    NProgress.done();
    try {
        //设置标题
        if (to.meta.name) {
            document.title = to.meta.name;
        }
    } catch (err) { }
    let routerList = to.matched;
    //顶部面包屑
    store.commit("setCrumbList", routerList);
    //目前左边导航选中的active
    store.commit("SET_CURRENT_MENU", to.name);
});
/* 固定的路由 */
/*
    meta:{
        name:侧边栏名字,
        icon:侧边栏图标,
        hide:是否在侧边栏隐藏
    }
*/
export const DynamicRoutes = [
    {
        path: "",
        component: () => import("@/components/nav/nav.vue"),
        name: "container",
        // redirect: 'home',
        meta: {
            // requiresAuth: true,
            name: "首页",
        },
        children: [
            {
                path: "home",
                component: () => import("@/views/home/home.vue"),
                name: "home",
                meta: {
                    name: "首页",
                    icon: "el-icon-s-home",
                },
            },
            // 主题管理
            {
                path: "color",
                component: () => import("@/views/color/color.vue"),
                name: "color",
                meta: {
                    name: "主题管理",
                    icon: "el-icon-brush",
                },
            },
            //权限管理
            {
                path: "acl",
                component: () => import("@/views/acl/index.vue"),
                name: "acl",
                meta: {
                    name: "权限管理",
                    icon: "el-icon-lock",
                },
                children: [
                    // 支部管理员
                    {
                        path: "user/list",
                        component: () => import("@/views/acl/user/list.vue"),
                        name: "user/list",
                        meta: {
                            name: "支部管理员",
                            icon: "el-icon-user",
                        },
                    },
                    //角色管理员
                    {
                        path: "role/list",
                        component: () => import("@/views/acl/role/list.vue"),
                        name: "role/list",
                        meta: {
                            name: "角色管理员",
                            icon: "el-icon-setting",
                        },
                    },
                    //权限节点
                    {
                        path: "permission/list",
                        component: () => import("@/views/acl/permission/list.vue"),
                        name: "permission/list",
                        meta: {
                            name: "权限节点",
                            icon: "el-icon-menu",
                        },
                    }
                ]
            },
            //党员和会议管理
            {
                path: "member",
                component: () => import("@/views/member/index.vue"),
                name: "member",
                meta: {
                    name: "党员和会议管理",
                    icon: "el-icon-house",
                },
                children: [
                    // 党员信息管理
                    {
                        path: "users/list",
                        component: () => import("@/views/member/users/list.vue"),
                        name: "users/list",
                        meta: {
                            name: "党员信息管理",
                            icon: "el-icon-user",
                        },
                    },
                    // 批量导入
                    {
                        path: "allimport/list",
                        component: () => import("@/views/member/allimport/list.vue"),
                        name: "allimport/list",
                        meta: {
                            name: "批量导入",
                            icon: "el-icon-plus",
                        },
                    },
                    //会议管理
                    {
                        path: "meeting/list",
                        component: () => import("@/views/member/meeting/list.vue"),
                        name: "meeting/list",
                        meta: {
                            name: "会议管理",
                            icon: "el-icon-more",
                        },
                    }
                ]
            },


        ]

    }
];

export default router;
