<template>
  <div class="globalTop">
    <!-- 面包屑 -->
    <el-breadcrumb separator-class="el-icon-arrow-right" style="margin-bottom: 15px">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>订单管理</el-breadcrumb-item>
      <el-breadcrumb-item>订单列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片区域 -->
    <el-card class="box-card globalTop">
      <el-row :gutter="20">
        <el-col :span="6">
          <!-- 搜索框 -->
          <el-input placeholder="请输入内容" v-model="queryInfo.query" class="input-with-select,globalTop" clearable>
            <el-button slot="append" icon="el-icon-search"></el-button>
          </el-input>
        </el-col>
      </el-row>
      <!-- 表格区域 -->
      <div class="globalTop">
        <el-table :data="ordersList" border style="width: 100%" highlight-current-row>
          <el-table-column label="#" type="index"></el-table-column>
          <el-table-column prop="order_number" label="订单编号"></el-table-column>
          <el-table-column prop="order_price" label="订单价格"></el-table-column>
          <el-table-column prop="order_pay" label="是否付款">
            <template #default="slotProps">
              <el-button v-if="slotProps.row.order_pay == 0" type="danger" plain>未付款</el-button>
              <el-button v-else type="success" plain>已付款</el-button>
            </template>
          </el-table-column>
          <el-table-column prop="is_send" label="是否发货"></el-table-column>
          <el-table-column prop="create_time" label="下单时间">
            <template #default="slotProps">
              {{ slotProps.row.create_time | dataFormat }}
            </template>
          </el-table-column>
          <el-table-column label="操作">
            <template #default="slotProps">
              <!-- 修改地址 -->
              <el-tooltip class="item" effect="dark" content="修改地址" placement="top" :enterable="false">
                <el-button type="primary" icon="el-icon-edit" circle size="mini" @click="editAddress"> </el-button>
              </el-tooltip>
              <!-- 物流查询 -->
              <el-tooltip class="item" effect="dark" content="物流进度" placement="top" :enterable="false">
                <el-button type="success" icon="el-icon-location-outline" circle size="mini" @click="searchAddress"></el-button>
              </el-tooltip>
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
        :total="totals"
        class="globalTop"
        background
      >
      </el-pagination>
      <!-- 修改地址弹出框 -->
      <el-dialog title="修改地址" center :visible.sync="editDialogVisible" width="50%" @close="editDialogClose">
        <el-form :model="editForm" :rules="editRules" ref="ruleRef" label-width="110px" class="demo-ruleForm">
          <el-form-item label="省市区/县" prop="consignee_addr">
            <el-cascader v-model="editForm.consignee_addr" :options="cityData" clearable></el-cascader>
          </el-form-item>
          <el-form-item label="详细地址" prop="detail_attr">
            <el-input v-model="editForm.detail_attr" clearable></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="editDialogVisible = false">取 消</el-button>
          <el-button type="primary">确 定</el-button>
        </span>
      </el-dialog>
      <!-- 查询物流弹出框 -->
      <el-dialog title="【存储在本地】物流查询" center :visible.sync="serDialogVisible" width="50%">
        <!-- 时间线 -->
        <el-timeline :reverse="true">
          <el-timeline-item v-for="(item, index) in physicalData" :key="index" :timestamp="item.time">
            {{ item.context }}
          </el-timeline-item>
        </el-timeline>
      </el-dialog>
    </el-card>
  </div>
</template>
<script>
import cityData from '@/util/citydata.js'
import ajax from 'axios'
export default {
  name: 'Order',
  data() {
    return {
      queryInfo: {
        query: '',
        pagenum: 1,
        pagesize: 5
      },
      //订单列表的数据
      ordersList: [],
      totals: 0,
      //
      editDialogVisible: false,
      editForm: {
        // 省/市区
        consignee_addr: [],
        //详细地址
        detail_attr: ''
      },
      editRules: {
        consignee_addr: [{ required: true, message: '请选择省市区/县', trigger: 'blur' }],
        detail_attr: [{ required: true, message: '请输入详细地址', trigger: 'blur' }]
      },
      //级联选择器options对应的数据
      cityData,
      //
      serDialogVisible: false,
      //物流数据
      physicalData: []
    }
  },
  created() {
    this.initOrdersList()
  },
  methods: {
    //
    async initOrdersList() {
      const { data: res } = await this.$http.get('orders', { params: this.queryInfo })
      this.judgeRes(res, 200, '获取订单列表失败')
      this.ordersList = res.data.goods
      this.totals = res.data.total
      console.log(this.ordersList)
    },
    handleSizeChange(val) {
      this.queryInfo.pagesize = val
      this.initOrdersList()
    },
    handleCurrentChange(val) {
      this.queryInfo.pagenum = val
      this.initOrdersList()
    },

    editAddress() {
      this.editDialogVisible = true
    },
    editDialogClose() {
      this.$refs.ruleRef.resetFields()
    },
    //查询物流
    async searchAddress() {
      //获取kuaidi.json的数据
      this.serDialogVisible = true
      const { data: res } = await ajax.get('http://localhost:8080/kuaidi.json')
      this.judgeRes(res, 200, '物理查询失败', '静态物流查询成功!')
      this.physicalData = res.data
    }
  }
}
</script>

