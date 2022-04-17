//项目发布阶段用到的插件(移除所有的console方法) -- babel-plugin-transform-remove-console
const prodPlugin = []
if (process.env.NODE_ENV === 'produciton') {
  this.prodPlugin.push('transform-remove-console')
}
module.exports = {
  "presets": [
    "@vue/cli-plugin-babel/preset"
  ],
  "plugins": [
    [
      "component",
      {
        "libraryName": "element-ui",
        "styleLibraryName": "theme-chalk"
      }
    ],
    ...prodPlugin
    // ["transform-remove-console"]
  ]
}