<template>
  <div class="globalTop">
    <!-- 面包屑 -->
    <el-breadcrumb separator-class="el-icon-arrow-right" style="margin-bottom: 15px">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>参数列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片区域 -->
    <el-card class="box-card globalTop">
      <el-row :gutter="20">
        <el-col :span="6">
          <!-- 搜索框 -->
          <el-input placeholder="请输入内容" v-model="queryInfo.query" class="input-with-select,globalTop" clearable @clear="initGoodsList">
            <el-button slot="append" icon="el-icon-search" @click="initGoodsList"></el-button>
          </el-input>
        </el-col>
        <el-col :span="2">
          <!-- 添加商品 -->
          <el-button type="primary" @click="goAddPage">添加商品</el-button>
        </el-col>
      </el-row>
      <!-- 表格区域 -->
      <div class="globalTop">
        <el-table :data="GoodsList" border style="width: 100%" highlight-current-row>
          <el-table-column label="#" type="index"></el-table-column>
          <el-table-column prop="goods_name" label="商品名称" width="670"> </el-table-column>
          <el-table-column prop="goods_price" label="商品价格(元)"> </el-table-column>
          <el-table-column prop="goods_weight" label="重量"> </el-table-column>
          <el-table-column label="创建时间" width="180">
            <template #default="slotProps">
              {{ slotProps.row.add_time | dataFormat }}
            </template>
          </el-table-column>
          <el-table-column label="操作">
            <template #default="slotProps">
              <el-button type="primary" icon="el-icon-star-off" circle size="mini"></el-button>
              <el-button type="danger" icon="el-icon-delete" circle size="mini" @click="removeById(slotProps.row.goods_id)"></el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <!-- 分页区域 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :page-sizes="[1, 2, 5]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
        class="globalTop"
        background
      >
      </el-pagination>
    </el-card>
  </div>
</template>

<script>
export default {
  name: 'List',
  created() {
    this.initGoodsList()
  },
  data() {
    return {
      //要查询的参数,页码和每页显示的条数
      queryInfo: {
        query: '',
        pagenum: 1,
        pagesize: 10
      },
      // 总数据条数
      total: 0,
      //商品列表数据源
      GoodsList: []
    }
  },
  methods: {
    //
    async initGoodsList() {
      const { data: res } = await this.$http.get('goods', { params: this.queryInfo })
      this.judgeRes(res, 200, '获取列表商品失败')
      this.GoodsList = res.data.goods
      this.total = res.data.total
    },
    handleSizeChange(val) {
      this.queryInfo.pagesize = val
      this.initGoodsList()
    },
    handleCurrentChange(val) {
      this.queryInfo.pagenum = val
      this.initGoodsList()
    },
    async removeById(id) {
      const msg = await this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(err => err)
      if (msg != 'confirm') {
        return this.$message.info('已取消删除')
      }
      const { data: res } = await this.$http.delete('goods/' + id)
      this.judgeRes(res, 200, '删除失败', '删除成功')
      this.initGoodsList()
    },
    async goAddPage() {
      //跳转到添加商品页面
      this.$router.push('/goods/add')
    }
  }
}
</script>
<style lang="less" scoped>
</style>