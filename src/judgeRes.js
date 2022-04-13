export default {
  judgeRes(data, stu, err, suc) {
    if (data.meta.status !== stu) {
      return this.$message.error(err)
    } else {
      this.$message.success(suc)
    }
  }
}