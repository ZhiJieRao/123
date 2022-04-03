<template>
  <div class="login_cotainer">
    <div class="login_box">
      <!-- 头部区域 -->
      <div class="login_img">
        <img src="../assets/logo.png" alt="" />
      </div>
      <!-- 注册区域 -->
      <el-form class="login_nav" :model="loginForm" :rules="rules" ref="loginForm">
        <el-form-item prop="username">
          <el-input prefix-icon="el-icon-user-solid" v-model="loginForm.username"></el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input prefix-icon="iconfont icon-lock_fill" v-model="loginForm.password" show-password></el-input>
        </el-form-item>
        <el-form-item class="login_btn">
          <el-button type="primary" @click="login">登录</el-button>
          <el-button type="info" @click="resetForm('loginForm')">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      //用户名和密码
      loginForm: {
        username: 'admin',
        password: '123456'
      },
      //表单的校验规则
      rules: {
        // 这里的定义的名字(username)必须和前面定义的名字(username)一样才能生效
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          { min: 3, max: 6, message: '长度在 3 到 6 个字符', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 3, max: 12, message: '长度在 3 到 12 个字符', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    //点击重置按钮，重置表单
    resetForm(forName) {
      this.$refs[forName].resetFields()
    },
    //点击登录按钮,进行预校验
    login() {
      this.$refs.loginForm.validate(async (istrue, obj) => {
        //如果预校验错误 return
        if (!istrue) {
          return
        }
        //axios请求数据
        const { data: res } = await this.$http.post('login', this.loginForm)
        if (res.meta.status != 200) {
          return this.$message.error('登录失败')
        }
        /* 
          登录成功则把token存入sessionStorage，然后跳转home组件
        */
        this.$message.success('登录成功')
        window.sessionStorage.setItem('token', res.data.token)
        this.$router.push('/home')
      })
    }
  }
}
</script>

<style lang="less" scoped>
.login_cotainer {
  background-color: #2b4b6b;
  height: 100%;
  .login_box {
    position: absolute;
    width: 450px;
    height: 300px;
    background-color: aliceblue;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }

  .login_img {
    // border: 1px solid orange;
    height: 130px;
    width: 130px;
    border-radius: 50%;
    padding: 10px;
    box-sizing: border-box;
    position: absolute;
    left: 50%;
    transform: translate(-50%, -50%);
    background-color: #fff;
    box-shadow: 0 0 7px #fefefe;

    img {
      height: 100%;
      width: 100%;
      border-radius: 50%;
      border: 1px solid rgb(222, 218, 218);
    }
  }

  .login_nav {
    position: absolute;
    bottom: 25px;
    width: 100%;
    padding: 0 20px;
    box-sizing: border-box;
  }
  .login_btn {
    // display: flex;
    float: right;
  }
}
</style>