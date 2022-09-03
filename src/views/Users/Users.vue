<template>
  <div style="margin-top: 10px">
    <!-- 面包屑 -->
    <el-breadcrumb separator-class="el-icon-arrow-right" style="margin-bottom: 15px">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 输入框 添加按钮 -->
    <el-row :gutter="20">
      <el-col :span="8">
        <div class="grid-content bg-purple">
          <!-- 为文本框添加v-model绑定query查询参数 和清空事件clear -->
          <el-input placeholder="请输入内容" class="input-with-select" clearable v-model="params.query" @clear="initUserList">
            <el-button slot="append" icon="el-icon-search" @click="initUserList"></el-button>
          </el-input>
        </div>
      </el-col>
      <el-col :span="4"
        ><div class="grid-content bg-purple">
          <!-- 添加用户按钮 -->
          <el-button type="primary" @click="dialogVisible = true" plain>添加用户</el-button>
          <!-- 添加用户对话框 -->
          <el-dialog title="添加用户" :visible.sync="dialogVisible" width="45%" @close="addDialogClose">
            <!-- 内容主体区域 -->
            <el-form :model="ruleForm" :rules="rules" ref="ruleFormRef" label-width="80px" class="demo-ruleForm" status-icon>
              <!-- 添加用户输入框 -->
              <el-form-item label="用户" prop="username">
                <el-input v-model="ruleForm.username"></el-input>
              </el-form-item>
              <!-- 添加密码输入框 -->
              <el-form-item label="密码" prop="password">
                <el-input v-model="ruleForm.password"></el-input>
              </el-form-item>
              <!-- 添加邮箱输入框 -->
              <el-form-item label="邮箱" prop="email">
                <el-input v-model="ruleForm.email"></el-input>
              </el-form-item>
              <!--  -->
              <el-form-item label="手机号码" prop="mobile">
                <el-input v-model="ruleForm.mobile"></el-input>
              </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
              <el-button @click="dialogVisible = false">取 消</el-button>
              <el-button type="primary" @click="addDialog">添加</el-button>
            </span>
          </el-dialog>
        </div></el-col
      >
    </el-row>
    <!--  -->
    <el-card class="box-card" style="margin-top: 15px">
      <!-- 表格区域 -->
      <el-table :data="userList">
        <el-table-column label="#" type="index"></el-table-column>
        <el-table-column label="姓名" prop="username"> </el-table-column>
        <el-table-column label="日期" prop="create_time"> </el-table-column>
        <el-table-column label="邮箱" prop="email"> </el-table-column>
        <el-table-column label="用户状态" prop="mg_state">
          <!-- 作用域插槽 -->
          <!-- 插槽定义的时候可以添加数据,然后使用者制定插槽的时候用作用域插槽可以接收到一个对象 -->
          <!-- slotProps.row row是内置属性 意思是拿到当前行 -->
          <template #default="slotProps">
            <!-- {{ slotProps.row }} -->
            <el-switch v-model="slotProps.row.mg_state" active-color="#13ce66" inactive-color="#ff4949" @change="switchState(slotProps.row)">
            </el-switch>
          </template>
        </el-table-column>
        <el-table-column label="管理员" prop="role_name"> </el-table-column>
        <el-table-column label="手机号码" prop="mobile"> </el-table-column>
        <el-table-column label="操作" width="185">
          <template #default="slotProps">
            <!-- 修改按钮 -->
            <el-button type="primary" icon="el-icon-edit" size="mini" @click="editDialog(slotProps.row.id)"> </el-button>
            <!-- 删除按钮 -->
            <el-button type="danger" icon="el-icon-delete" size="mini" @click="deleteUserInfo(slotProps.row.id)"></el-button>
            <!-- 分配角色按钮 -->
            <el-tooltip effect="dark" content="分配角色" placement="top-start" :enterable="false">
              <el-button type="warning" icon="el-icon-star-off" size="mini"></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
        <!-- 修改用户对话框 -->
        <el-dialog title="修改用户信息" :visible.sync="editDialogVisible" width="50%" append-to-body>
          <el-form :model="editForm" :rules="rules" ref="editFormRef" label-width="100px" class="demo-ruleForm">
            <!-- 用户名 -->
            <el-form-item label="用户名" prop="username">
              <el-input v-model="editForm.username" disabled></el-input>
            </el-form-item>
            <!-- 邮箱 -->
            <el-form-item label="邮箱" prop="email">
              <el-input v-model="editForm.email"></el-input>
            </el-form-item>
            <!-- 手机号码 -->
            <el-form-item label="手机号码" prop="mobile">
              <el-input v-model="editForm.mobile"></el-input>
            </el-form-item>
          </el-form>
          <span slot="footer" class="dialog-footer">
            <el-button @click="editCancel">取 消</el-button>
            <el-button type="primary" @click="editConfirm(editForm.id)">确 定</el-button>
          </span>
        </el-dialog>
      </el-table>
      <!-- 分页区域 -->
      <div class="block">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :page-sizes="[1, 2, 5]"
          :page-size="params.pagesize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="totals"
        >
        </el-pagination>
      </div>
    </el-card>
  </div>
</template>

