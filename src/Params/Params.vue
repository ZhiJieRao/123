<template>
  <div style="margin-top: 10px">
    <!-- 面包屑 -->
    <el-breadcrumb separator-class="el-icon-arrow-right" style="margin-bottom: 15px">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>参数列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片区域 -->
    <el-card class="box-card globalTop">
      <el-row>
        <el-col :span="24">
          <!-- 警示框 -->
          <el-alert title="注意:只允许为第三级分类设置相关参数!" type="warning" show-icon> </el-alert>
        </el-col>
      </el-row>
      <!-- 选择商品分类 -->
      <el-row class="globalTop">
        <el-col :span="2" style="min-width: 120px">
          <span :class="['params-span']" style="min-width: 110px">选择商品分类:</span>
        </el-col>
        <el-col :span="5">
          <!-- cascaderProps为配置项 -->
          <el-cascader
            style="width: 100%"
            size="small"
            v-model="goodsClassifyValue"
            :options="goodsClassifyOptions"
            :props="cascaderProps"
            @change="handleChange"
            clearable
          ></el-cascader>
        </el-col>
      </el-row>
      <!-- Tab标签页 -->
      <el-tabs class="globalTop" v-model="activeName" @tab-click="handleTabClick">
        <!-- 动态参数 -->
        <el-tab-pane label="动态参数" name="only" ref="paneRef" :disabled="isTrue">
          <!-- 添加参数按钮 -->
          <el-row class="globalTop">
            <el-col :span="4">
              <el-button type="primary" @click="addParams" :disabled="isTrue">添加参数</el-button>
            </el-col>
          </el-row>
          <!--表格区域 -->
          <el-table class="globalTop" :data="onlyTableData" border>
            <!-- 展开列 -->
            <el-table-column type="expand">
              <template #default="slotProps">
                <el-tag
                  class="tag-margin"
                  type="primary"
                  v-for="(item, index) in slotProps.row.attr_vals"
                  :key="index"
                  @close="tagClose(index, slotProps.row)"
                  closable
                  >{{ item }}
                </el-tag>
                <!-- 动态编辑标签 -->
                <el-input
                  class="input-new-tag"
                  v-if="slotProps.row.inputVisible"
                  v-model.trim="slotProps.row.inputValue"
                  ref="saveTagInput"
                  size="small"
                  @keyup.enter.native="handleInputConfirm(slotProps.row)"
                  @blur="handleInputConfirm(slotProps.row)"
                >
                </el-input>
                <el-button v-else class="button-new-tag" size="small" @click="showInput(slotProps.row)">+ New Tag</el-button>
              </template>
            </el-table-column>
            <!-- 索引列 -->
            <el-table-column label="#" type="index"> </el-table-column>
            <el-table-column prop="attr_name" label="参数名称"> </el-table-column>
            <el-table-column label="操作">
              <template #default="slotProps">
                <el-button type="primary" icon="el-icon-edit" @click="editParams(slotProps.row)">修改</el-button>
                <el-button type="danger" icon="el-icon-delete" @click="deleteParams(slotProps.row)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
        <!-- 静态属性 -->
        <el-tab-pane label="静态属性" name="many" :disabled="isTrue">
          <!-- 添加属性按钮 -->
          <el-row class="globalTop">
            <el-col :span="4">
              <el-button type="primary" @click="addParams">添加属性</el-button>
            </el-col>
          </el-row>
          <!-- 静态属性表格区域 -->
          <el-table class="globalTop" :data="manyTableData" border>
            <!-- 展开列 -->
            <el-table-column type="expand">
              <template #default="slotProps">
                <el-tag
                  class="tag-margin"
                  type="primary"
                  v-for="(item, index) in slotProps.row.attr_vals"
                  :key="index"
                  @close="tagClose(index, slotProps.row)"
                  closable
                  >{{ item }}
                </el-tag>
                <!-- 动态编辑标签 -->
                <el-input
                  class="input-new-tag"
                  v-if="slotProps.row.inputVisible"
                  v-model.trim="slotProps.row.inputValue"
                  ref="saveTagInput"
                  size="small"
                  @keyup.enter.native="handleInputConfirm(slotProps.row)"
                  @blur="handleInputConfirm(slotProps.row)"
                >
                </el-input>
                <el-button v-else class="button-new-tag" size="small" @click="showInput(slotProps.row)">+ New Tag</el-button>
              </template>
            </el-table-column>
            <!-- 索引列 -->
            <el-table-column label="#" type="index"> </el-table-column>
            <el-table-column prop="attr_name" label="参数名称"> </el-table-column>
            <el-table-column label="操作">
              <template #default="slotProps">
                <el-button type="primary" icon="el-icon-edit" @click="editParams(slotProps.row)">修改</el-button>
                <el-button type="danger" icon="el-icon-delete" @click="deleteParams(slotProps.row)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>
      <!-- 添加参数对话框 -->
      <el-dialog :title="'添加' + titleText" :visible.sync="addDialogVisible" width="50%" @close="addFromClose">
        <!-- 表单 -->
        <el-form :model="ruleForm" :rules="rules" ref="ruleFormRef" label-width="80px" class="demo-ruleForm">
          <el-form-item :label="titleText" prop="attr_name">
            <el-input v-model="ruleForm.attr_name"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="addDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="confirmDialog">确 定</el-button>
        </span>
      </el-dialog>
      <!-- 修改参数对话框 -->
      <el-dialog :title="'修改' + titleText" :visible.sync="editDialogVisible" width="50%" @close="editFromClose">
        <!-- 表单 -->
        <el-form :model="editForm" :rules="rules" ref="editFormRef" label-width="80px" class="demo-ruleForm">
          <el-form-item :label="titleText" prop="attr_name">
            <el-input v-model="editForm.attr_name"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="editDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="confirmEdit">确 定</el-button>
        </span>
      </el-dialog>
    </el-card>
  </div>
