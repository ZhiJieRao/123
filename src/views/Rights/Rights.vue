<template>
  <div style="margin-top: 10px">
    <!-- 面包屑 -->
    <el-breadcrumb separator-class="el-icon-arrow-right" style="margin-bottom: 15px">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 权限列表卡片区域 -->
    <el-card class="box-card" style="margin-top: 15px">
      <el-table :data="rightsList" border stripe>
        <el-table-column label="#" type="index"></el-table-column>
        <el-table-column label="权限名称" prop="authName"></el-table-column>
        <el-table-column label="路径" prop="path"></el-table-column>
        <el-table-column label="权限等级" prop="level">
          <!-- 插槽 接受数据 -->
          <template #default="scopeProps">
            <el-tag v-if="scopeProps.row.level === '0'" hit>一级</el-tag>
            <el-tag type="warning" v-if="scopeProps.row.level === '2'" hit>三级</el-tag>
            <el-tag type="success" v-if="scopeProps.row.level === '1'" hit>二级</el-tag>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script>
export default {
  name: 'Rights',
  created() {
    this.initRightsInfo()
  },
  data() {
    return {
      //用来保存axios获取的数据
      rightsList: []
    }
  },
  methods: {
    // 获取权限列表数据
    async initRightsInfo() {
      const { data: res } = await this.$http.get('rights/list')
      if (res.meta.status != 200) {
        return this.$message.err('获取权限列表数据失败')
      }
      this.rightsList = res.data
    }
  }
}
</script>

<style lang="less" scoped>
</style>