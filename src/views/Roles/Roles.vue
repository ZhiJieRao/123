<template>
  <div style="margin-top: 15px">
    <!-- 面包屑 -->
    <el-breadcrumb separator-class="el-icon-arrow-right" style="margin-bottom: 25px">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 添加角色按钮 -->
    <el-button type="primary" @click="addRolesUser">添加角色</el-button>
    <!-- 添加角色 弹出框 -->
    <el-dialog title="添加角色" :visible.sync="rolesDialogVisible" width="50%">
      <el-form :model="rolesRuleForm" :rules="rolesRules" ref="ruleFormRef" label-width="100px" class="demo-ruleForm">
        <!-- 角色名称 -->
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model.trim="rolesRuleForm.roleName" status-icon></el-input>
        </el-form-item>
        <!-- 角色描述 -->
        <el-form-item label="角色描述" prop="roleDesc">
          <el-input v-model.trim="rolesRuleForm.roleDesc" status-icon></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="rolesDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="rolesConfirm">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 角色列表卡片区域 -->
    <el-card class="box-card" style="margin-top: 15px">
      <el-table :data="rolesList" border stripe>
        <!-- 展开列 -->
        <el-table-column type="expand">
          <template #default="slotProps">
            <!-- 栅格系统进行布局 -->
            <el-row :class="['rowBottom','vcenter',index1===0?'rowTop':'']," v-for="(obj1, index1) in slotProps.row.children" :key="obj1.id">
              <!-- 一级分类 -->
              <el-col :span="4">
                <el-tag closable @close="handleClose(slotProps.row, obj1.id)">{{ obj1.authName }}</el-tag>
                <i class="el-icon-arrow-right"></i>
              </el-col>
              <!-- 二级分类 -->
              <el-col col :span="18">
                <el-row :class="[index2 === 0 ? '' : 'rowTop', 'vcenter']" v-for="(obj2, index2) in obj1.children" :key="obj2.id">
                  <el-col :span="4">
                    <el-tag @close="handleClose(slotProps.row, obj2.id)" closable type="success">{{ obj2.authName }} </el-tag>
                    <i class="el-icon-arrow-right"></i>
                  </el-col>
                  <!-- 三级分类 -->
                  <el-col :span="20">
                    <el-tag closable v-for="obj3 in obj2.children" :key="obj3.id" type="warning" @close="handleClose(slotProps.row, obj3.id)">{{ obj3.authName }}</el-tag>
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
          </template>
        </el-table-column>
        <!-- 索引列 -->
        <el-table-column label="#" type="index"></el-table-column>
        <el-table-column label="角色名称 " prop="roleName"></el-table-column>
        <el-table-column label="角色描述" prop="roleDesc"></el-table-column>
        <el-table-column label="操作">
          <template #default="slotProps">
            <el-button type="primary" icon="el-icon-finished" @click="editRoles(slotProps.row.id)">编辑</el-button>
            <el-button type="danger" icon="el-icon-delete" @click="deleteRolesUser(slotProps.row.id)">删除</el-button>
            <el-button type="warning" icon="el-icon-edit-outline" @click="showSetRightsDiaLog(slotProps.row)">分配权限</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    <!-- 编辑角色信息 -->
    <el-dialog title="编辑角色" :visible.sync="editDialogVisible" width="50%">
      <el-form :model="editRuleForm" :rules="rolesRules" ref="ruleFormRef" label-width="100px" class="demo-ruleForm">
        <!-- 角色名称 -->
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model.trim="editRuleForm.roleName" status-icon></el-input>
        </el-form-item>
        <!-- 角色描述 -->
        <el-form-item label="角色描述" prop="roleDesc">
          <el-input v-model.trim="editRuleForm.roleDesc" status-icon></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editConfirm">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 分配角色 -->
    <el-dialog title="分配角色" center :visible.sync="setDialogVisible" width="50%">
      <!-- 树形控件 -->
      <el-tree :data="rightsList" :props="defaultProps" show-checkbox default-expand-all node-key="id" :default-checked-keys="defaultCK" ref="treeRef"></el-tree>
      <span slot="footer" class="dialog-footer">
        <el-button @click="setDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="setRolesRight">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'Roles',
  created() {
    this.initRolesInfo()
  },
  data() {
    return {
      //保存axios回来的数据
      rolesList: [],
      //保存分配权限时获得的所有权限列表
      rightsList: [],
      // 控制添加角色弹出框的显示与隐藏
      rolesDialogVisible: false,
      //保存添加角色时输入的input
      rolesRuleForm: {},
      // 添加角色验证规则
      rolesRules: {
        //
        roleName: [{ required: true, message: '请输入角色名称', trigger: 'blur' }],
        //
        roleDesc: [{ required: true, message: '请输入合适的角色描述', trigger: 'blur' }]
      },
      //控制编辑按钮 弹出框的显示与隐藏
      editDialogVisible: false,
      //
      editRuleForm: {},
      // 控制分配角色弹出框的显示与隐藏
      setDialogVisible: false,
      //<el-tree></el-tree>
      defaultProps: {
        children: 'children',
        label: 'authName'
      },
      //存放默认展开的节点
      defaultCK: [],
      roleId: ''
    }
  },
  methods: {
    // 获取角色列表数据
    async initRolesInfo() {
      const { data: res } = await this.$http.get('roles')
      if (res.meta.status != 200) {
        return this.$message.error('获取角色列表失败')
      }
      this.rolesList = res.data
    },
    //单击 添加角色按钮
    addRolesUser() {
      this.rolesDialogVisible = true
    },
    // 点击添加角色确定按钮进行预验证
    rolesConfirm() {
      this.$refs.ruleFormRef.validate(async val => {
        if (!val) {
          return this.$message.error('请输入符合规则的字符串')
        }
        const { data: res } = await this.$http.post('roles', this.rolesRuleForm)

        if (res.meta.status != 201) {
          return this.$message.error('添加角色失败')
        }
        this.$message.success('添加角色成功!')
        //隐藏对话框
        this.rolesDialogVisible = false
        //刷新数据
        this.initRolesInfo()
      })
    },
    //点击编辑按钮进行修改角色
    async editRoles(id) {
      this.editDialogVisible = true
      const { data: res } = await this.$http.get('roles/' + id)
      if (res.meta.status != 200) {
        return
      }
      this.editRuleForm = res.data
      //
      this.$refs.ruleFormRef.resetFields()
    },
    //点击编辑按钮的确定按钮进行预验证
    editConfirm() {
      this.$refs.ruleFormRef.validate(async val => {
        if (!val) {
          return this.$message.error('请输入符合规则的字符串')
        }
        const { data: res } = await this.$http.put('roles/' + this.editRuleForm.roleId, this.editRuleForm)
        if (res.meta.status != 200) {
          return this.$message.error('修改角色失败,' + res.meta.msg)
        }
        this.$message.success('修改角色成功!')
        //成功以后隐藏弹出框
        this.editDialogVisible = false
        //重新刷新数据
        this.initRolesInfo()
      })
    },
    //点击编辑按钮进行修改角色
    async deleteRolesUser(id) {
      const msg = await this.$confirm('此操作将永久删除该角色, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(err => err)
      if (msg === 'cancel') {
        return this.$message('已取消删除')
      } else {
        const { data: res } = await this.$http.delete('roles/' + id)
        if (res.meta.status != 200) {
          return this.$message.error('删除失败')
        }
      }
      //
      this.$message.success('删除成功!')
      //重新刷新
      this.initRolesInfo()
    },
    //点击tag的删除分类
    async handleClose(roles, rightId) {
      // 弹框确认是否删除
      const msg = await this.$confirm('此操作将永久删除该分类, 是否删除?', '提示', {
        confirmButtonText: '确定删除',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(err => err)
      //取消
      if (msg === 'cancel') {
        return this.$message('已取消删除')
      }
      //确定
      const { data: res } = await this.$http.delete(`roles/${roles['id']}/rights/${rightId}`)
      console.log(res)

      if (res.meta.status != 200) {
        return this.$message.error('删除分类失败')
      }
      this.$message.success('删除分类成功')
      //如果写这行代码会重新刷新 折叠框折叠
      // this.initRolesInfo()
      //根据vue 数据变化会实时的渲染到页面上 roles--->slotProps.row
      roles.children = res.data
    },
    //点击分配权限按钮 弹出dioLog
    async showSetRightsDiaLog(role) {
      // 保存角色id 给下面的setRolesRight使用
      this.roleId = role.id

      const { data: res } = await this.$http.get('rights/tree')
      if (res.meta.status === 200) {
        this.rightsList = res.data
        console.log(res.data)
      }
      //调用递归时清空保存三级权限id的数组
      this.defaultCK = []
      //递归获取三级权限的节点
      this.getLeafKays(role, this.defaultCK)

      this.setDialogVisible = true
    },
    // 通过递归的形式，获取角色下所有三级权限的id,并保存到defaultCK数组中
    // node 三级节点, arr 保存id的数组
    getLeafKays(node, arr) {
      //如果当前的值是三级节点，则将id放到数组中
      if (!node.children) {
        return arr.push(node.id)
      }
      node.children.forEach(item => {
        this.getLeafKays(item, arr)
      })
    },
    // 点击树型控件的确认按钮为角色授权
    async setRolesRight() {
      const keys = [...this.$refs.treeRef.getCheckedKeys(), ...this.$refs.treeRef.getHalfCheckedKeys()].join(',')
      const { data: res } = await this.$http.post(`roles/${this.roleId}/rights`, { rids: keys })
      if (res.meta.status === 200) {
        this.$message.success('更新成功!')
      }

      //
      this.setDialogVisible = false
      //
      this.initRolesInfo()
    }
  }
}
</script>

<style lang="less" scoped>
.vcenter {
  display: flex;
  align-items: center;
}
.el-tag {
  margin: 7px;
}
.rowTop {
  border-top: 1px solid #ccc;
}
.rowBottom {
  border-bottom: 1px solid #ccc;
  margin: 0 48px 0 48px;
}
</style>