<script>
export default {
  name: 'Users',
  created() {
    this.initUserList()
  },
  data() {
    //定义邮箱的验证规则
    const checkEmail = (rule, value, callback) => {
      const emailRules =
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      if (emailRules.test(value)) {
        return callback()
      }
      callback(new Error('邮箱规则不正确'))
    }
    //定义手机号码的验证规则
    const checkPhone = (rule, value, callback) => {
      const phoneRules = /^(?:(?:\+|00)86)?1\d{10}$/
      if (phoneRules.test(value)) {
        return callback()
      }
      callback(new Error('请输入正确的手机号'))
    }

    return {
      //用来存放axios获取的数据
      userList: [],
      //向服务器发送的参数
      params: {
        //查询参数
        query: '',
        //当前页码
        pagenum: 1,
        //每页显示条数
        pagesize: 2
      },
      //总记录数
      totals: 0,
      //控制对话框的显示与隐藏 false代表隐藏
      dialogVisible: false,
      //添加用户的表单数据
      ruleForm: {
        // 用户名
        username: '',
        //
        password: '',
        //
        email: '',
        //
        mobile: ''
      },
      //添加用户的验证规则
      rules: {
        //用户名的验证规则
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          { min: 3, max: 8, message: '长度在 3 到 8 个字符', trigger: 'blur' }
        ],
        //
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { require: true, min: 6, max: 12, message: '长度在 6 到 12 个字符', trigger: 'blur' }
        ],
        //
        email: [
          { required: true, message: '请输入邮箱', trigger: 'blur' },
          { validator: checkEmail, trigger: 'blur' }
        ],
        //
        mobile: [
          { required: true, message: '请输入手机号码', trigger: 'blur' },
          { validator: checkPhone, trigger: 'blur' }
        ]
      },
      //控制修改用户对话框的显示与隐藏
      editDialogVisible: false,
      //修改用户信息
      editForm: {}
    }
  },
  methods: {
    //获取用户列表数据
    async initUserList() {
      const { data: res } = await this.$http.get('users', { params: this.params })
      if (res.meta.status != 200) {
        this.$message.error(res.meta.msg)
      }
      this.totals = res.data.total
      this.userList = res.data.users
    },
    //将switch的状态同步给服务器
    async switchState(val) {
      const { data: res } = await this.$http.put(`users/${val.id}/state/${val.mg_state}`)
      if (res.meta.status != 200) {
        this.$message.error('更新用户状态失败')
      }
    },
    //监听pagesize改变的事件
    handleSizeChange(val) {
      this.params.pagesize = val
      this.initUserList()
    },
    //监听pagenum改变的事件
    handleCurrentChange(val) {
      this.params.pagenum = val
      this.initUserList()
    },
    //当dialog关闭后 重置输入框
    addDialogClose() {
      this.$refs.ruleFormRef.resetFields()
    },
    //当点击添加按钮时，进行预校验
    addDialog() {
      this.$refs.ruleFormRef.validate(async val => {
        if (!val) {
          return this.$message.error('添加的信息有误')
        }
        //向服务器添加用户数据
        const { data: res } = await this.$http.post('users', this.ruleForm)
        if (res.meta.status != 201) {
          return this.$message.error('添加失败')
        }
        this.$message.success('添加成功')
        //隐藏对话框
        this.dialogVisible = false
        //刷新列表
        this.initUserList()
      })
    },
    //点击修改按钮 弹出要修改的用户信息
    async editDialog(id) {
      this.editDialogVisible = true
      const { data: res } = await this.$http.get('users/' + id)
      if (res.meta.status != 200) {
        return this.$message.error('获取用户信息失败')
      }
      this.editForm = res.data
    },
    //点击修改Dialog的取消按钮
    editCancel() {
      this.editDialogVisible = false
      this.$refs.editFormRef.resetFields()
    },
    //点击修改Dialog的确定按钮 进行预校验并修改用户
    editConfirm(id) {
      this.$refs.editFormRef.validate(async val => {
        if (!val) {
          return
        }
        const { data: res } = await this.$http.put('users/' + id, this.editForm)
        if (res.meta.status != 200) {
          return this.$message.error(res.meta.msg)
        }
        this.$message.success('修改用户信息成功')
        //关闭对话框
        this.editDialogVisible = false
        //刷新数据
        this.initUserList()
      })
    },
    // 点击删除按钮 删除用户信息
    async deleteUserInfo(id) {
      const msgConfirm = await this.$confirm('此操作将永久删除该用户, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(err => err)
      if (msgConfirm === 'confirm') {
        const { data: res } = await this.$http.delete('users/' + id)
        if (res.meta.status != 200) {
          return this.$message.error('删除失败')
        }
        //判断删除的是否为当前页的最后一个用户
        if (this.userList.length === 1) {
          this.params.pagenum = this.params.pagenum === 1 ? 1 : this.params.pagenum - 1
        }
        this.$message.success('删除成功!')
        //删除成功 刷新数据
        this.initUserList()
      } else {
        this.$message('已取消删除')
      }
    }
  }
}
</script>
<style lang="less" scoped>
.block {
  margin-top: 15px;
}
</style>