<template>
  <div class="globalTop">
    <!-- 面包屑 -->
    <el-breadcrumb separator-class="el-icon-arrow-right" style="margin-bottom: 15px">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>数据统计</el-breadcrumb-item>
      <el-breadcrumb-item>数据报表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片区域 -->
    <el-card class="box-card globalTop">
      <div style="width: 750px; height: 500px" ref="chart"></div>
    </el-card>
  </div>
</template>

<script>
export default {
  name: 'Report',
  mounted() {
    this.initCharts()
  },
  data() {
    return {
      //用数据绘制图表
      options: {
        title: {
          text: '用户来源'
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross',
            label: {
              backgroundColor: '#E9EEF3'
            }
          }
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
        xAxis: [
          {
            boundaryGap: false
          }
        ],
        yAxis: [
          {
            type: 'value'
          }
        ]
      }
    }
  },
  methods: {
    async initCharts() {
      //初始化echarts实例
      let myChart = this.$echarts.init(this.$refs.chart)
      console.log(this.$refs.chart)
      //
      const { data: res } = await this.$http.get('reports/type/1')
      this.judgeRes(res, 200, '获取折线图数据失败')
      //拼接成新对象
      const result = { ...this.options, ...res.data }
      console.log(result)
      // 展示图表
      myChart.setOption(result)
    }
  }
}
</script>

<style>
</style>