</template>

<script>
export default {
  name: 'Params',
  created() {
    this.initGoodsList()
  },

  data() {
    return {
      goodsClassifyFrom: {},
      //选中商品分类的id
      goodsClassifyValue: [],
      //指定要渲染的数据源
      goodsClassifyOptions: [],
      //props配置项
      cascaderProps: {
        expandTrigger: 'hover',
        value: 'cat_id',
        label: 'cat_name',
        children: 'children'
      },
      //当前的标签页
      activeName: 'only',
      tableData: '',
      // 绑定tab-pane的disabled
      isTrue: true,
      //tab的name为only参数列表的数据
      onlyTableData: [],
      //tab的name为many参数列表的数据
      manyTableData: [],
      //
      addDialogVisible: false,
      //添加参数的数据项
      ruleForm: {
        attr_name: ''
      },
      //添加参数验证规则
      rules: {
        attr_name: [{ required: true, message: '请输入参数名称', trigger: 'blur' }]
      },
      //
      editDialogVisible: false,
      // //修改参数的数据项
      editForm: {
        attr_name: '',
        //分类参数id
        attr_id: ''
      },
      // //控制文本框与按钮的显示与隐藏
      // inputVisible: false,
      // //监听动态编辑标签输入的内容
      // inputValue: '',
      //
      pushParams: {}
    }
  },
  computed: {
    //获取参数列表时 返回的三级分类的id
    cateId() {
      return this.goodsClassifyValue.length === 3 ? this.goodsClassifyValue[2] : 0
    },
    // 对话框标题
    titleText() {
      if (this.activeName === 'only') return '动态参数'
      else {
        return '静态属性'
      }
    }
  },
  methods: {
    //
    async initGoodsList() {
      const { data: res } = await this.$http.get('categories')
      if (res.meta.status != 200) {
        return this.$message.error('获取商品分类数据列表失败')
      }
      this.goodsClassifyOptions = res.data
      // console.log(this.goodsClassifyOptions)
    },
    //监听级联选择器数据变化的回调
    handleChange(value) {
      //控制tabPan是否禁用
      value.length > 2 ? (this.isTrue = false) : (this.isTrue = true)
      // 清空参数列表
      if (value.length === 0) {
        this.manyTableData = []
        this.onlyTableData = []
        this.activeName = 'only'
      } else if (value.length === 1 || value.length === 2) {
        this.goodsClassifyValue = []
        return this.$message.warning('请选择第三级分类')
      }
      this.getParamsData()
    },
    //tab被选中时的回调
    handleTabClick(tab, e) {
      this.getParamsData()
    },
    //
    async getParamsData() {
      //根据所选分类的Id,和当前所处的面板,获取对应的参数
      const { data: res } = await this.$http.get(`categories/${this.cateId}/attributes`, { params: { sel: this.activeName } })
      if (res.meta.status != 200) {
        return this.$message.error('获取参数列表失败')
      }

      //将attr_vals转成数组,便于后续的循环
      res.data.forEach(item => {
        // if (item.attr_vals === '') {
        //   item.attr_vals = []
        // } else {
        //   item.attr_vals = item.attr_vals.split(' ')
        // }
        // 等价于上面的if - else
        item.attr_vals = item.attr_vals ? (item.attr_vals = item.attr_vals.split(' ')) : []
        // 利用$set动态添加数据
        this.$set(item, 'inputValue', '') //inputValue 用户输入的内容
        this.$set(item, 'inputVisible', false) //控制对话框显示与隐藏
      })
      //成功
      if (this.activeName === 'only') {
        this.onlyTableData = res.data
      } else {
        this.manyTableData = res.data
      }
    },
    // 添加参数的回调
    addParams() {
      this.addDialogVisible = true
    },
    //监听对话框关闭的回调
    addFromClose() {
      this.$refs.ruleFormRef.resetFields()
    },
    editFromClose() {
      this.$refs.editFormRef.resetFields()
    },
    //添加参数对话框点击确定的回调
    confirmDialog() {
      this.$refs.ruleFormRef.validate(async val => {
        if (!val) {
          return this.$message.error('请校验表单')
        }
        const { data: res } = await this.$http.post(`categories/${this.cateId}/attributes`, {
          attr_name: this.ruleForm.attr_name,
          attr_sel: this.activeName
        })
        this.judgeRes(res, 201, '添加参数失败', '添加参数成功')
        this.addDialogVisible = false
        this.getParamsData()
      })
    },
    //点击修改 时的回调
    async editParams(props) {
      this.editForm.attr_id = props.attr_id

      this.editDialogVisible = true
      //再输入框显示要修改的attr_name
      this.editForm.attr_name = props.attr_name
      //根据id查询参数
      const { data: res } = await this.$http.get(`categories/${this.cateId}/attributes/${props.attr_id}`, { attr_sel: this.activeName })
    },
    //修改 对话框确定按钮的回调
    confirmEdit() {
      this.$refs.editFormRef.validate(async val => {
        if (!val) {
          return this.$message.error('请校验表单')
        }
        const { data: res } = await this.$http.put(`categories/${this.cateId}/attributes/${this.editForm.attr_id}`, {
          attr_name: this.editForm.attr_name,
          attr_sel: this.activeName
        })
        this.judgeRes(res, 200, '更新失败', '更新成功')
        this.getParamsData()
        this.editDialogVisible = false
      })
    },
    //参数的删除按钮对应的回调
    async deleteParams(props) {
      const msg = await this.$confirm('此操作将永久删除该参数, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(err => err)
      if (msg === 'cancel') {
        return this.$message('已取消删除')
      } else {
        const { data: res } = await this.$http.delete(`categories/${this.cateId}/attributes/${props.attr_id}`)
        this.judgeRes(res, 200, '删除失败', '删除成功')
        this.editDialogVisible = false
        this.getParamsData()
      }
    },
    //向服务器提交参数
    async saveAttrVals(props) {
      const { data: res } = await this.$http.put(`categories/${this.cateId}/attributes/${props.attr_id}`, {
        attr_name: props.attr_name,
        attr_sel: this.activeName,
        attr_vals: props.attr_vals.join(' ')
      })
      return res
    },
    //动态编辑标签失去焦点/点击回车的回调
    async handleInputConfirm(props) {
      if (props.inputValue.trim()) {
        // 把用户添加的数据 追加到attr_vals数组中
        props.attr_vals.push(props.inputValue)
        const res = await this.saveAttrVals(props)
        this.judgeRes(res, 200, '添加参数项失败', '添加参数项成功')
      }
      props.inputValue = ''
      props.inputVisible = false
      return
    },

    //点击编辑标签时的回调
    showInput(props) {
      props.inputVisible = true
      //自动获得焦点
      // $nextTick当页面dom(input输入框)渲染完成后才执行其回调函数(使其获得焦点)
      this.$nextTick(() => {
        this.$refs.saveTagInput.$refs.input.focus()
      })
    },
    //删除动态标签
    async tagClose(index, props) {
      props.attr_vals.splice(index, 1) //修改原数组
      const res = await this.saveAttrVals(props)
      this.judgeRes(res, 200, '删除失败', '删除成功')
    }
  }
}
</script>
<style lang="less" scoped>
.params-span {
  line-height: 32px;
  font-weight: 300;
}
.tag-margin {
  margin: 10px 0 5px 30px;
}

.input-new-tag {
  width: 90px;
  margin: 0 0 5px 25px;
  vertical-align: bottom;
}

.button-new-tag {
  margin-left: 30px;
  height: 32px;
  line-height: 30px;
  padding-top: 0;
  padding-bottom: 0;
}
</style>
