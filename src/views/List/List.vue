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
          <el-table-column prop="goods_name" label="商品名称" width="500"> </el-table-column>
          <el-table-column prop="goods_price" label="商品价格(元)"> </el-table-column>
          <el-table-column prop="goods_weight" label="重量"> </el-table-column>
          <el-table-column prop="goods_number" label="数量"> </el-table-column>
          <el-table-column label="创建时间" width="180">
            <template #default="slotProps">
              {{ slotProps.row.add_time | dataFormat }}
            </template>
          </el-table-column>
          <el-table-column label="操作">
            <template #default="slotProps">
              <!-- 编辑功能做不了 -- API文档不全 -->
              <el-button type="primary" icon="el-icon-edit" circle size="mini" @click="addById(slotProps.row.goods_id)"></el-button>
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
      <!-- 修改商品 -->
      <el-dialog title="修改商品" center :visible.sync="editDialogVisible" width="50%">
        <!-- 表单区域 -->
        <el-form :model="editForm" :rules="editRules" ref="ruleRef" label-width="110px" class="demo-ruleForm">
          <el-form-item label="商品名称" prop="goods_name">
            <el-input v-model="editForm.goods_name"></el-input>
          </el-form-item>
          <el-form-item label="商品价格(元)" prop="goods_price">
            <el-input v-model="editForm.goods_price"></el-input>
          </el-form-item>
          <el-form-item label="商品重量" prop="goods_weight">
            <el-input v-model="editForm.goods_weight"></el-input>
          </el-form-item>
          <el-form-item label="商品数量" prop="goods_number">
            <el-input v-model="editForm.goods_number"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="editDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="confirmById">确 定</el-button>
        </span>
      </el-dialog>
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
      GoodsList: [],
      //
      editDialogVisible: false,
      //商品id
      goods_id: 0,
      //要修改的商品信息
      editForm: {
        goods_cat: [1, 3, 6],
        goods_name: '',
        goods_price: 0,
        goods_weight: 0,
        goods_number: 1
      },
      //修改商品的验证规则
      editRules: {
        goods_name: [{ required: true, message: '请输入商品名称', trigger: 'blur' }],
        goods_price: [{ required: true, message: '请输入价格(元)', trigger: 'blur' }],
        goods_weight: [{ required: true, message: '请输入重量', trigger: 'blur' }],
        goods_number: [{ required: true, message: '请输入数量', trigger: 'blur' }]
      }
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
    },
    //获取商品信息
    async addById(id) {
      this.goods_id = id
      this.editDialogVisible = true
      const { data: res } = await this.$http.get('goods/' + id)
      this.judgeRes(res, 200, '查询商品失败')
      //成功
      this.editForm.goods_name = res.data.goods_name
      this.editForm.goods_price = res.data.goods_price
      this.editForm.goods_weight = res.data.goods_weight
      this.editForm.goods_number = res.data.goods_number
    },
    //点击确定，修改商品信息
    async confirmById() {
      const { data: res } = await this.$http.put('goods/' + this.goods_id, this.editForm)
      console.log(res)
      this.initGoodsList()
      this.editDialogVisible = false
    }
  }
}
</script>
<style lang="less" scoped>
</style>