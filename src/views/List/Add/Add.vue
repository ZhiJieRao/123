<template>
  <div class="globalTop">
    <!-- 面包屑 -->
    <el-breadcrumb separator-class="el-icon-arrow-right" style="margin-bottom: 15px">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>添加商品</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片区域 -->
    <el-card class="box-card globalTop">
      <!-- alert警告 -->
      <el-alert title="消息提示的文案" type="info" center :closable="false"> </el-alert>
      <!-- 步骤条 -->
      <el-steps class="globalTop" :space="200" :active="activeIndex - 0" finish-status="success" align-center>
        <el-step title="基本信息"></el-step>
        <el-step title="商品参数"></el-step>
        <el-step title="商品属性"></el-step>
        <el-step title="商品图片"></el-step>
        <el-step title="商品内容"></el-step>
        <el-step title="完成"></el-step>
      </el-steps>
      <!-- tabs栏 -->
      <el-form :model="addForm" :rules="addRules" ref="ruleFormRef" label-width="100px" class="demo-ruleForm" label-position="top">
        <el-tabs v-model="activeIndex" class="globalTop" tab-position="left" :before-leave="beforeTabLeave" @tab-click="tabClicked">
          <el-tab-pane label="基本信息" name="0">
            <el-form-item label="商品名称" prop="goods_name"> <el-input v-model="addForm.goods_name"></el-input> </el-form-item>
            <el-form-item label="商品价格" prop="goods_price"> <el-input type="number" v-model="addForm.goods_price"></el-input> </el-form-item>
            <el-form-item label="商品数量" prop="goods_number"> <el-input type="number" v-model="addForm.goods_number"></el-input> </el-form-item>
            <el-form-item label="商品重量" prop="goods_weight"> <el-input type="number" v-model="addForm.goods_weight"></el-input> </el-form-item>
            <el-form-item label="商品分类" prop="goods_cat">
              <el-cascader
                v-model="addForm.goods_cat"
                :options="cascaderOptions"
                :props="cascaderProps"
                @change="handleChange"
                clearable
              ></el-cascader>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品参数" name="1">
            <!-- 获取表单的item项 -->
            <el-form-item :label="item.attr_name" v-for="item in manyTableData" :key="item.attr_id">
              <!-- 复选框组 -->
              <el-checkbox-group v-model="item.attr_vals">
                <el-checkbox border :label="obj" v-for="(obj, index) in item.attr_vals" :key="index"></el-checkbox>
              </el-checkbox-group>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品属性" name="2">
            <el-form-item :label="item.attr_name" v-for="item in onlyTableData" :key="item.attr_id">
              <el-input v-model="item.attr_vals"></el-input>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品图片" name="3">
            <!-- action表示要上传的完整地址 -->
            <el-upload
              class="upload"
              :action="upload"
              :on-preview="handlePreview"
              :on-remove="handleRemove"
              :on-success="handleSuccess"
              :file-list="pictureList"
              :headers="headerObj"
              list-type="picture"
            >
              <el-button size="small" type="primary">点击上传</el-button>
              <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
            </el-upload>
          </el-tab-pane>
          <el-tab-pane label="商品内容" name="4">
            <!-- 富文本编辑器 -->
            <quill-editor ref="quillRef" v-model="addForm.goods_introduce" />
            <el-button type="primary" class="globalTop" @click="addGoods">添加商品</el-button>
          </el-tab-pane>
        </el-tabs>
      </el-form>
      <!-- 图片预览 -->
      <el-dialog center title="预览" :visible.sync="previewVisible" width="50%">
        <img :src="previewPath" alt="" width="600px" height="500px" />
        <span slot="footer" class="dialog-footer"> </span>
      </el-dialog>
    </el-card>
  </div>
</template>

