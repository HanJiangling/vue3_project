<template>
  <div class="clearfix" id="login_wrap">
    <h2 class="title">登陆</h2>
    <div id="login">
      <div class="login--account">
        <span>账号：</span>
        <input
          type="text"
          placeholder="请输入账号"
          name="account"
          v-model.trim="name"
        />
      </div>
      <div class="login--password">
        <span>密码：</span>
        <input
          type="password"
          placeholder="请输入密码"
          name="password"
          v-model.trim="pass"
          @keyup.enter="login"
        />
      </div>
      <p class="login--btn">
        <button class="theme-all" id="loginBtn" @click="login">登录</button>
      </p>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from "vue";
import { useRouter } from "vue-router";
import { useStore } from "vuex";
// 导入登录的方法
import { loginApi } from "../../api/index";
// 导入弹出框组件
import { ElMessage } from "element-plus";
import md5 from "js-md5";
export default defineComponent({
  setup() {
    let router = useRouter();
    let store = useStore();
    // 初始化账号和密码
    let name = ref("");
    let pass = ref("");

    // 登陆方法
    async function login() {
      // 验证账号密码
      if (name.value == "") {
        ElMessage.error("账号不能为空");
        return;
      } else if (pass.value == "") {
        ElMessage.error("密码不能为空");
        return;
      }

      let res: any = await loginApi(name.value, pass.value);

      if (res.msg == "ok") {
        ElMessage({
          message: "登录成功",
          type: "success",
        });

        // 把登录的信息存储在本地localStorage里
        let token = md5(name.value);
        window.localStorage.setItem("token", token);
        window.localStorage.setItem("token1", name.value);

        // 跳转到首页
        router.push("/home");
      } else if (res.msg == "nameerror") {
        console.log("管理员密码有误");
        ElMessage.error("管理员密码有误");
        return;
      } else if (res.msg == "passwordcerror") {
        console.log("超级管理员密码有误");
        ElMessage.error("超级管理员密码有误");
        return;
      } else if (res.msg == "passwordzerror") {
        console.log("支部管理员密码有误");
        ElMessage.error("支部管理员密码有误");
        return;
      }
    }
    return {
      login,
      name,
      pass,
    };
  },
});
</script>

<style scoped lang="scss">
.title {
  text-align: center;
  font-size: 22px;
  padding-top: 100px;
}
#login_wrap {
  position: relative;
  background: rgba(64, 64, 194, 0.1);
  height: 100vh;
  > div {
    background: #fff;
    width: 479px;
    height: 325px;
    padding: 30px 40px;
    position: absolute;
    top: 40%;
    left: 50%;
    transform: translate(-50%, -50%);
    > div {
      padding: 10px 0;
      border-bottom: 1px solid #ddd;
      &.login--account {
        margin: 25px 0 30px;
      }
      span {
        color: #666;
        display: inline-block;
        width: 84px;
        font-size: 20px;
      }
      input {
        background: none;
        font-size: 16px;
        border: none;
        height: 30px;
        width: 280px;
        padding-left: 12px;
        box-sizing: border-box;
        color: #666;
        &.error {
          border: 1px solid #f00;
        }
        &::-webkit-input-placeholder {
          color: #aaa;
        }
      }
    }

    p {
      text-align: right;
      &.login--btn {
        button {
          width: 100%;
          height: 50px;
          font-size: 18px;
          background: #0f6171;
          border: none;
          margin-top: 30px;
          color: #fff;
          border-radius: 6px;
          cursor: pointer;
        }
      }
      a {
        color: #fff;
        display: inline-block;
        padding: 0 15px;
        font-size: 14px;
      }
    }
  }
}
</style>
