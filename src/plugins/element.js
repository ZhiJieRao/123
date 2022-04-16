import Vue from 'vue'
import {
  Button, Form, Input, FormItem, Message, Container, Header, Aside, Main, Menu, Submenu, MenuItemGroup, MenuItem, Row, Col, Card, Table, TableColumn,
  Breadcrumb, BreadcrumbItem, Switch, Tooltip, Pagination, Dialog, MessageBox, Tag, Tree, Select, Option,
  Cascader, Alert, Tabs, TabPane, Steps, Step, CheckboxGroup, Checkbox, Upload
} from 'element-ui'

//配置Message为全局属性
Vue.prototype.$message = Message
//
Vue.prototype.$confirm = MessageBox.confirm
Vue.use(Button)
Vue.use(Form)
Vue.use(Input)
Vue.use(FormItem)
Vue.use(Container)
Vue.use(Header)
Vue.use(Aside)
Vue.use(Main)
Vue.use(Menu)
Vue.use(Submenu)
Vue.use(MenuItemGroup)
Vue.use(MenuItem)
Vue.use(Row)
Vue.use(Col),
  Vue.use(Card),
  Vue.use(Table),
  Vue.use(TableColumn),
  Vue.use(Breadcrumb),
  Vue.use(BreadcrumbItem),
  Vue.use(Switch),
  Vue.use(Tooltip),
  Vue.use(Pagination),
  Vue.use(Dialog),
  Vue.use(Tag),
  Vue.use(Tree),
  Vue.use(Select),
  Vue.use(Option),
  Vue.use(Cascader),
  Vue.use(Alert),
  Vue.use(Tabs),
  Vue.use(TabPane),
  Vue.use(Steps),
  Vue.use(Step),
  Vue.use(CheckboxGroup),
  Vue.use(Checkbox),
  Vue.use(Upload)