<script>
export default {
  name: 'Add',
  created() {
    this.initCateList()
  },
  data() {
    return {
      //表面步骤的index
      activeIndex: '0',

      //添加商品的数据对象
      addForm: {
        //商品名称
        goods_name: '',
        goods_price: 100,
        goods_number: 1,
        goods_weight: 1,
        //商品id
        goods_cat: [],
        pics: [],
        //商品介绍
        goods_introduce: '',
        //商品的参数
        attrs: []
      },
      //添加商品的表单规则验证
      addRules: {
        goods_name: [{ required: true, message: '请输入商品名称', trigger: 'blur' }],
        goods_price: [{ required: true, message: '请输入商品价格', trigger: 'blur' }],
        goods_number: [{ required: true, message: '请输入商品数量', trigger: 'blur' }],
        goods_weight: [{ required: true, message: '请输入商品重量', trigger: 'blur' }],
        goods_cat: [{ required: true, message: '请选择分类', trigger: 'blur' }]
      },

      //指定要渲染的数据源
      cascaderOptions: [],
      //props配置项
      cascaderProps: {
        expandTrigger: 'hover',
        value: 'cat_id',
        label: 'cat_name',
        children: 'children'
      },
      //动态列表数据
      manyTableData: [],
      //静态属性列表数据
      onlyTableData: [],
      // 上传图片的完整地址
      upload: 'http://127.0.0.1:8888/api/private/v1/upload',
      pictureList: [],
      //请求体header携带的数据
      headerObj: {
        Authorization: window.sessionStorage.getItem('token')
      },
      // 控制预览框的显示与隐藏
      previewVisible: false,
      //预览的图片
      previewPath: ''
    }
  },
  methods: {
    async initCateList() {
      const { data: res } = await this.$http.get('categories')
      this.judgeRes(res, 200, '获取商品分类失败')
      this.cascaderOptions = res.data
    },
    handleChange() {
      if (this.addForm.goods_cat.length != 3 && this.addForm.goods_cat.length !== 0) {
        this.addForm.goods_cat = []
        return this.$message.warning('请选择三级分类')
      }
    },
    beforeTabLeave(activeIndex, oldActiveIndex) {
      if (this.addForm.goods_cat.length != 3) {
        this.$message.error('请选择三级分类！')
        return false
      }
    },
    async tabClicked() {
      if (this.activeIndex == 1) {
        const { data: res } = await this.$http.get(`categories/${this.cateId}/attributes`, { params: { sel: 'many' } })
        this.judgeRes(res, 200, '获取参数列表失败')
        res.data.forEach(item => {
          item.attr_vals = item.attr_vals.length === 0 ? '' : item.attr_vals.split(',')
        })
        this.manyTableData = res.data
      } else if (this.activeIndex == 2) {
        const { data: res } = await this.$http.get(`categories/${this.cateId}/attributes`, { params: { sel: 'only' } })
        this.judgeRes(res, 200, '获取参数列表失败')
        this.onlyTableData = res.data
      }
    },
    //预览时的回调
    handlePreview(file) {
      //动态绑定图片地址
      this.previewPath = file.response.data.url
      this.previewVisible = true
    },
    //删除图片的回调
    handleRemove(file) {
      const pathPic = file.response.data.tmp_path
      const i = this.addForm.pics.findIndex(obj => obj.pic === pathPic)
      //从addForm数组中删除对应的图片
      this.addForm.pics.splice(i, 1)
    },
    //图片成功上传的回调
    handleSuccess(response) {
      // 这里不是解构赋值 -- 就是制造一个对象,键为pic,值为response.data.tmp_path
      const picObj = { pic: response.data.tmp_path }
      this.addForm.pics.push(picObj)
    },
    //添加商品
    addGoods() {
      this.$refs.ruleFormRef.validate(async val => {
        if (!val) {
          return this.$message.error('请检查表单')
        }
        //执行添加商品的逻辑业务
        const ADDFORM = JSON.parse(JSON.stringify(this.addForm))
        ADDFORM.goods_cat = ADDFORM.goods_cat.join(',')
        //处理动态参数
        this.manyTableData.forEach(item => {
          // 因为空字符串转换为数组会报错.如果不加判断,则会报错,所以先判断item.attr_vals是否有值
          if (item.attr_vals) {
            const newInfo = { attr_id: item.attr_id, attr_value: item.attr_vals.join(' ') }
            this.addForm.attrs.push(newInfo)
          }
        })
        //处理静态属性
        this.onlyTableData.forEach(item => {
          const newInfo = { attr_id: item.attr_id, attr_value: item.attr_vals }
          this.addForm.attrs.push(newInfo)
        })
        ADDFORM.attrs = this.addForm.attrs
        //发起请求添加商品
        //商品名称必须唯一
        const { data: res } = await this.$http.post('goods', ADDFORM)
        this.judgeRes(res, 201, '添加商品失败', '添加商品成功')
        //跳转到商品页面
        this.$router.push('/goods')
      })
    }
  },
  computed: {
    cateId() {
      return this.addForm.goods_cat.length === 3 ? this.addForm.goods_cat[2] : ''
    }
  }
}
</script>

<style lang="less" scoped>
.el-checkbox {
  margin: 0px 10px 0 0 !important;
}
</style>