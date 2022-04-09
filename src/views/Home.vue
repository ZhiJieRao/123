<template>
  <el-container>
    <!-- 头部区域 -->
    <el-header>
      <div class="header-left">
        <img src="../assets/heima.png" alt="" />
        <span>管理后台</span>
      </div>
      <el-button type="info" round @click="logout">退出</el-button>
    </el-header>
    <el-container>
      <!-- 侧边栏 -->
      <el-aside :width="isCol ? '64px' : '200px'">
        <el-button type="primary" @click="isCol = !isCol" style="width: 100%">|||</el-button>
        <!--:default-active="$route.path" 使浏览器刷新会使对应的二级菜单样式激活  -->
        <el-menu :default-active="$route.path" class="el-menu-vertical-demo" unique-opened :collapse="isCol" router background-color="rgb(49, 55, 67)" text-color="#fff" active-text-color="#ffd04b">
          <!-- 一级菜单 -->
          <!-- index是唯一标识,如果index相同 那么展开某个列表 就会造成所有列表都展开-->
          <el-submenu :index="item.id + ''" v-for="item in menus" :key="item.id">
            <template slot="title">
              <!-- 图标 -->
              <i :class="[iconObj[item.id]]"></i>
              <span>{{ item.authName }}</span>
            </template>
            <!-- 二级菜单 -->
            <el-menu-item :index="'/' + item.path" v-for="item in item.children" :key="item.id">
              <i class="el-icon-s-operation"></i>
              <span>{{ item.authName }}</span>
            </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>
      <!-- 主要区域容器 -->
      <el-main>
        <!-- 路由占位符 -->
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
  <!-- 退出按钮 -->
</template>

<script>
export default {
  name: 'Home',
  created() {
    this.initMenus()
  },
  data() {
    return {
      // 将获取到的左侧菜单数据用menus保存
      menus: [],
      //一级菜单对应的图标
      iconObj: {
        125: 'el-icon-s-custom',
        103: 'el-icon-s-opportunity',
        101: 'el-icon-finished',
        102: 'el-icon-loading',
        145: 'el-icon-view'
      },
      //用来控制侧边栏的展开与收缩
      isCol: false
    }
  },
  computed: {},
  methods: {
    // 点击退出按钮,清空sessionStorage的token
    logout() {
      window.sessionStorage.clear()
      this.$router.push('/login')
    },
    //获取左侧菜单数据
    async initMenus() {
      const { data: res } = await this.$http.get('menus')
      if (res.meta.status !== 200) {
        return this.$message.error(res.meta.msg)
      }
      this.menus = res.data
    }
  }
}
</script>

<style lang="less" scoped>
.el-container {
  height: 100%;
}
.el-header {
  background-color: rgb(84, 92, 100);
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: #fff;
  .header-left {
    display: flex;
    align-items: center;
  }
  span {
    padding-left: 20px;
    font-size: 36px;
    font-weight: 100;
  }
}
.el-aside {
  background-color: rgb(49, 55, 67);
  .el-menu {
    border: 0;
  }
  .toggle-btn {
    background-color: rgb(71, 81, 99);
  }
}
</style>
