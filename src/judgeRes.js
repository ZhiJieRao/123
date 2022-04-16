export default {
  judgeRes(data, stu, err, suc) {
    if (data.meta.status !== stu) {
      return this.$message.error(err)
    }
    // 如果suc不填,则会把undefined传过来 -- 定义未使用
    else if (suc !== undefined) {
      this.$message.success(suc)
    }
  }
}