<template>
  <div style="margin-top: 10px">
    <!-- 面包屑 -->
    <el-breadcrumb separator-class="el-icon-arrow-right" style="margin-bottom: 15px">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品分类</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card class="box-card" style="margin-top: 15px">
      <el-row>
        <el-col :span="6">
          <!-- 添加分类按钮 -->
          <el-button type="primary" @click="addGoodsClassify">添加分类</el-button>
        </el-col>
        <!-- 添加分类 弹出框Dialog -->
        <el-dialog title="添加分类:" :visible.sync="classifyDialogVisible" width="50%" @close="closeAddDialog">
          <el-form :model="classifyRuleForm" :rules="classifyRules" ref="classifyRuleFormRef" label-width="100px" class="demo-ruleForm">
            <el-form-item label="分类名称 :" prop="cat_name">
              <el-input v-model.trim="classifyRuleForm.cat_name"></el-input>
            </el-form-item>
            <!-- 级联选择器 -->
            <el-form-item label="父级分类 :">
              <!-- cascaderProps为配置项 -->
              <el-cascader
                style="width: 100%"
                size="small"
                v-model="classifyValue"
                :options="classifyOptions"
                :props="cascaderProps"
                @change="handleChange"
                clearable
              ></el-cascader>
            </el-form-item>
          </el-form>
          <span slot="footer" class="dialog-footer">
            <el-button @click="classifyDialogVisible = false">取 消</el-button>
            <el-button type="primary" @click="confirmCase">确 定</el-button>
          </span>
        </el-dialog>
      </el-row>
      <!-- 商品表格区域 -->
      <zk-table
        :data="GoodsList"
        :columns="columns"
        :selection-type="false"
        :expand-type="false"
        index-text="#"
        show-index
        border
        style="margin-top: 15px"
      >
        <!-- 是否有效 -->
        <template #isOk="slotProps">
          <!-- 具名插槽和作用域插槽的简写 -->
          <i class="el-icon-check" v-if="slotProps.row.cat_deleted === true" style="color: lightgreen"></i>
          <i class="el-icon-close" v-else style="color: red"></i>
        </template>
        <!-- 排序 -->
        <template #rank="slotProps">
          <el-tag v-if="slotProps.row.cat_level === 0">{{ slotProps.row.cat_level + 1 }}级</el-tag>
          <el-tag v-else-if="slotProps.row.cat_level === 1" type="success">{{ slotProps.row.cat_level + 1 }}级</el-tag>
          <el-tag v-else type="warning">{{ slotProps.row.cat_level + 1 }}级</el-tag>
        </template>
        <!-- 操作 -->
        <template #option="slotProps">
          <el-button type="primary" icon="el-icon-edit">编辑</el-button>
          <el-button type="danger" icon="el-icon-delete">删除</el-button>
        </template>
      </zk-table>
      <!-- 分页区域 -->
      <div class="block" style="margin-top: 15px">
        <el-pagination
          @current-change="handleCurrentChange"
          :total="total"
          :page-size="pages.pagesize"
          :current-page.sync="pages.pagenum"
          layout="total, prev, pager, next"
          background
        >
        </el-pagination>
      </div>
    </el-card>
  </div>
</template>

<script>
export default {
  name: 'GoodsCate',
  created() {
    this.initGoodsList()
  },
  data() {
    return {
      //有关商品的数据
      GoodsList: [],
      pages: {
        type: 3,
        //当前页码值
        pagenum: 1,
        //每页显示多少条数据
        pagesize: 5
      },
      //总数据条数
      total: 0,
      //为table指定列的定义
      columns: [
        {
          label: '分类名称',
          prop: 'cat_name'
        },
        {
          label: '是否有效',
          type: 'template',
          template: 'isOk'
        },
        {
          label: '排序',
          type: 'template',
          template: 'rank'
        },
        {
          label: '操作',
          minWidth: '150px',
          type: 'template',
          template: 'option'
        }
      ],
      //
      classifyDialogVisible: false,
      //添加分类的表单数据项
      classifyRuleForm: {
        //分类名称
        cat_name: '',
        // 分类父 ID
        cat_pid: 0,
        //分类当前层级
        cat_level: 0
      },
      //添加分类的验证规则
      classifyRules: {
        cat_name: [{ required: true, message: '请输入分类名称', trigger: 'blur' }]
      },
      // 选中父级分类的ID数组
      classifyValue: [],
      //添加分类时 请求type的列表数据
      classifyOptions: [],
      // 级联选择器props 配置
      cascaderProps: {
        expandTrigger: 'hover',
        value: 'cat_id',
        label: 'cat_name',
        children: 'children',
        checkStrictly: true
      }
    }
  },
  methods: {
    async initGoodsList() {
      const { data: res } = await this.$http.get('categories', { params: this.pages })
      this.GoodsList = res.data.result
      this.total = res.data.total
      // console.log(this.GoodsList)
    },

    //监听当前的页码
    handleCurrentChange(val) {
      this.pages.pagenum = val
      this.initGoodsList()
    },
    //点击添加分类按钮
    async addGoodsClassify() {
      this.classifyDialogVisible = true
      const { data: res } = await this.$http.get('categories', { params: { type: 2 } })
      if (res.meta.status === 200) {
        this.classifyOptions = res.data
      }
    },
    //当级联选择器的值改变时
    handleChange(value) {
      //判断选中的是几级分类
      // 如果选中的是二级分类、三级分类，则
      if (value.length > 0) {
        //计算出分类层级
        this.classifyRuleForm.cat_level = value.length
        //计算出分类父级ID
        this.classifyRuleForm.cat_pid = value[value.length - 1]
      }
      // 否则选中的就是一级分类
      else {
        this.classifyRuleForm.cat_level = 0
        this.classifyRuleForm.cat_pid = 0
      }
    },
    //关闭添加分类的对话框
    closeAddDialog() {
      //清空级联选择器
      this.classifyValue = []
      // this.classifyRuleForm.cat_name = ''
      this.classifyRuleForm.cat_level = 0
      this.classifyRuleForm.cat_pid = 0
      //清空form
      this.$refs.classifyRuleFormRef.resetFields()
    },
    //添加分类的对话框的确定按钮的回调
    confirmCase() {
      this.$refs.classifyRuleFormRef.validate(async val => {
        if (!val) {
          return this.$message.error('请输入对应的分类')
        }
        const { data: res } = await this.$http.post('categories', this.classifyRuleForm)
        if (res.meta.status === 201) {
          //
          this.closeAddDialog()
          //
          this.classifyDialogVisible = false
          return this.$message.success('添加分类成功')
        }
      })
    }
  }
}
</script>

<style lang="less">
.el-cascader-panel {
  max-height: 200px;
}
</style>
